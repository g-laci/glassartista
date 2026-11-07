'use client'

import {HeroUIProvider} from "@heroui/react";
import {SiteProvider} from "@/app/lib/SiteContext";

export function Providers({host, locale, children}) {
    return (
        <HeroUIProvider>
            <SiteProvider host={host} locale={locale}>
                {children}
            </SiteProvider>
        </HeroUIProvider>
    );
}
