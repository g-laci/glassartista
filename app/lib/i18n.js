// Locale and host configuration shared by the middleware (edge runtime), server components
// and client components. Keep this module free of React and Node-only APIs.

export const LOCALES = ['hu', 'de', 'en'];

/** Locale used when neither the URL nor the host determines one. */
export const FALLBACK_LOCALE = 'en';

/**
 * Per-domain behaviour.
 * - defaultLocale: locale served when the URL has no locale prefix
 * - hideDefault:   the default locale is served without a URL prefix (rewrite instead of redirect)
 * - isStudio:      the domain serves the Tiffany Studio subtree at its root
 */
export const HOST_CONFIG = {
    'tiffanystudio.at': {defaultLocale: 'de', hideDefault: true, isStudio: true},
    'tiffanystudio.hu': {defaultLocale: 'hu', hideDefault: true, isStudio: true},
    'glassartista.com': {defaultLocale: 'de', hideDefault: true, isStudio: false},
    'localhost': {defaultLocale: 'de', hideDefault: true, isStudio: false}, // behaves like glassartista.com
};

const UNKNOWN_HOST_CONFIG = {defaultLocale: FALLBACK_LOCALE, hideDefault: false, isStudio: false};

/** "www.Example.com:3000" -> "example.com" */
export function normalizeHost(rawHost) {
    return (rawHost || '').split(':')[0].toLowerCase().replace(/^www\./, '');
}

export function getHostConfig(hostname) {
    return HOST_CONFIG[hostname] || UNKNOWN_HOST_CONFIG;
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
