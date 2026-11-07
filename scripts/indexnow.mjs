#!/usr/bin/env node
// Notifies IndexNow (Bing, Copilot, Yandex, Seznam, Naver, …) about new, changed and removed pages.
// Run after a production deployment:
//
//   npm run indexnow               # submit only URLs whose sitemap <lastmod> changed, new or removed URLs
//   npm run indexnow -- --dry-run  # show what would be submitted
//   npm run indexnow -- --all      # submit every sitemap URL (first run / after a domain change)
//
// Needs INDEXNOW_KEY (32 hex chars) in the environment or .env. The same key must be configured on
// Vercel, where /<key>.txt on every domain answers with it (see app/api/indexnow-key). The last
// submitted state is kept in .indexnow-state.json (git-ignored) so URLs are not submitted repeatedly.

import {existsSync, readFileSync, writeFileSync} from "node:fs";

const ORIGINS = ["https://www.glassartista.com", "https://www.tiffanystudio.at", "https://www.tiffanystudio.hu"];
const ENDPOINT = "https://api.indexnow.org/indexnow";
const STATE_FILE = ".indexnow-state.json";

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const ALL = args.has("--all");

if (existsSync(".env") && !process.env.INDEXNOW_KEY) process.loadEnvFile(".env");
const KEY = process.env.INDEXNOW_KEY;
if (!/^[a-f0-9]{32}$/.test(KEY || "")) {
    console.error("INDEXNOW_KEY is missing or not 32 lowercase hex characters.");
    process.exit(1);
}

async function text(url) {
    const res = await fetch(url, {redirect: "manual"});
    return {status: res.status, body: res.status === 200 ? await res.text() : ""};
}

async function readSitemap(origin) {
    const {status, body} = await text(`${origin}/sitemap.xml`);
    if (status !== 200) throw new Error(`${origin}/sitemap.xml answered ${status}`);
    return Object.fromEntries([...body.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)]
        .map((m) => [m[1].replace(/&amp;/g, "&"), m[2] || ""]));
}

const state = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, "utf8")) : {urls: {}};
const nextState = {urls: {...state.urls}, submittedAt: new Date().toISOString()};
let failed = false;

for (const origin of ORIGINS) {
    const host = new URL(origin).host;
    const keyFile = await text(`${origin}/${KEY}.txt`);
    if (keyFile.status !== 200 || keyFile.body.trim() !== KEY) {
        console.error(`${origin}/${KEY}.txt does not serve the key (status ${keyFile.status}); set INDEXNOW_KEY on Vercel and redeploy.`);
        failed = true;
        continue;
    }

    const current = await readSitemap(origin);
    const previous = Object.fromEntries(Object.entries(state.urls).filter(([url]) => url === origin || url.startsWith(`${origin}/`)));
    const changed = Object.keys(current).filter((url) => ALL || previous[url] !== current[url]);
    const removed = Object.keys(previous).filter((url) => !(url in current));
    const urlList = [...changed, ...removed];

    if (!urlList.length) {
        console.log(`${host}: nothing changed`);
        continue;
    }
    console.log(`${host}: ${changed.length} new/changed, ${removed.length} removed`);
    urlList.forEach((url) => console.log(`  ${url}`));
    if (DRY_RUN) continue;

    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {"Content-Type": "application/json; charset=utf-8"},
        body: JSON.stringify({host, key: KEY, keyLocation: `${origin}/${KEY}.txt`, urlList}),
    });
    if (res.status === 200 || res.status === 202) {
        console.log(`  → accepted (${res.status})`);
        for (const url of removed) delete nextState.urls[url];
        Object.assign(nextState.urls, current);
    } else {
        console.error(`  → rejected: ${res.status} ${await res.text()}`);
        failed = true;
    }
}

if (!DRY_RUN) writeFileSync(STATE_FILE, `${JSON.stringify(nextState, null, 2)}\n`);
process.exit(failed ? 1 : 0);
