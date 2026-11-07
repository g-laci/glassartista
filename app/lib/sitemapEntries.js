// Sitemap entries per site: every canonical page whose locale lives on that domain, with its hreflang
// alternates, the images shown on it and an accurate <lastmod> (from app/content/lastmod.json).

import {BRANDS, getSite} from "@/app/lib/i18n";
import {pageLanguages, pageUrl} from "@/app/lib/seo";
import {PAGES} from "@/app/content/seo";
import {GALLERY_TEXT} from "@/app/content/gallery";
import {DETAILS_TEXT} from "@/app/content/details";
import {STUDIO_TEXT} from "@/app/content/studio";
import {TIFFANY_LAMPS_TEXT} from "@/app/content/tiffanyLamps";
import {GEOMETRIC_META, STANDING_META, TABLE_META} from "@/app/content/availableLamps";
import LASTMOD from "@/app/content/lastmod.json";

const isImage = (src) => src && !/\.(mp4|webm)$/i.test(src);

/** Images of slide-based content ({key: slides[]} or slides[]), deduplicated. */
function slideImages(content) {
    const slides = Array.isArray(content) ? content : Object.values(content).flat();
    return [...new Set(slides.map((slide) => slide.src).filter(isImage))];
}

/** Image paths shown on each page (identical in every locale). */
const PAGE_IMAGES = {
    [BRANDS.GLASSARTISTA]: {
        landing: ["/design/index-tiffany.webp", "/design/index-olomuveg.webp"],
        home: [],
        gallery: slideImages(GALLERY_TEXT.en),
        details: slideImages(DETAILS_TEXT.en),
        contact: [],
    },
    [BRANDS.TIFFANY]: {
        home: slideImages(STUDIO_TEXT.en.slides),
        tiffanylamps: slideImages(TIFFANY_LAMPS_TEXT.en),
        available: [...GEOMETRIC_META, ...TABLE_META, ...STANDING_META].map((lamp) => lamp.src),
        contact: [],
    },
};

/** Latest commit date of the page's content files, or undefined if unknown. */
function lastModified(brand, pageKey) {
    const dates = PAGES[brand][pageKey].contentFiles.map((file) => LASTMOD[file]).filter(Boolean).sort();
    return dates.at(-1);
}

/** [{url, lastmod, alternates: {hreflang: url}, images: [absolute url]}] for `siteKey`. */
export function getSitemapEntries(siteKey) {
    const site = getSite(siteKey);
    return site.locales.flatMap((locale) =>
        Object.keys(PAGES[site.brand]).map((pageKey) => ({
            url: pageUrl(site.brand, pageKey, locale),
            lastmod: lastModified(site.brand, pageKey),
            alternates: pageLanguages(site.brand, pageKey),
            images: PAGE_IMAGES[site.brand][pageKey].map((src) => `${site.origin}${encodeURI(src)}`),
        })),
    );
}

const escapeXml = (value) => value.replace(/[<>&'"]/g, (c) => ({"<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;"}[c]));

export function renderSitemap(entries) {
    const urls = entries.map((entry) => {
        const alternates = Object.entries(entry.alternates)
            .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}"/>`);
        const images = entry.images.map((src) => `    <image:image><image:loc>${escapeXml(src)}</image:loc></image:image>`);
        return [
            "  <url>",
            `    <loc>${escapeXml(entry.url)}</loc>`,
            ...(entry.lastmod ? [`    <lastmod>${entry.lastmod}</lastmod>`] : []),
            ...alternates,
            ...images,
            "  </url>",
        ].join("\n");
    });
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
        ...urls,
        "</urlset>",
        "",
    ].join("\n");
}
