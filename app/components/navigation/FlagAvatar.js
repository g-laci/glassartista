'use client'

import {Avatar} from "@heroui/react";

const FLAG_SRC = {
    hu: '/design/flag-hu.svg',
    de: '/design/de-at.svg',
    en: '/design/flag-gb.svg',
};

export const LOCALE_LABELS = {hu: 'Magyar', de: 'Deutsch', en: 'English'};

const ACTIVE_STYLE = {outline: '2px solid #d1d5dc', outlineOffset: '2px'};

/** Language flag used by the locale switchers. `sizeClass` sets the avatar size. */
export function FlagAvatar({locale, isActive, sizeClass, onClick}) {
    return (
        <Avatar
            alt={LOCALE_LABELS[locale]}
            className={`${sizeClass} min-w-[20px] cursor-pointer`}
            draggable={false}
            onClick={onClick}
            style={isActive ? ACTIVE_STYLE : undefined}
            src={FLAG_SRC[locale]}
        />
    );
}

/**
 * Flag as a crawlable language link: a real <a href hreflang> to the equivalent page, while a click
 * navigates through `onSelect` (which keeps the current query and section hash).
 */
export function FlagLink({locale, href, isActive, sizeClass, onSelect}) {
    const handleClick = (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
        event.preventDefault();
        onSelect();
    };
    return (
        <a href={href} hrefLang={locale} lang={locale} className="flex" aria-label={LOCALE_LABELS[locale]}
           aria-current={isActive ? 'true' : undefined} onClick={handleClick}>
            <FlagAvatar locale={locale} isActive={isActive} sizeClass={sizeClass}/>
        </a>
    );
}
