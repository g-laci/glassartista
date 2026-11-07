'use client'

import {Avatar} from "@heroui/react";

const FLAG_SRC = {
    hu: 'https://flagcdn.com/hu.svg',
    de: '/design/de-at.svg',
    en: 'https://flagcdn.com/gb.svg',
};

const ACTIVE_STYLE = {outline: '2px solid #d1d5dc', outlineOffset: '2px'};

/** Language flag used by the locale switchers. `sizeClass` sets the avatar size. */
export function FlagAvatar({locale, isActive, sizeClass, onClick}) {
    return (
        <Avatar
            alt="flag"
            className={`${sizeClass} min-w-[20px] cursor-pointer`}
            draggable={false}
            onClick={onClick}
            style={isActive ? ACTIVE_STYLE : undefined}
            src={FLAG_SRC[locale]}
        />
    );
}
