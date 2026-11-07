'use client'

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useSite} from "@/app/lib/SiteContext";
import {stripLocaleFromPath} from "@/app/lib/i18n";

/** Locale-aware navigation helpers shared by the navbars and the footer. */
export function useLocaleNavigation() {
    const {host, locale, hostConfig} = useSite();
    const pathname = usePathname() || '/';
    const searchParams = useSearchParams();
    const router = useRouter();

    const isHiddenDefault = (targetLocale) => hostConfig.hideDefault && targetLocale === hostConfig.defaultLocale;

    /** `path` in the current locale; unprefixed when the locale is the host's hidden default. */
    const localized = (path) => {
        const normalized = path.startsWith('/') ? path : `/${path}`;
        return isHiddenDefault(locale) ? normalized : `/${locale}${normalized}`;
    };

    /** The current page (path without locale, query and hash). Call from event handlers only. */
    const currentPage = () => {
        const search = searchParams ? `?${searchParams.toString()}` : '';
        return `${stripLocaleFromPath(pathname)}${search}${window.location.hash}`;
    };

    /** The current page in `targetLocale`. Call from event handlers only. */
    const currentPageIn = (targetLocale) =>
        isHiddenDefault(targetLocale) ? currentPage() : `/${targetLocale}${currentPage()}`;

    return {host, locale, hostConfig, pathname, router, localized, currentPage, currentPageIn};
}
