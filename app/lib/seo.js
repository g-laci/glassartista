// Page metadata (title, description, canonical, hreflang, Open Graph, Twitter) and Schema.org JSON-LD.
// Used by the server components in app/[host]/[lang]; see SEO_IMPLEMENTATION.md for the strategy.

import {BRANDS, brandUrl, getBrandSiteKey, getSite, LOCALES} from "@/app/lib/i18n";
import {BRAND_NAMES, PAGES, SEO_TEXT} from "@/app/content/seo";
import {GLASSARTISTA_NAV_TEXT, TIFFANY_NAV_TEXT} from "@/app/content/navigation";
import {getLocationKey, GLASSARTISTA_LINKS, LOCATIONS, OWNER, TIFFANY_LINKS} from "@/app/content/site";
import {GLASSARTISTA_EMAILS} from "@/app/content/contact";

/** Open Graph locales. German content is written for Austria (and also serves Germany). */
const OG_LOCALES = {hu: "hu_HU", de: "de_AT", en: "en_GB"};

/** Version shown to searchers whose language matches none of the alternates. */
const X_DEFAULT_LOCALE = "en";

const OG_IMAGE_SIZE = {width: 1200, height: 630};

const OWNER_ID = "https://www.glassartista.com/#owner";

const COUNTRY_NAMES = {HU: "Hungary", AT: "Austria", DE: "Germany"};

/** Navigation label used as the page name in breadcrumbs. */
const BREADCRUMB_LABELS = {
    [BRANDS.GLASSARTISTA]: {home: "main", gallery: "gallery", details: "details", contact: "contact"},
    [BRANDS.TIFFANY]: {tiffanylamps: "tiffanyLamps", available: "availableLamps", contact: "contact"},
};

const NAV_TEXT = {[BRANDS.GLASSARTISTA]: GLASSARTISTA_NAV_TEXT, [BRANDS.TIFFANY]: TIFFANY_NAV_TEXT};

/** Root page of each brand (the breadcrumb root). */
const ROOT_PAGE = {[BRANDS.GLASSARTISTA]: "landing", [BRANDS.TIFFANY]: "home"};

/** Absolute canonical URL of a page in `locale`. */
export function pageUrl(brand, pageKey, locale) {
    return brandUrl(brand, PAGES[brand][pageKey].path, locale);
}

/** hreflang map: every locale version of the page plus x-default. */
export function pageLanguages(brand, pageKey) {
    const languages = Object.fromEntries(LOCALES.map((locale) => [locale, pageUrl(brand, pageKey, locale)]));
    languages["x-default"] = pageUrl(brand, pageKey, X_DEFAULT_LOCALE);
    return languages;
}

function originFor(brand, locale) {
    return getSite(getBrandSiteKey(brand, locale)).origin;
}

function ogImageUrl(brand, pageKey, locale) {
    return `${originFor(brand, locale)}${PAGES[brand][pageKey].ogImage}`;
}

/** Next.js Metadata for one page in one locale. */
export function buildPageMetadata(brand, pageKey, locale) {
    const {title, description} = SEO_TEXT[brand][pageKey][locale];
    const url = pageUrl(brand, pageKey, locale);
    const image = {url: ogImageUrl(brand, pageKey, locale), ...OG_IMAGE_SIZE, alt: title, type: "image/jpeg"};

    return {
        title: {absolute: title},
        description,
        alternates: {canonical: url, languages: pageLanguages(brand, pageKey)},
        openGraph: {
            type: "website",
            url,
            siteName: BRAND_NAMES[brand][locale],
            title,
            description,
            locale: OG_LOCALES[locale],
            alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
            images: [image],
        },
        twitter: {card: "summary_large_image", title, description, images: [image]},
    };
}

// ---------------------------------------------------------------------------------------------
// JSON-LD

function businessId(brand, locale) {
    return `${originFor(brand, locale)}/#business-${getLocationKey(locale)}`;
}

function websiteId(brand, locale) {
    return `${originFor(brand, locale)}/#website`;
}

function brandContact(brand, locale) {
    if (brand === BRANDS.TIFFANY) {
        return {emails: [TIFFANY_LINKS.email], sameAs: [TIFFANY_LINKS.instagram, TIFFANY_LINKS.facebook.replace(/#$/, "")]};
    }
    return {
        emails: GLASSARTISTA_EMAILS[locale],
        sameAs: [GLASSARTISTA_LINKS.instagram, GLASSARTISTA_LINKS.facebook, GLASSARTISTA_LINKS.youtube],
    };
}

function businessNode(brand, locale) {
    const location = LOCATIONS[getLocationKey(locale)];
    const {emails, sameAs} = brandContact(brand, locale);
    const origin = originFor(brand, locale);
    const names = BRAND_NAMES[brand];
    const alternateNames = [...new Set(Object.values(names))].filter((name) => name !== names[locale]);
    const rootPage = ROOT_PAGE[brand];
    const logo = brand === BRANDS.TIFFANY ? "/design/tiffanystudiologo.png" : "/design/glassartista_logo_text.png";

    return {
        "@type": "LocalBusiness",
        "@id": businessId(brand, locale),
        name: names[locale],
        ...(alternateNames.length ? {alternateName: alternateNames} : {}),
        description: SEO_TEXT[brand][rootPage][locale].description,
        url: pageUrl(brand, rootPage, locale),
        logo: {"@type": "ImageObject", url: `${origin}${logo}`},
        image: ogImageUrl(brand, rootPage, locale),
        email: emails[0],
        telephone: location.phones[0],
        address: {"@type": "PostalAddress", ...location.address},
        areaServed: location.areaServed.map((code) => ({"@type": "Country", name: COUNTRY_NAMES[code]})),
        contactPoint: location.phones.map((telephone) => ({
            "@type": "ContactPoint",
            telephone,
            contactType: "customer service",
            availableLanguage: ["hu", "de", "en"],
        })),
        founder: {"@id": OWNER_ID},
        sameAs,
    };
}

function ownerNode() {
    return {
        "@type": "Person",
        "@id": OWNER_ID,
        name: `${OWNER.givenName} ${OWNER.familyName}`,
        alternateName: `${OWNER.familyName} ${OWNER.givenName}`,
        givenName: OWNER.givenName,
        familyName: OWNER.familyName,
    };
}

function websiteNode(brand, locale) {
    const siteKey = getBrandSiteKey(brand, locale);
    const site = getSite(siteKey);
    return {
        "@type": "WebSite",
        "@id": websiteId(brand, locale),
        url: site.origin,
        name: BRAND_NAMES[brand][locale],
        inLanguage: site.locales,
        publisher: {"@id": businessId(brand, locale)},
    };
}

const PAGE_TYPES = {gallery: "CollectionPage", tiffanylamps: "CollectionPage", available: "CollectionPage", contact: "ContactPage"};

function breadcrumbNode(brand, pageKey, locale, url) {
    const rootPage = ROOT_PAGE[brand];
    const label = NAV_TEXT[brand][locale][BREADCRUMB_LABELS[brand][pageKey]];
    return {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
            {"@type": "ListItem", position: 1, name: BRAND_NAMES[brand][locale], item: pageUrl(brand, rootPage, locale)},
            {"@type": "ListItem", position: 2, name: label, item: url},
        ],
    };
}

/**
 * The page's JSON-LD graph: business (LocalBusiness of the location shown in this locale), owner,
 * website, web page and breadcrumb. `items` (optional) adds an ItemList of works shown on the page:
 * [{name, image, anchor}] with site-relative image paths.
 */
export function buildPageJsonLd(brand, pageKey, locale, items) {
    const url = pageUrl(brand, pageKey, locale);
    const origin = originFor(brand, locale);
    const {title, description} = SEO_TEXT[brand][pageKey][locale];
    const isRoot = pageKey === ROOT_PAGE[brand];

    const page = {
        "@type": PAGE_TYPES[pageKey] || "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: {"@id": websiteId(brand, locale)},
        about: {"@id": businessId(brand, locale)},
        primaryImageOfPage: {"@type": "ImageObject", url: ogImageUrl(brand, pageKey, locale), ...OG_IMAGE_SIZE},
    };
    const graph = [businessNode(brand, locale), ownerNode(), websiteNode(brand, locale), page];

    if (!isRoot) {
        const breadcrumb = breadcrumbNode(brand, pageKey, locale, url);
        page.breadcrumb = {"@id": breadcrumb["@id"]};
        graph.push(breadcrumb);
    }
    if (items?.length) {
        page.mainEntity = {
            "@type": "ItemList",
            numberOfItems: items.length,
            itemListElement: items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "VisualArtwork",
                    name: item.name,
                    ...(item.image ? {image: `${origin}${item.image}`} : {}),
                    ...(item.anchor ? {url: `${url}#${item.anchor}`} : {}),
                    creator: {"@id": OWNER_ID},
                },
            })),
        };
    }
    return {"@context": "https://schema.org", "@graph": graph};
}

/** Section key / first slide title / first image of slide-based pages, as JSON-LD items. */
export function sectionItems(sections) {
    return sections.map(({key, slides}) => ({
        name: slides.find((s) => s.title)?.title || key,
        image: slides.find((s) => s.src && !s.src.endsWith(".mp4"))?.src,
        anchor: key,
    }));
}
