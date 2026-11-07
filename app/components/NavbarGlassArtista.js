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
import {FaArrowAltCircleLeft, FaGem} from "react-icons/fa";
import {FaLandmarkDome} from "react-icons/fa6";
import {PiCardsThreeFill} from "react-icons/pi";
import {GiDoorway, GiWindowBars} from "react-icons/gi";
import {BsDoorOpenFill} from "react-icons/bs";
import {IoHammerSharp} from "react-icons/io5";
import {BiArch, BiVerticalTop} from "react-icons/bi";
import {LiaPencilRulerSolid} from "react-icons/lia";
import {MdChurch, MdGridGoldenratio, MdVideoLibrary} from "react-icons/md";
import {useLocaleNavigation} from "@/app/components/navigation/useLocaleNavigation";
import {FlagAvatar, LOCALE_LABELS} from "@/app/components/navigation/FlagAvatar";
import {
    DesktopContactLinks,
    DropdownChevron,
    HoverDropdown,
    MobileSocialLinks,
    NavTextButton,
} from "@/app/components/navigation/NavbarParts";
import {GLASSARTISTA_NAV_TEXT} from "@/app/content/navigation";
import {getGlassArtistaPhone, GLASSARTISTA_LINKS} from "@/app/content/site";
import {LOCALES} from "@/app/lib/i18n";

const GALLERY_ITEMS = [
    {key: 'dome', Icon: FaLandmarkDome},
    {key: 'canopy', Icon: BiArch},
    {key: 'entrance', Icon: GiDoorway},
    {key: 'window', Icon: GiWindowBars},
    {key: 'ceiling', Icon: BiVerticalTop},
    {key: 'ecclesial', Icon: MdChurch},
    {key: 'entranceDoor', Icon: BsDoorOpenFill},
];

const DETAILS_ITEMS = [
    {key: 'engineeringDesign', Icon: LiaPencilRulerSolid},
    {key: 'glasses', Icon: PiCardsThreeFill},
    {key: 'leadRailTechnology', Icon: MdGridGoldenratio},
    {key: 'decoration', Icon: FaGem},
    {key: 'installation', Icon: IoHammerSharp},
    {key: 'videos', Icon: MdVideoLibrary},
];

const MOBILE_FLAG_SIZE = {hu: '!w-6 !h-6', de: '!w-6 !h-6', en: '!w-5.5 !h-5.5'};
const BAR_BASE_CLASS = "animate__animated animate__fadeInDown bg-transparent select-none uppercase antonio-navbar";
const MOBILE_GRID_ITEM_CLASS = 'border-2 border-gray-200';
const LOGO_SRC = "/design/glassartista_logo_text_gradient.png";

/** Navbar label for the current page ('' for pages without one). */
function getRouteLabel(pagePath, t) {
    switch (pagePath) {
        case '/':
        case '/home':
            return t.main;
        case '/gallery':
            return t.gallery;
        case '/details':
            return t.details;
        case '/contact':
            return t.contact;
        default:
            return '';
    }
}

export default function NavbarGlassArtista() {
    const {locale, pagePath, localized, switchLocale} = useLocaleNavigation();
    const t = GLASSARTISTA_NAV_TEXT[locale];
    const phone = getGlassArtistaPhone(locale);

    const [isGalleryOpen, setGalleryIsOpen] = useState(false);
    const [isDetailsOpen, setDetailsIsOpen] = useState(false);

    // The first entry of each menu opens the page at its top, the others jump to their section.
    const galleryHref = (key) => localized(key === GALLERY_ITEMS[0].key ? '/gallery' : `/gallery#${key}`);
    const detailsHref = (key) => localized(key === DETAILS_ITEMS[0].key ? '/details' : `/details#${key}`);
    const closeGallery = () => setGalleryIsOpen(false);
    const closeDetails = () => setDetailsIsOpen(false);

    const linkClass = (isActive) => isActive ? 'underline' : 'hover:underline hover:decoration-dashed';

    return (
        <>
            <Navbar position="sticky" className="xl:hidden" classNames={{base: `!px-0 ${BAR_BASE_CLASS}`}}>
                <NavbarBrand>
                    <Image draggable={false} alt="GlassArtista logo" src={LOGO_SRC} width={50} height={35} priority/>
                </NavbarBrand>
                <NavbarContent justify="center">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                className="bg-transparent data-[hover=true]:bg-transparent text-lg md:text-xl uppercase antonio-navbar"
                                radius="none"
                                size="sm"
                                style={{padding: 0}}
                                endContent={<DropdownChevron isOpen={isGalleryOpen}/>}
                            >
                                {getRouteLabel(pagePath, t)}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dropdown menu">
                            <DropdownSection showDivider>
                                <DropdownItem key="landing_page" href={localized('/')}>
                                    <span className={linkClass(false)}>{t.landing}</span>
                                </DropdownItem>
                                <DropdownItem key="main" href={localized('/home')}>
                                    <span className={linkClass(pagePath === '/home')}>{t.main}</span>
                                </DropdownItem>
                                <DropdownItem key="contact" href={localized('/contact')}>
                                    <span className={linkClass(pagePath === '/contact')}>{t.contact}</span>
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection showDivider title={t.gallery} classNames={{group: "grid grid-cols-2 gap-2"}}>
                                {GALLERY_ITEMS.map(({key, Icon}) => (
                                    <DropdownItem key={key} startContent={<Icon size={20}/>} className={MOBILE_GRID_ITEM_CLASS}
                                                  href={galleryHref(key)}>{t[key]}</DropdownItem>
                                ))}
                            </DropdownSection>
                            <DropdownSection showDivider title={t.details} classNames={{group: "grid grid-cols-2 gap-2"}}>
                                {DETAILS_ITEMS.map(({key, Icon}) => (
                                    <DropdownItem key={key} startContent={<Icon size={20}/>} className={MOBILE_GRID_ITEM_CLASS}
                                                  href={detailsHref(key)}>{t[key]}</DropdownItem>
                                ))}
                            </DropdownSection>
                            <DropdownSection classNames={{group: "flex flex-row w-fit gap-4 mx-auto text-neutral-400"}}>
                                {LOCALES.map((flagLocale) => (
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
                        <MobileSocialLinks links={GLASSARTISTA_LINKS}/>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            <Navbar position="sticky" maxWidth="full" className="hidden xl:block" classNames={{base: BAR_BASE_CLASS}}>
                <NavbarBrand>
                    <div className="flex items-center gap-3">
                        <Image draggable={false} alt="GlassArtista logo" src={LOGO_SRC} width={62} height={43} priority/>
                    </div>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4 " justify="center">
                    <NavbarItem>
                        <Tooltip content={t.backTooltip} placement="bottom" showArrow={true} radius="full"
                                 color="foreground" size="sm">
                            <Link href={localized('/')}><FaArrowAltCircleLeft color="white" className="pt-1" size={27}/></Link>
                        </Tooltip>
                    </NavbarItem>
                    <NavbarItem>
                        <NavTextButton isActive={pagePath === '/home'} href={localized('/home')}>
                            {t.main}
                        </NavTextButton>
                    </NavbarItem>
                    <HoverDropdown isOpen={isGalleryOpen} setIsOpen={setGalleryIsOpen} label={t.gallery}
                                   isActive={pagePath === '/gallery'} href={localized('/gallery')}>
                        <DropdownMenu aria-label="Gallery menu">
                            {GALLERY_ITEMS.map(({key, Icon}) => (
                                <DropdownItem key={key} startContent={<Icon size={20}/>}
                                              href={galleryHref(key)} onPress={closeGallery}>{t[key]}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </HoverDropdown>
                    <HoverDropdown isOpen={isDetailsOpen} setIsOpen={setDetailsIsOpen} label={t.details}
                                   isActive={pagePath === '/details'} variant="light" href={localized('/details')}>
                        <DropdownMenu aria-label="Details menu">
                            {DETAILS_ITEMS.map(({key, Icon}) => (
                                <DropdownItem key={key} startContent={<Icon size={20}/>}
                                              href={detailsHref(key)} onPress={closeDetails}>{t[key]}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </HoverDropdown>
                    <NavbarItem>
                        <NavTextButton isActive={pagePath === '/contact'} href={localized('/contact')}>
                            {t.contact}
                        </NavTextButton>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <DesktopContactLinks links={GLASSARTISTA_LINKS} phone={phone} t={t}/>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    );
}
