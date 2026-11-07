import Image from "next/image";
import {notFound} from "next/navigation";
import {BRANDS, brandUrl, getSite, localizePath} from "@/app/lib/i18n";
import {buildPageJsonLd, buildPageMetadata} from "@/app/lib/seo";
import JsonLd from "@/app/components/seo/JsonLd";
import {LANDING_TEXT} from "@/app/content/landing";
import LandingButton from "./LandingButton";

// Brand-choice landing page; only glassartista.com has one (the studio domains start with the studio).

export async function generateMetadata({params}) {
    return buildPageMetadata(BRANDS.GLASSARTISTA, "landing", (await params).lang);
}

export default async function LandingPage({params}) {
    const {host, lang: locale} = await params;
    if (getSite(host).brand !== BRANDS.GLASSARTISTA) notFound();
    const t = LANDING_TEXT[locale];

    return (
        <div className="h-screen">
            <JsonLd data={buildPageJsonLd(BRANDS.GLASSARTISTA, "landing", locale)}/>
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
                            <LandingButton href={brandUrl(BRANDS.TIFFANY, "/", locale)} icon="lamp">{t.btnPrimary}</LandingButton>
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
                            <LandingButton href={localizePath(host, "/home", locale)} icon="window">{t.btnPrimary}</LandingButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
