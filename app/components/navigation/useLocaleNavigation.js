'use client'

import {usePathname, useRouter} from "next/navigation";
import {useSite} from "@/app/lib/SiteContext";
import {brandHref, localizePath, stripLocaleFromPath} from "@/app/lib/i18n";

/**
 * Public page path ("/", "/gallery", "/tiffanylamps", ...) without locale prefix. Accepts both the public
 * URL (browser) and the internal route path (/{site}/{locale}/tiffanystudio/...) seen while prerendering,
 * so server and client render identical markup.
 */
export function toPagePath(pathname, siteKey) {
    let path = pathname || '/';
    if (path === `/${siteKey}` || path.startsWith(`/${siteKey}/`)) path = path.slice(siteKey.length + 1) || '/';
    path = stripLocaleFromPath(path);
    if (path === '/tiffanystudio' || path.startsWith('/tiffanystudio/')) path = path.slice('/tiffanystudio'.length) || '/';
    return path.replace(/\/+$/, '') || '/';
}

/** Locale-aware navigation helpers shared by the navbars and the footer. */
export function useLocaleNavigation() {
    const {host, locale, site} = useSite();
    const pagePath = toPagePath(usePathname(), host);
    const router = useRouter();

    /** `path` (e.g. "/gallery#dome") on this site in the current locale. */
    const localized = (path) => localizePath(host, path, locale);

    /** Crawlable link to the current page in `targetLocale` (may point to the other studio domain). */
    const localeHref = (targetLocale) => brandHref(host, pagePath, targetLocale);

    /** Navigates to the current page in `targetLocale`, keeping query and hash. Event handlers only. */
    const switchLocale = (targetLocale) => {
        router.push(`${localeHref(targetLocale)}${window.location.search}${window.location.hash}`);
    };

    return {host, locale, site, pagePath, router, localized, localeHref, switchLocale};
}
