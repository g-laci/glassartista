#!/usr/bin/env node
// SEO audit for all three domains and every locale. No dependencies.
//
//   npm run build && npm start              # then, in another terminal:
//   npm run seo:audit                        # audits http://localhost:3000, emulating each domain via the Host header
//   npm run seo:audit -- --base http://localhost:3100
//   npm run seo:audit -- --live              # audits the production domains over the internet
//
// Starting from each domain's robots.txt and sitemap.xml it checks every page for: status, <title>,
// meta description (present, unique), canonical (self-referencing, absolute), robots meta (no noindex),
// <html lang>, hreflang (self-reference, reciprocity, x-default, targets indexable), Open Graph / Twitter
// tags and image, JSON-LD (valid JSON, expected types), <h1>, image alt attributes, internal links
// (no 4xx, no redirects) and the legacy-URL redirects. Exits with code 1 if any error was found.

import http from "node:http";
import https from "node:https";

const SITES = {
    "glassartista.com": "https://www.glassartista.com",
    "tiffanystudio.at": "https://www.tiffanystudio.at",
    "tiffanystudio.hu": "https://www.tiffanystudio.hu",
};
const ORIGINS = Object.values(SITES);

/** Legacy / duplicate URLs and their expected permanent redirect targets. */
const REDIRECTS = [
    ["https://www.glassartista.com/de", "https://www.glassartista.com/"],
    ["https://www.glassartista.com/de/gallery", "https://www.glassartista.com/gallery"],
    ["https://www.glassartista.com/tiffanystudio", "https://www.tiffanystudio.at/"],
    ["https://www.glassartista.com/hu/tiffanystudio/tiffanylamps", "https://www.tiffanystudio.hu/tiffanylamps"],
    ["https://www.glassartista.com/en/tiffanystudio/contact", "https://www.tiffanystudio.at/en/contact"],
    ["https://www.tiffanystudio.at/de", "https://www.tiffanystudio.at/"],
    ["https://www.tiffanystudio.at/hu", "https://www.tiffanystudio.hu/"],
    ["https://www.tiffanystudio.at/hu/contact", "https://www.tiffanystudio.hu/contact"],
    ["https://www.tiffanystudio.at/home", "https://www.glassartista.com/home"],
    ["https://www.tiffanystudio.at/en/gallery", "https://www.glassartista.com/en/gallery"],
    ["https://www.tiffanystudio.at/tiffanystudio/tiffanylamps", "https://www.tiffanystudio.at/tiffanylamps"],
    ["https://www.tiffanystudio.hu/hu", "https://www.tiffanystudio.hu/"],
    ["https://www.tiffanystudio.hu/de", "https://www.tiffanystudio.at/"],
    ["https://www.tiffanystudio.hu/en/tiffanylamps", "https://www.tiffanystudio.at/en/tiffanylamps"],
    ["https://www.tiffanystudio.hu/details", "https://www.glassartista.com/hu/details"],
];

/** URLs that must answer 404. */
const NOT_FOUND = [
    "https://www.glassartista.com/this-page-does-not-exist",
    "https://www.glassartista.com/en/this-page-does-not-exist",
    "https://www.glassartista.com/no-such-file.txt",
    "https://www.tiffanystudio.at/this-page-does-not-exist",
    "https://www.tiffanystudio.hu/this-page-does-not-exist",
];

// ---------------------------------------------------------------------------------------------

const args = process.argv.slice(2);
const LIVE = args.includes("--live");
const BASE = LIVE ? null : new URL(args[args.indexOf("--base") + 1] && args.includes("--base")
    ? args[args.indexOf("--base") + 1] : "http://localhost:3000");

/** "https://x.com/" and "https://x.com" are the same URL; compare them in one form. */
const norm = (url) => (url ? url.replace(/^(https?:\/\/[^/]+)\/$/, "$1") : url);

const errors = [];
const warnings = [];
const error = (url, message) => errors.push(`${url}\n    ✗ ${message}`);
const warn = (url, message) => warnings.push(`${url}\n    ! ${message}`);

/** GET without following redirects. In local mode the production URL is sent to BASE with its Host header. */
function get(url) {
    const target = new URL(url);
    const local = !LIVE;
    const requestUrl = local ? new URL(target.pathname + target.search, BASE) : target;
    const client = requestUrl.protocol === "https:" ? https : http;
    return new Promise((resolve, reject) => {
        const req = client.request(requestUrl, {
            method: "GET",
            headers: {host: target.host, "user-agent": "seo-audit (Googlebot-compatible check)", accept: "text/html,*/*"},
        }, (res) => {
            const chunks = [];
            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => {
                let location = res.headers.location;
                if (location && local) {
                    // Same-site redirects come back relative to BASE: map them to the production origin.
                    const resolved = new URL(location, requestUrl);
                    location = resolved.origin === BASE.origin ? `${target.origin}${resolved.pathname}${resolved.search}` : resolved.href;
                } else if (location) {
                    location = new URL(location, target).href;
                }
                resolve({status: res.statusCode, headers: res.headers, location, body: Buffer.concat(chunks).toString("utf8")});
            });
        });
        req.on("error", reject);
        req.setTimeout(30000, () => req.destroy(new Error("timeout")));
        req.end();
    });
}

const decode = (value) => value
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

function tags(html, name) {
    const result = [];
    const re = new RegExp(`<${name}\\b([^>]*)>`, "gi");
    for (const match of html.matchAll(re)) {
        const attrs = {};
        for (const attr of match[1].matchAll(/([\w:-]+)(?:\s*=\s*"([^"]*)")?/g)) attrs[attr[1].toLowerCase()] = decode(attr[2] ?? "");
        result.push(attrs);
    }
    return result;
}

function parsePage(html) {
    const metas = tags(html, "meta");
    const links = tags(html, "link");
    const meta = (key, attr = "name") => metas.filter((m) => m[attr] === key).map((m) => m.content);
    // Only the document <title> (not <title> elements inside inline SVG icons).
    const head = html.split(/<body\b/i)[0];
    return {
        lang: tags(html, "html")[0]?.lang,
        titles: [...head.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => decode(m[1]).trim()),
        descriptions: meta("description"),
        robots: meta("robots"),
        canonicals: links.filter((l) => l.rel === "canonical").map((l) => l.href),
        hreflang: Object.fromEntries(links.filter((l) => l.rel === "alternate" && l.hreflang).map((l) => [l.hreflang, l.href])),
        og: Object.fromEntries(metas.filter((m) => m.property?.startsWith("og:")).map((m) => [m.property, m.content])),
        twitter: Object.fromEntries(metas.filter((m) => m.name?.startsWith("twitter:")).map((m) => [m.name, m.content])),
        jsonLd: [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]),
        h1: (html.match(/<h1\b/gi) || []).length,
        images: tags(html, "img"),
        anchors: tags(html, "a").map((a) => a.href).filter(Boolean),
    };
}

const pages = new Map(); // url -> parsed page
const linkTargets = new Set();

async function auditRobots(origin) {
    const url = `${origin}/robots.txt`;
    const res = await get(url);
    if (res.status !== 200) return error(url, `status ${res.status}`);
    if (!String(res.headers["content-type"]).startsWith("text/plain")) error(url, `content-type ${res.headers["content-type"]}`);
    if (!res.body.includes(`Sitemap: ${origin}/sitemap.xml`)) error(url, "missing Sitemap line for this domain");
    if (/^Disallow:\s*\/\s*$/m.test(res.body)) error(url, "disallows the whole site");
    if (/^Disallow:\s*\/_next/m.test(res.body)) error(url, "blocks /_next (needed for rendering)");
}

async function readSitemap(origin) {
    const url = `${origin}/sitemap.xml`;
    const res = await get(url);
    if (res.status !== 200) {
        error(url, `status ${res.status}`);
        return [];
    }
    if (!String(res.headers["content-type"]).includes("xml")) error(url, `content-type ${res.headers["content-type"]}`);
    const entries = [...res.body.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
        const block = m[1];
        return {
            loc: decode(block.match(/<loc>([^<]*)<\/loc>/)?.[1] ?? ""),
            lastmod: block.match(/<lastmod>([^<]*)<\/lastmod>/)?.[1],
            alternates: Object.fromEntries([...block.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((a) => [a[1], decode(a[2])])),
            images: [...block.matchAll(/<image:loc>([^<]*)<\/image:loc>/g)].map((a) => decode(a[1])),
        };
    });
    if (!entries.length) error(url, "no <url> entries");
    for (const entry of entries) {
        if (entry.loc !== origin && !entry.loc.startsWith(`${origin}/`)) error(url, `foreign URL in sitemap: ${entry.loc}`);
        if (entry.lastmod && !/^\d{4}-\d{2}-\d{2}/.test(entry.lastmod)) error(url, `invalid lastmod ${entry.lastmod} for ${entry.loc}`);
        if (!entry.lastmod) warn(url, `no lastmod for ${entry.loc}`);
    }
    return entries;
}

function checkJsonLd(url, page) {
    if (!page.jsonLd.length) return error(url, "no JSON-LD structured data");
    const types = [];
    for (const raw of page.jsonLd) {
        let data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            error(url, `invalid JSON-LD: ${e.message}`);
            continue;
        }
        if (data["@context"] !== "https://schema.org") error(url, "JSON-LD @context is not https://schema.org");
        for (const node of data["@graph"] || [data]) {
            types.push(node["@type"]);
            if (node["@type"] === "LocalBusiness") {
                for (const key of ["name", "address", "url", "telephone"]) if (!node[key]) error(url, `LocalBusiness without ${key}`);
            }
            if (/Page$/.test(node["@type"]) && node.url !== page.canonicals[0]) error(url, `${node["@type"]}.url ${node.url} ≠ canonical`);
            if (node["@type"] === "BreadcrumbList") {
                for (const item of node.itemListElement) if (!/^https:\/\//.test(item.item)) error(url, "breadcrumb item without absolute URL");
            }
        }
    }
    for (const required of ["LocalBusiness", "WebSite"]) if (!types.includes(required)) error(url, `JSON-LD missing ${required}`);
    if (!types.some((t) => /Page$/.test(t))) error(url, "JSON-LD missing WebPage");
}

async function auditPage(url) {
    const res = await get(url);
    if (res.status !== 200) return error(url, `status ${res.status}${res.location ? ` → ${res.location}` : ""} (sitemap URLs must answer 200)`);
    if (res.headers["x-robots-tag"]?.includes("noindex")) error(url, `X-Robots-Tag: ${res.headers["x-robots-tag"]}`);
    const page = parsePage(res.body);
    pages.set(url, page);

    if (page.titles.length !== 1 || !page.titles[0]) error(url, `expected one non-empty <title>, found ${page.titles.length}`);
    else if (page.titles[0].length > 70) warn(url, `long title (${page.titles[0].length} chars)`);
    if (page.descriptions.length !== 1 || !page.descriptions[0]) error(url, "missing meta description");
    else if (page.descriptions[0].length < 70 || page.descriptions[0].length > 200) warn(url, `description length ${page.descriptions[0].length}`);
    if (page.canonicals.length !== 1) error(url, `expected one canonical, found ${page.canonicals.length}`);
    else if (page.canonicals[0] !== url) error(url, `canonical ${page.canonicals[0]} is not self-referencing`);
    if (page.robots.some((r) => /noindex|none/.test(r))) error(url, `robots meta: ${page.robots.join(", ")}`);

    // hreflang
    const selfLang = Object.entries(page.hreflang).find(([lang, href]) => lang !== "x-default" && href === url)?.[0];
    if (!selfLang) error(url, "hreflang set does not reference the page itself");
    else if (page.lang !== selfLang) error(url, `<html lang="${page.lang}"> ≠ hreflang ${selfLang}`);
    if (!page.hreflang["x-default"]) error(url, "no x-default hreflang");
    for (const href of Object.values(page.hreflang)) if (!/^https:\/\//.test(href)) error(url, `relative hreflang URL ${href}`);

    // Open Graph / Twitter
    for (const key of ["og:title", "og:description", "og:url", "og:image", "og:type", "og:site_name", "og:locale"]) {
        if (!page.og[key]) error(url, `missing ${key}`);
    }
    if (page.og["og:url"] && page.og["og:url"] !== url) error(url, `og:url ${page.og["og:url"]} ≠ page URL`);
    if (!page.twitter["twitter:card"]) error(url, "missing twitter:card");
    if (page.og["og:image"]) linkTargets.add(`IMAGE ${page.og["og:image"]}`);

    checkJsonLd(url, page);

    if (page.h1 === 0) error(url, "no <h1>");
    const noAlt = page.images.filter((img) => img.alt === undefined);
    if (noAlt.length) error(url, `${noAlt.length} <img> without alt attribute (${noAlt[0].src})`);
    const emptyAlt = page.images.filter((img) => img.alt === "");
    if (emptyAlt.length) warn(url, `${emptyAlt.length} <img> with empty alt`);

    for (const href of page.anchors) {
        const resolved = new URL(href, url);
        if (!ORIGINS.includes(resolved.origin)) continue;
        resolved.hash = "";
        linkTargets.add(resolved.href);
    }
}

function checkHreflangReciprocity(sitemapUrls) {
    for (const [url, page] of pages) {
        for (const [lang, href] of Object.entries(page.hreflang)) {
            if (lang === "x-default") continue;
            const other = pages.get(href);
            if (!other) {
                error(url, `hreflang ${lang} → ${href} is not an audited sitemap page`);
                continue;
            }
            if (JSON.stringify(other.hreflang) !== JSON.stringify(page.hreflang)) {
                error(url, `hreflang set differs from the one on ${href} (not reciprocal)`);
            }
        }
        if (!sitemapUrls.has(url)) error(url, "page not listed in any sitemap");
    }
}

function checkDuplicates(field) {
    const seen = new Map();
    for (const [url, page] of pages) {
        const value = field === "title" ? page.titles[0] : page.descriptions[0];
        if (!value) continue;
        if (seen.has(value)) error(url, `duplicate ${field} (also on ${seen.get(value)})`);
        else seen.set(value, url);
    }
}

async function checkLinkTargets() {
    for (const target of linkTargets) {
        const isImage = target.startsWith("IMAGE ");
        const url = isImage ? target.slice(6) : target;
        const res = await get(url);
        if (isImage) {
            if (res.status !== 200 || !String(res.headers["content-type"]).startsWith("image/")) {
                error(url, `share image: status ${res.status}, ${res.headers["content-type"]}`);
            }
        } else if (res.status >= 400) {
            error(url, `internal link target answers ${res.status}`);
        } else if (res.status >= 300) {
            warn(url, `internal link target redirects (${res.status} → ${res.location})`);
        }
    }
}

async function checkRedirects() {
    for (const [from, to] of REDIRECTS) {
        const res = await get(from);
        if (res.status !== 301 && res.status !== 308) error(from, `expected permanent redirect to ${to}, got ${res.status}`);
        else if (norm(res.location) !== norm(to)) error(from, `redirects to ${res.location}, expected ${to}`);
    }
    for (const url of NOT_FOUND) {
        const res = await get(url);
        if (res.status !== 404) error(url, `expected 404, got ${res.status}`);
        else if (res.headers["content-type"]?.includes("html") && !/<meta name="robots" content="noindex/.test(res.body)) {
            warn(url, "404 page without robots noindex meta");
        }
    }
}

async function main() {
    console.log(`SEO audit (${LIVE ? "live production domains" : `local server ${BASE.origin}, Host header per domain`})\n`);
    const sitemapUrls = new Set();
    for (const origin of ORIGINS) {
        await auditRobots(origin);
        const entries = await readSitemap(origin);
        for (const entry of entries) {
            sitemapUrls.add(entry.loc);
            await auditPage(entry.loc);
            const page = pages.get(entry.loc);
            if (page && JSON.stringify(entry.alternates) !== JSON.stringify(page.hreflang)) {
                error(entry.loc, "sitemap hreflang alternates differ from the page's <link rel=alternate>");
            }
        }
        console.log(`${origin}: ${entries.length} sitemap URLs, ${entries.reduce((n, e) => n + e.images.length, 0)} image entries`);
    }
    checkHreflangReciprocity(sitemapUrls);
    checkDuplicates("title");
    checkDuplicates("description");
    await checkLinkTargets();
    await checkRedirects();

    console.log(`\nPages audited: ${pages.size}, link/image targets checked: ${linkTargets.size}, redirects checked: ${REDIRECTS.length}`);
    if (warnings.length) console.log(`\nWarnings (${warnings.length}):\n${warnings.join("\n")}`);
    if (errors.length) {
        console.log(`\nErrors (${errors.length}):\n${errors.join("\n")}`);
        process.exit(1);
    }
    console.log("\n✓ No errors.");
}

main().catch((e) => {
    console.error(e);
    process.exit(2);
});
