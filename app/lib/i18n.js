// Locale, domain and URL configuration shared by the middleware (edge runtime), server components
// and client components. Keep this module free of React and Node-only APIs.

export const LOCALES = ['hu', 'de', 'en'];

/** Locale used when nothing else determines one. */
export const FALLBACK_LOCALE = 'en';

/** The two brands. Each brand's pages exist in every locale, but on different domains. */
export const BRANDS = {GLASSARTISTA: 'glassartista', TIFFANY: 'tiffanystudio'};

/**
 * Production sites, keyed by their bare domain (also used as the internal `[host]` route segment).
 * - origin:        canonical origin (Vercel redirects the apex domain to www)
 * - brand:         which brand the domain presents
 * - defaultLocale: locale served without a URL prefix
 * - locales:       locales whose canonical pages live on this domain
 * - flagLocales:   language buttons shown on this domain. Deliberately independent from `locales`:
 *                  e.g. tiffanystudio.at never shows a Hungarian button, tiffanystudio.hu shows all three.
 */
export const SITES = {
    'glassartista.com': {
        origin: 'https://www.glassartista.com',
        brand: BRANDS.GLASSARTISTA,
        defaultLocale: 'de',
        locales: ['de', 'hu', 'en'],
        flagLocales: ['hu', 'de', 'en'],
    },
    'tiffanystudio.at': {
        origin: 'https://www.tiffanystudio.at',
        brand: BRANDS.TIFFANY,
        defaultLocale: 'de',
        locales: ['de', 'en'],
        flagLocales: ['de', 'en'],
    },
    'tiffanystudio.hu': {
        origin: 'https://www.tiffanystudio.hu',
        brand: BRANDS.TIFFANY,
        defaultLocale: 'hu',
        locales: ['hu'],
        flagLocales: ['hu', 'de', 'en'],
    },
};

export const SITE_KEYS = Object.keys(SITES);

/** Domain that holds the canonical page of `brand` in `locale`. */
const BRAND_LOCALE_SITE = {
    [BRANDS.GLASSARTISTA]: {hu: 'glassartista.com', de: 'glassartista.com', en: 'glassartista.com'},
    [BRANDS.TIFFANY]: {hu: 'tiffanystudio.hu', de: 'tiffanystudio.at', en: 'tiffanystudio.at'},
};

/** Development host names mapped to the site they emulate (`*.localhost` resolves to 127.0.0.1). */
const DEV_HOSTS = {
    'localhost': 'glassartista.com',
    'glassartista.localhost': 'glassartista.com',
    'at.localhost': 'tiffanystudio.at',
    'hu.localhost': 'tiffanystudio.hu',
};

/** "www.Example.com:3000" -> "example.com" */
export function normalizeHost(rawHost) {
    return (rawHost || '').split(':')[0].toLowerCase().replace(/^www\./, '');
}

/** True for the three production domains (any other host must not be indexed). */
export function isProductionHost(hostname) {
    return Object.hasOwn(SITES, hostname);
}

/** Site key for a normalized request host. Unknown hosts (previews, *.vercel.app) act as glassartista.com. */
export function getSiteKey(hostname) {
    if (isProductionHost(hostname)) return hostname;
    return DEV_HOSTS[hostname] || 'glassartista.com';
}

export function getSite(siteKey) {
    return SITES[siteKey] || SITES['glassartista.com'];
}

export function isSiteKey(value) {
    return Object.hasOwn(SITES, value);
}

export function isLocale(value) {
    return LOCALES.includes(value);
}

/** Returns `value` if it is a supported locale, otherwise `fallback`. */
export function resolveLocale(value, fallback = FALLBACK_LOCALE) {
    return isLocale(value) ? value : fallback;
}

/** "/en/gallery" -> "en"; "/gallery" -> null */
export function getLocaleFromPath(pathname) {
    const segment = (pathname || '/').split('/')[1];
    return isLocale(segment) ? segment : null;
}

/** "/en/gallery" -> "/gallery"; "/en" -> "/"; paths without a locale are returned unchanged. */
export function stripLocaleFromPath(pathname) {
    const path = pathname || '/';
    const parts = path.split('/');
    if (!isLocale(parts[1])) return path;
    parts.splice(1, 1);
    const joined = parts.join('/');
    return joined === '' ? '/' : joined;
}

/** First supported locale found in an Accept-Language header, or null. */
export function parseAcceptLanguage(header) {
    if (!header) return null;
    for (const entry of header.split(',')) {
        const lang = entry.trim().toLowerCase();
        const match = LOCALES.find((locale) => lang.startsWith(locale));
        if (match) return match;
    }
    return null;
}

/** Site key holding the canonical page of `brand` in `locale`. */
export function getBrandSiteKey(brand, locale) {
    return BRAND_LOCALE_SITE[brand][locale];
}

/** Public path of `path` (e.g. "/gallery", "/") in `locale` on `siteKey`: no prefix for the default locale. */
export function localizePath(siteKey, path, locale) {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (locale === getSite(siteKey).defaultLocale) return normalized;
    return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

/**
 * Absolute canonical URL of a brand page path in `locale` (on whichever domain owns that locale).
 * A domain root is written without the trailing slash ("https://www.tiffanystudio.at"), exactly as
 * Next.js renders it in canonical / hreflang tags, so sitemap, JSON-LD and <head> always match.
 */
export function brandUrl(brand, path, locale) {
    const siteKey = getBrandSiteKey(brand, locale);
    const publicPath = localizePath(siteKey, path, locale);
    const origin = getSite(siteKey).origin;
    return publicPath === '/' ? origin : `${origin}${publicPath}`;
}

/**
 * Link target for `path` in `locale`, as seen from `fromSiteKey`: a relative path when the page lives
 * on the same domain, otherwise the absolute canonical URL.
 */
export function brandHref(fromSiteKey, path, locale) {
    const brand = getSite(fromSiteKey).brand;
    const siteKey = getBrandSiteKey(brand, locale);
    if (siteKey === fromSiteKey) return localizePath(siteKey, path, locale);
    return brandUrl(brand, path, locale);
}
