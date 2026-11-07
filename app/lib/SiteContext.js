'use client'

import {createContext, useContext, useMemo} from "react";
import {getHostConfig} from "@/app/lib/i18n";

const SiteContext = createContext(null);

/**
 * Makes the request host (resolved on the server) and the active locale available to client
 * components, so they render the same markup on the server and in the browser.
 */
export function SiteProvider({host, locale, children}) {
    const value = useMemo(() => ({host, locale, hostConfig: getHostConfig(host)}), [host, locale]);
    return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

/** @returns {{host: string, locale: string, hostConfig: {defaultLocale: string, hideDefault: boolean, isStudio: boolean}}} */
export function useSite() {
    const site = useContext(SiteContext);
    if (!site) throw new Error("useSite must be used within a SiteProvider");
    return site;
}
