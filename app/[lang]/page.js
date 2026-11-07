import Image from "next/image";
import {headers} from "next/headers";
import {normalizeHost, resolveLocale} from "@/app/lib/i18n";
import {LANDING_TEXT} from "@/app/content/landing";
import LandingButton from "./LandingButton";

const STUDIO_URLS = {hu: 'https://tiffanystudio.hu', en: 'https://tiffanystudio.at/en', de: 'https://tiffanystudio.at'};

/** On glassartista.com the studio lives on its own domain; elsewhere it is served under /tiffanystudio. */
function getStudioHref(host, locale) {
    return host === 'glassartista.com' ? STUDIO_URLS[locale] : '/tiffanystudio';
}

function getGlassArtistaHref(host, locale) {
    return host === 'glassartista.com' && locale !== 'de' ? `/${locale}/home` : '/home';
}

export default async function LandingPage({params}) {
    const locale = resolveLocale((await params).lang, 'de');
    const host = normalizeHost((await headers()).get('host'));
    const t = LANDING_TEXT[locale];

    return (
        <div className="h-screen">
            <div className="flex flex-col lg:flex-row text-white items-center justify-center h-full ">
                <div
                    className="lg:w-1/2 p-10 items-center bg-[url(/design/index-tiffany.webp)] bg-center bg-cover h-full relative overflow-hidden">
                    <div
                        className="animate__animated animate__fadeInLeft animate__slow absolute w-[200vw] lg:w-screen inset-0 bg-gradient-to-r from-black/90 to-black/0 z-0"/>
                    <div
                        className="animate__animated animate__fadeIn animate__slow flex flex-col gap-4 justify-center h-full relative z-1">
                        <div className="flex flex-row gap-3">
                            <Image draggable={false} alt={t.altLogo1} src="/design/tiffanystudiologowhiteoutline.png"
                                   width={36} height={42} priority style={{objectFit: "contain"}}/>
                            <h1 className="text-3xl lg:text-5xl allura-regular pt-2">{t.title1}</h1>
                        </div>
                        <p className="text-sm lg:text-xl text-justify paragraph--p1">{t.p1}</p>
                        <div>
                            <LandingButton href={getStudioHref(host, locale)} icon="lamp">{t.btnPrimary}</LandingButton>
                        </div>
                    </div>
                </div>

                <div
                    className="lg:w-1/2 p-10 items-center bg-[url(/design/index-olomuveg.webp)] bg-center bg-cover h-full relative overflow-hidden">
                    <div
                        className="animate__animated animate__fadeInRight animate__slow absolute w-[300vw] lg:w-screen inset-y-0 right-0 lg:-inset-x-full bg-gradient-to-l from-black/90 to-black/0 z-0"/>
                    <div
                        className="animate__animated animate__fadeIn animate__slow flex flex-col gap-4 justify-center h-full relative z-1 pb-8 lg:pb-0">
                        <div className="flex flex-row gap-3">
                            <Image draggable={false} alt={t.altLogo2} src="/design/glassartistalogowhiteoutline.png"
                                   width={48} height={26} priority style={{objectFit: "contain"}}/>
                            <h1 className="text-3xl lg:text-4xl antonio-navbar tracking-wider ">{t.title2}</h1>
                        </div>
                        <p className="text-sm lg:text-xl text-justify paragraph--p1">{t.p2}</p>
                        <div>
                            <LandingButton href={getGlassArtistaHref(host, locale)} icon="window">{t.btnPrimary}</LandingButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
