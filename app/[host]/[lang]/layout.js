import "../../globals.css";
import "animate.css";
import {Suspense} from "react";
import {Analytics} from "@vercel/analytics/next";
import {Providers} from "@/app/components/Providers";
import Footer from "@/app/components/Footer";
import {fontVariables} from "@/app/lib/fonts";
import {getSite, SITE_KEYS, SITES} from "@/app/lib/i18n";
import {BRAND_NAMES} from "@/app/content/seo";

// `host` is the site key set by the middleware (e.g. "tiffanystudio.at"), `lang` a locale whose
// canonical pages live on that site. Every combination is rendered at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return SITE_KEYS.flatMap((host) => SITES[host].locales.map((lang) => ({host, lang})));
}

export async function generateMetadata({params}) {
    const {host, lang} = await params;
    const site = getSite(host);
    return {
        metadataBase: new URL(site.origin),
        applicationName: BRAND_NAMES[site.brand][lang],
        robots: {
            index: true,
            follow: true,
            googleBot: {index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1},
        },
        icons: {icon: "/design/favicon-256.ico"},
    };
}

export default async function RootLayout({children, params}) {
    const {host, lang} = await params;

    return (
        <html lang={lang} className={`dark bg-[#111111] ${fontVariables}`}>
        <body className="min-h-screen bg-[#111111] inter-description">
            <Providers host={host} locale={lang}>
                {children}
                <Footer/>
                {/* Reads search params, which requires a Suspense boundary. */}
                <Suspense>
                    <Analytics/>
                </Suspense>
            </Providers>
        </body>
        </html>
    );
}
