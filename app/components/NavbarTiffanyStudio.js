'use client'

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Tooltip,
} from "@heroui/react";
import {PiAcornFill, PiFlower, PiFlowerFill, PiFlowerTulipFill} from "react-icons/pi";
import {GiChestnutLeaf, GiCurlingVines, GiDragonfly, GiFairyWings, GiLilyPads} from "react-icons/gi";
import {IoRose} from "react-icons/io5";
import {LuLamp, LuLampFloor} from "react-icons/lu";
import {IoIosGrid} from "react-icons/io";
import {MdLocalFlorist} from "react-icons/md";
import {FaArrowAltCircleLeft, FaChevronDown, FaPalette} from "react-icons/fa";
import {useLocaleNavigation} from "@/app/components/navigation/useLocaleNavigation";
import {FlagAvatar, LOCALE_LABELS} from "@/app/components/navigation/FlagAvatar";
import {
    DesktopContactLinks,
    DropdownChevron,
    HoverDropdown,
    MobileSocialLinks,
    NavTextButton,
} from "@/app/components/navigation/NavbarParts";
import {TIFFANY_NAV_TEXT} from "@/app/content/navigation";
import {getTiffanyPhone, TIFFANY_LINKS} from "@/app/content/site";
import {BRANDS, brandUrl} from "@/app/lib/i18n";

const LAMP_ITEMS = [
    {key: 'magnolia', label: 'lampMagnolia', Icon: PiFlowerFill},
    {key: 'goldblue', label: 'lampGoldBlue', Icon: GiDragonfly},
    {key: 'peony', label: 'lampPeony', Icon: IoRose},
    {key: 'acorn', label: 'lampAcorn', Icon: PiAcornFill},
    {key: 'waterlily', label: 'lampWaterlily', Icon: GiLilyPads},
    {key: 'chestnut', label: 'lampChestnut', Icon: GiChestnutLeaf},
    {key: 'vine', label: 'lampVine', Icon: GiCurlingVines},
    {key: 'dragonfly', label: 'lampDragonfly', Icon: GiFairyWings},
    {key: 'tulip', label: 'lampTulip', Icon: PiFlowerTulipFill},
    {key: 'little_peony', label: 'lampLittlePeony', Icon: MdLocalFlorist},
    {key: 'art_nouveau', label: 'lampArtNouveau', Icon: FaPalette},
    {key: 'peony2', label: 'lampPeony2', Icon: PiFlower},
];

const AVAILABLE_ITEMS = [
    {key: 'geometric', label: 'availableGeometric', Icon: IoIosGrid},
    {key: 'table', label: 'availableTable', Icon: LuLamp},
    {key: 'standing', label: 'availableStanding', Icon: LuLampFloor},
];

const MOBILE_FLAG_SIZE = {hu: '!w-6 !h-6', de: '!w-6 !h-6', en: '!w-5.5 !h-5.5'};
const BAR_BASE_CLASS = "animate__animated animate__fadeInDown bg-transparent select-none uppercase antonio-navbar";
const MOBILE_GRID_ITEM_CLASS = 'border-2 border-gray-200';

/** Navbar label for the current page ('' for pages without one). */
function getRouteLabel(pagePath, t) {
    switch (pagePath) {
        case '/':
            return t.main;
        case '/tiffanylamps':
            return t.tiffanyLamps;
        case '/tiffanylampsavailable':
            return t.availableLamps;
        case '/contact':
            return t.contact;
        default:
            return '';
    }
}

export default function NavbarTiffanyStudio() {
    const {host, locale, site, pagePath, localized, switchLocale} = useLocaleNavigation();
    const t = TIFFANY_NAV_TEXT[locale];
    const phone = getTiffanyPhone(host);

    const [isTiffanyLampsOpen, setTiffanyLampsIsOpen] = useState(false);
    const [isAvailableLampsOpen, setAvailableLampsIsOpen] = useState(false);

    // The brand-choice landing page lives on glassartista.com.
    const glassArtistaHref = brandUrl(BRANDS.GLASSARTISTA, '/', locale);

    // The first entry of each menu opens the page at its top, the others jump to their section.
    const lampHref = (key) => localized(key === LAMP_ITEMS[0].key ? '/tiffanylamps' : `/tiffanylamps#${key}`);
    const availableHref = (key) =>
        localized(key === AVAILABLE_ITEMS[0].key ? '/tiffanylampsavailable' : `/tiffanylampsavailable#${key}`);
    const closeLamps = () => setTiffanyLampsIsOpen(false);
    const closeAvailable = () => setAvailableLampsIsOpen(false);

    const linkClass = (isActive) => isActive ? 'underline' : 'hover:underline hover:decoration-dashed';
    // Language buttons per domain (e.g. no Hungarian button on tiffanystudio.at), see SITES in i18n.js.
    const flagLocales = site.flagLocales;

    return (
        <>
            <Navbar position="sticky" className="xl:hidden" classNames={{base: `!px-0 ${BAR_BASE_CLASS}`}}>
                <NavbarBrand>
                    <Image draggable={false} alt={`${t.branding} ${locale === 'hu' ? 'logó' : 'logo'}`} src="/design/tiffanystudiologotext.png"
                           width={50} height={50} priority/>
                </NavbarBrand>
                <NavbarContent justify="center">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                className="bg-transparent data-[hover=true]:bg-transparent text-lg md:text-xl uppercase antonio-navbar"
                                radius="none"
                                size="sm"
                                style={{padding: 0}}
                                endContent={<DropdownChevron isOpen={isTiffanyLampsOpen}/>}
                            >
                                {getRouteLabel(pagePath, t)}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dropdown menu">
                            <DropdownSection showDivider>
                                <DropdownItem key="landing_page" href={glassArtistaHref}>
                                    <span className={linkClass(false)}>{t.landing}</span>
                                </DropdownItem>
                                <DropdownItem key="main_page" href={localized('/')}>
                                    <span className={linkClass(pagePath === '/')}>
                                        {t.main}
                                    </span>
                                </DropdownItem>
                                <DropdownItem key="contact" href={localized('/contact')}>
                                    <span className={linkClass(pagePath === '/contact')}>{t.contact}</span>
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection showDivider title={t.tiffanyLamps} classNames={{group: "grid grid-cols-2 gap-2"}}>
                                {LAMP_ITEMS.map(({key, label, Icon}) => (
                                    <DropdownItem key={key} className={MOBILE_GRID_ITEM_CLASS} startContent={<Icon size={20}/>}
                                                  href={lampHref(key)}>{t[label]}</DropdownItem>
                                ))}
                            </DropdownSection>
                            <DropdownSection showDivider title={t.availableLamps} classNames={{group: "flex flex-col gap-2"}}>
                                {AVAILABLE_ITEMS.map(({key, label, Icon}) => (
                                    <DropdownItem key={key} startContent={<Icon size={20}/>} className={`${MOBILE_GRID_ITEM_CLASS} w-min`}
                                                  href={availableHref(key)}>{t[label]}</DropdownItem>
                                ))}
                            </DropdownSection>
                            <DropdownSection classNames={{group: "flex flex-row w-fit gap-4 mx-auto text-neutral-400"}}>
                                {flagLocales.map((flagLocale) => (
                                    <DropdownItem
                                        key={flagLocale}
                                        aria-label={LOCALE_LABELS[flagLocale]}
                                        aria-current={locale === flagLocale ? 'true' : undefined}
                                        onPress={() => switchLocale(flagLocale)}
                                    >
                                        <FlagAvatar locale={flagLocale} isActive={locale === flagLocale}
                                                    sizeClass={MOBILE_FLAG_SIZE[flagLocale]}/>
                                    </DropdownItem>
                                ))}
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <MobileSocialLinks links={TIFFANY_LINKS}/>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            <Navbar position="sticky" maxWidth="full" className="hidden xl:block" classNames={{base: BAR_BASE_CLASS}}>
                <NavbarBrand>
                    <div className="flex items-center gap-3">
                        <Image draggable={false} alt={`${t.branding} ${locale === 'hu' ? 'logó' : 'logo'}`} src="/design/tiffanystudiologo.png"
                               width={36} height={42} priority/>
                        <p className="text-2xl pt-1 allura-regular normal-case bg-gradient-to-r from-[#896b60] to-[#ce9c72] inline-block text-transparent bg-clip-text">
                            {t.branding}
                        </p>
                    </div>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4 " justify="center">
                    <NavbarItem>
                        <Tooltip content={t.backTooltip} placement="bottom" showArrow={true} radius="full" color="foreground" size="sm">
                            <Link href={glassArtistaHref}><FaArrowAltCircleLeft color="white" className="pt-1" size={27}/></Link>
                        </Tooltip>
                    </NavbarItem>
                    <NavbarItem>
                        <NavTextButton isActive={pagePath === '/'} href={localized('/')}>
                            {t.main}
                        </NavTextButton>
                    </NavbarItem>
                    <HoverDropdown isOpen={isTiffanyLampsOpen} setIsOpen={setTiffanyLampsIsOpen} label={t.tiffanyLamps}
                                   isActive={pagePath === '/tiffanylamps'} href={localized('/tiffanylamps')}>
                        <DropdownMenu aria-label="Tiffany lámpák menü">
                            {LAMP_ITEMS.map(({key, label, Icon}) => (
                                <DropdownItem key={key} startContent={<Icon size={20}/>}
                                              href={lampHref(key)} onPress={closeLamps}>{t[label]}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </HoverDropdown>
                    <HoverDropdown isOpen={isAvailableLampsOpen} setIsOpen={setAvailableLampsIsOpen} label={t.availableLamps}
                                   isActive={pagePath === '/tiffanylampsavailable'} variant="light"
                                   href={localized('/tiffanylampsavailable')}>
                        <DropdownMenu aria-label="Rendelhető Tiffany lámpák kategóriák">
                            {AVAILABLE_ITEMS.map(({key, label, Icon}) => (
                                <DropdownItem key={key} startContent={<Icon size={20}/>}
                                              href={availableHref(key)} onPress={closeAvailable}>{t[label]}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </HoverDropdown>
                    {/* Lamp bases: placeholder entry, intentionally disabled (no page yet). */}
                    <Dropdown isDisabled>
                        <NavbarItem className="py-2 cursor-pointer">
                            <DropdownTrigger>
                                <Button
                                    className="px-3 bg-transparent data-[hover=true]:bg-transparent text-xl uppercase antonio-navbar"
                                    endContent={<FaChevronDown size={20} className="pt-1"/>}
                                    radius="sm"
                                    variant="light"
                                >
                                    {t.lampBases}
                                </Button>
                            </DropdownTrigger>
                        </NavbarItem>
                    </Dropdown>
                    <NavbarItem>
                        <NavTextButton isActive={pagePath === '/contact'} href={localized('/contact')}>
                            {t.contact}
                        </NavTextButton>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <DesktopContactLinks links={TIFFANY_LINKS} phone={phone} t={t}/>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    );
}
