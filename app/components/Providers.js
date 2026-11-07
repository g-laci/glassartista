'use client'

import {useRouter} from "next/navigation";
import {HeroUIProvider} from "@heroui/react";
import {SiteProvider} from "@/app/lib/SiteContext";

export function Providers({host, locale, children}) {
    const router = useRouter();
    return (
        // `navigate` makes HeroUI items with an `href` (rendered as real <a> links) use client-side routing.
        <HeroUIProvider navigate={router.push}>
            <SiteProvider host={host} locale={locale}>
                {children}
            </SiteProvider>
        </HeroUIProvider>
    );
}
