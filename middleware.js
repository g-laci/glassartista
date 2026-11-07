import {NextResponse} from 'next/server';
import {getHostConfig, getLocaleFromPath, isLocale, normalizeHost, parseAcceptLanguage} from '@/app/lib/i18n';

// Public top-level paths on the studio domains and the internal route that serves them.
const STUDIO_PATHS = {
    '/contact': '/tiffanystudio/contact',
    '/lampbases': '/tiffanystudio/lampbases',
    '/tiffanylamps': '/tiffanystudio/tiffanylamps',
    '/tiffanylampsavailable': '/tiffanystudio/tiffanylampsavailable',
};

function matchesPrefix(path, prefix) {
    return path === prefix || path.startsWith(`${prefix}/`);
}

/** Finds the studio route for a public path, keeping any sub-path (e.g. a trailing slash). */
function findStudioPath(path) {
    for (const [publicPath, internalPath] of Object.entries(STUDIO_PATHS)) {
        if (matchesPrefix(path, publicPath)) {
            return internalPath + path.slice(publicPath.length);
        }
    }
    return null;
}

/** Locale for a request whose URL has no locale prefix. Cookies are intentionally ignored. */
function detectLocale(request, hostConfig) {
    if (hostConfig.hideDefault) return hostConfig.defaultLocale;
    const fromHeader = parseAcceptLanguage(request.headers.get('accept-language'));
    return isLocale(fromHeader) ? fromHeader : hostConfig.defaultLocale;
}

function rewriteTo(request, pathname) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.rewrite(url);
}

function redirectTo(request, pathname) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url);
}

/**
 * Serves `internalPath` for a locale-less request: a rewrite (URL unchanged) when the locale is
 * the host's hidden default, otherwise a redirect to the visible locale-prefixed `publicPath`.
 */
function serveWithoutPrefix(request, hostConfig, locale, internalPath, publicPath) {
    if (hostConfig.hideDefault && locale === hostConfig.defaultLocale) {
        return rewriteTo(request, internalPath);
    }
    return redirectTo(request, publicPath);
}

export function middleware(request) {
    const {pathname} = request.nextUrl;

    // Skip internals and static assets
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return NextResponse.next();
    }

    const hostConfig = getHostConfig(normalizeHost(request.headers.get('host')));
    const pathLocale = getLocaleFromPath(pathname);

    if (pathLocale) {
        if (hostConfig.isStudio) {
            const afterLocale = pathname.slice(pathLocale.length + 1) || '/';
            const studioPath = findStudioPath(afterLocale);
            if (studioPath) {
                return rewriteTo(request, `/${pathLocale}${studioPath}`);
            }
            if (afterLocale === '/') {
                return rewriteTo(request, `/${pathLocale}/tiffanystudio`);
            }
        }
        return NextResponse.next();
    }

    const locale = detectLocale(request, hostConfig);

    if (hostConfig.isStudio) {
        if (pathname === '/') {
            const internalPath = `/${locale}/tiffanystudio`;
            return serveWithoutPrefix(request, hostConfig, locale, internalPath, internalPath);
        }

        if (pathname.startsWith('/tiffanystudio')) {
            const rest = pathname.slice('/tiffanystudio'.length) || '/';
            return serveWithoutPrefix(request, hostConfig, locale,
                `/${locale}/tiffanystudio${rest}`, `/${locale}${pathname}`);
        }

        const studioPath = findStudioPath(pathname);
        if (studioPath) {
            return serveWithoutPrefix(request, hostConfig, locale,
                `/${locale}${studioPath}`, `/${locale}${pathname}`);
        }
    }

    return serveWithoutPrefix(request, hostConfig, locale,
        `/${locale}${pathname}`.replace('//', '/'), `/${locale}${pathname}`);
}

export const config = {
    matcher: ['/((?!_next|api|favicon.ico).*)'],
};
