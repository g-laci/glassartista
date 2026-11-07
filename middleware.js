import {NextResponse} from 'next/server';
import {
    BRANDS,
    getBrandSiteKey,
    getLocaleFromPath,
    getSite,
    getSiteKey,
    isProductionHost,
    localizePath,
    normalizeHost,
    stripLocaleFromPath,
} from '@/app/lib/i18n';

// Every page is served from an internal, host-keyed route: /{siteKey}/{locale}/... This keeps the
// pages statically renderable per domain. The public URL never shows the internal path.
//
// Canonical URLs (see SEO_IMPLEMENTATION.md):
//   glassartista.com    /, /hu/..., /en/...       GlassArtista pages (+ the brand-choice landing page)
//   tiffanystudio.at    /, /en/...                 Tiffany Studio in German and English
//   tiffanystudio.hu    /                          Tiffany Studio in Hungarian
// Any other URL that used to render one of these pages is permanently redirected to it.

/** Public studio paths and the internal route that serves them. */
const STUDIO_PATHS = {
    '/': '/tiffanystudio',
    '/contact': '/tiffanystudio/contact',
    '/tiffanylamps': '/tiffanystudio/tiffanylamps',
    '/tiffanylampsavailable': '/tiffanystudio/tiffanylampsavailable',
};

/** GlassArtista-only pages (their presence on a studio domain is a legacy duplicate). */
const GLASSARTISTA_ONLY_PATHS = ['/home', '/gallery', '/details'];

/** IndexNow key file: /<32 hex chars>.txt, answered by /api/indexnow-key (which checks the key). */
const INDEXNOW_KEY_FILE = /^\/([a-f0-9]{32})\.txt$/;

/** Host-specific metadata files, served from the site's internal route. */
const SITE_FILES = ['/robots.txt', '/sitemap.xml'];

const PERMANENT = 301;

function withSearch(url, request) {
    return `${url}${request.nextUrl.search}`;
}

/** Permanent redirect to `path` on `targetSiteKey`: relative on the same site, absolute otherwise. */
function redirectToSite(request, siteKey, targetSiteKey, path) {
    if (targetSiteKey === siteKey) {
        const url = request.nextUrl.clone();
        url.pathname = path;
        return NextResponse.redirect(url, PERMANENT);
    }
    const origin = getSite(targetSiteKey).origin;
    return NextResponse.redirect(withSearch(`${origin}${path === '/' ? '/' : path}`, request), PERMANENT);
}

/** Permanent redirect to the canonical URL of a brand page. */
function redirectToBrandPage(request, siteKey, brand, path, locale) {
    const targetSiteKey = getBrandSiteKey(brand, locale);
    return redirectToSite(request, siteKey, targetSiteKey, localizePath(targetSiteKey, path, locale));
}

function rewriteTo(request, pathname) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.rewrite(url);
}

function routeGlassArtista(request, siteKey, pathLocale, path) {
    const site = getSite(siteKey);
    const locale = pathLocale || site.defaultLocale;

    // Legacy: the studio used to be reachable under /tiffanystudio on this domain.
    if (path === '/tiffanystudio' || path.startsWith('/tiffanystudio/')) {
        const studioPath = path.slice('/tiffanystudio'.length) || '/';
        return redirectToBrandPage(request, siteKey, BRANDS.TIFFANY, studioPath, locale);
    }
    // The default locale has no prefix: /de/gallery -> /gallery
    if (pathLocale === site.defaultLocale) {
        return redirectToSite(request, siteKey, siteKey, path);
    }
    return rewriteTo(request, `/${siteKey}/${locale}${path === '/' ? '' : path}`);
}

function routeTiffanyStudio(request, siteKey, pathLocale, path) {
    const site = getSite(siteKey);
    const locale = pathLocale || site.defaultLocale;

    // Legacy: /tiffanystudio/... on the studio domains.
    if (path === '/tiffanystudio' || path.startsWith('/tiffanystudio/')) {
        const studioPath = path.slice('/tiffanystudio'.length) || '/';
        return redirectToBrandPage(request, siteKey, BRANDS.TIFFANY, studioPath, locale);
    }
    // Legacy: GlassArtista pages rendered on a studio domain.
    if (GLASSARTISTA_ONLY_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
        return redirectToBrandPage(request, siteKey, BRANDS.GLASSARTISTA, path, locale);
    }
    // Locales whose canonical page lives on the other studio domain, and the unprefixed default.
    if (pathLocale && (!site.locales.includes(pathLocale) || pathLocale === site.defaultLocale)) {
        return redirectToBrandPage(request, siteKey, BRANDS.TIFFANY, path, pathLocale);
    }

    const internal = STUDIO_PATHS[path];
    // Unknown paths fall through to the localized catch-all 404.
    return rewriteTo(request, `/${siteKey}/${locale}${internal ?? path}`);
}

function route(request, hostname) {
    const {pathname} = request.nextUrl;
    const siteKey = getSiteKey(hostname);

    if (SITE_FILES.includes(pathname)) {
        return rewriteTo(request, `/${siteKey}${pathname}`);
    }
    const keyFile = pathname.match(INDEXNOW_KEY_FILE);
    if (keyFile) {
        const url = request.nextUrl.clone();
        url.pathname = '/api/indexnow-key';
        url.search = `?key=${keyFile[1]}`;
        return NextResponse.rewrite(url);
    }
    // Static assets in /public
    if (pathname.includes('.')) {
        return NextResponse.next();
    }

    const pathLocale = getLocaleFromPath(pathname);
    const path = pathLocale ? stripLocaleFromPath(pathname) : pathname;
    return getSite(siteKey).brand === BRANDS.TIFFANY
        ? routeTiffanyStudio(request, siteKey, pathLocale, path)
        : routeGlassArtista(request, siteKey, pathLocale, path);
}

export function middleware(request) {
    const hostname = normalizeHost(request.headers.get('host'));
    const response = route(request, hostname);
    // Preview / development hosts must never be indexed (they duplicate the production domains).
    if (!isProductionHost(hostname)) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }
    return response;
}

export const config = {
    matcher: ['/((?!_next/|api/).*)'],
};
