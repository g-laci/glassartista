'use client'

import {createContext, useContext, useMemo} from "react";
import {getSite} from "@/app/lib/i18n";

const SiteContext = createContext(null);

/**
 * Makes the site (resolved by the middleware from the request host) and the active locale available
 * to client components, so they render the same markup on the server and in the browser.
 */
export function SiteProvider({host, locale, children}) {
    const value = useMemo(() => ({host, locale, site: getSite(host)}), [host, locale]);
    return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

/** @returns {{host: string, locale: string, site: {origin: string, brand: string, defaultLocale: string, locales: string[], flagLocales: string[]}}} */
export function useSite() {
    const site = useContext(SiteContext);
    if (!site) throw new Error("useSite must be used within a SiteProvider");
    return site;
}
