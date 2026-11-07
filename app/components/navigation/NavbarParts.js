'use client'

import Link from "next/link";
import {Button, Dropdown, DropdownTrigger, NavbarItem, Tooltip} from "@heroui/react";
import {FaChevronDown, FaFacebookSquare, FaPhoneAlt} from "react-icons/fa";
import {AiFillInstagram} from "react-icons/ai";
import {RiMailFill} from "react-icons/ri";

const NAV_BUTTON_CLASS = "px-3 bg-transparent data-[hover=true]:bg-transparent text-xl uppercase antonio-navbar";
const SOCIAL_LINK_CLASS = "text-xl font-light antonio-navbar text-white";

function NavLabel({isActive, children}) {
    return <span className={isActive ? 'underline' : 'hover:underline hover:decoration-dashed'}>{children}</span>;
}

/** Desktop navbar entry that navigates on press. */
export function NavTextButton({isActive, onPress, children}) {
    return (
        <Button className={NAV_BUTTON_CLASS} radius="full" onPress={onPress}>
            <NavLabel isActive={isActive}>{children}</NavLabel>
        </Button>
    );
}

/** Rotating chevron shown next to dropdown triggers. */
export function DropdownChevron({isOpen}) {
    return <FaChevronDown size={15} className={`mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}/>;
}

/**
 * Desktop navbar dropdown that opens on hover. `children` must be the `DropdownMenu`.
 */
export function HoverDropdown({isOpen, setIsOpen, label, isActive, variant, children}) {
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return (
        <Dropdown isOpen={isOpen} onMouseEnter={open} onMouseLeave={close}>
            <NavbarItem onMouseEnter={open} onMouseLeave={close} className="py-2 cursor-pointer">
                <DropdownTrigger>
                    <Button
                        className={`${NAV_BUTTON_CLASS} cursor-default`}
                        radius="full"
                        disableRipple={true}
                        variant={variant}
                        endContent={<DropdownChevron isOpen={isOpen}/>}>
                        <NavLabel isActive={isActive}>{label}</NavLabel>
                    </Button>
                </DropdownTrigger>
            </NavbarItem>
            {children}
        </Dropdown>
    );
}

/** Mail / Instagram / Facebook icons in the mobile navbar. */
export function MobileSocialLinks({links}) {
    return (
        <div className="flex flex-row gap-1 md:gap-3 pt-1">
            <a href={`mailto:${links.email}`} className={SOCIAL_LINK_CLASS}>
                <RiMailFill size="25px"/>
            </a>
            <Link href={links.instagram} target="_blank" className={SOCIAL_LINK_CLASS}>
                <AiFillInstagram size="26px"/>
            </Link>
            <Link href={links.facebook} target="_blank" className={SOCIAL_LINK_CLASS}>
                <FaFacebookSquare size="23px"/>
            </Link>
        </div>
    );
}

function IconTooltip({content, children}) {
    return (
        <Tooltip content={content} placement="bottom" showArrow={true} radius="full" color="foreground">
            {children}
        </Tooltip>
    );
}

/** Phone number and Mail / Instagram / Facebook icons with tooltips in the desktop navbar. */
export function DesktopContactLinks({links, phone, t}) {
    return (
        <div className="flex flex-row gap-3 pt-1">
            <div className="flex flex-row gap-1 items-center justify-center pb-1">
                <IconTooltip content={t.callTooltip}>
                    <Link href={phone.href} target="_blank" className={SOCIAL_LINK_CLASS}>
                        <FaPhoneAlt size="16px"/>
                    </Link>
                </IconTooltip>
                <span className="select-all">{phone.display}</span>
            </div>
            <IconTooltip content={t.emailTooltip}>
                <Link href={`mailto:${links.email}`} target="_blank" className={SOCIAL_LINK_CLASS}>
                    <RiMailFill size="25px"/>
                </Link>
            </IconTooltip>
            <IconTooltip content={t.instagramTooltip}>
                <Link href={links.instagram} target="_blank" className={SOCIAL_LINK_CLASS}>
                    <AiFillInstagram size="26px"/>
                </Link>
            </IconTooltip>
            <IconTooltip content={t.facebookTooltip}>
                <Link href={links.facebook} target="_blank" className={SOCIAL_LINK_CLASS}>
                    <FaFacebookSquare size="23px"/>
                </Link>
            </IconTooltip>
        </div>
    );
}
