'use client'

import {FaCopyright} from "react-icons/fa";
import {useLocaleNavigation} from "@/app/components/navigation/useLocaleNavigation";
import {FlagLink} from "@/app/components/navigation/FlagAvatar";
import {BRANDS} from "@/app/lib/i18n";

const COPYRIGHT_SUFFIX = {
    hu: 'Minden jog fenntartva.',
    de: 'Alle Rechte vorbehalten.',
    en: 'All rights reserved.',
};

function getBrand(brand, locale) {
    if (locale === 'hu') return 'Magnólia Tiffanystudió';
    return brand === BRANDS.GLASSARTISTA ? 'GlassArtista' : 'Magnolia Tiffany Studio';
}

export default function Footer() {
    const {locale, site, pagePath, localeHref, switchLocale} = useLocaleNavigation();

    // On the GlassArtista landing page the flags are also shown on mobile.
    const isGlassArtistaLanding = site.brand === BRANDS.GLASSARTISTA && pagePath === '/';

    return (
        <footer className="fixed bottom-0 lg:pr-2 z-53 w-screen lg:w-2/5 h-min mt-10 justify-self-end animate__animated animate__fadeInUp ">
            <div
                className="flex flex-col gap-1 lg:flex-row lg:gap-4 w-full my-2 items-center justify-center lg:justify-end text-gray-300 text-xs">
                <nav aria-label="Language" className={`${isGlassArtistaLanding ? 'flex' : 'hidden lg:flex'} flex-row gap-3 items-center`}>
                    {site.flagLocales.map((flagLocale) => (
                        <FlagLink key={flagLocale} locale={flagLocale} href={localeHref(flagLocale)}
                                  isActive={locale === flagLocale} sizeClass="!w-5.5 !h-5.5"
                                  onSelect={() => switchLocale(flagLocale)}/>
                    ))}
                </nav>
                <div className="flex flex-row gap-2 lg:justify-end ">
                    <FaCopyright className="mb-[1px]" size={14}/>
                    <p className="leading-4">
                        {`2022-2025 ${getBrand(site.brand, locale)} | ${COPYRIGHT_SUFFIX[locale]}`}
                    </p>
                </div>
            </div>
        </footer>
    );
}
