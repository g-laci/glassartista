import "../globals.css";
import "animate.css";
import {Suspense} from "react";
import {headers} from "next/headers";
import {Analytics} from "@vercel/analytics/next";
import {Providers} from "@/app/components/Providers";
import Footer from "@/app/components/Footer";
import {fontVariables} from "@/app/lib/fonts";
import {getHostConfig, normalizeHost, resolveLocale} from "@/app/lib/i18n";
import {METADATA_TEXT} from "@/app/content/metadata";

async function getRequestSite(params) {
    const {lang} = await params;
    const host = normalizeHost((await headers()).get("host"));
    // The middleware always provides a valid locale; the host default covers any other path.
    const locale = resolveLocale(lang, getHostConfig(host).defaultLocale);
    return {host, locale};
}

export async function generateMetadata({params}) {
    const {locale} = await getRequestSite(params);
    return {
        ...METADATA_TEXT[locale],
        icons: {icon: "/design/favicon-256.ico"},
    };
}

export default async function RootLayout({children, params}) {
    const {host, locale} = await getRequestSite(params);

    return (
        <html lang={locale} className={`dark bg-[#111111] ${fontVariables}`}>
        <body className="min-h-screen bg-[#111111] inter-description">
            <Providers host={host} locale={locale}>
                {/* Kept outside Suspense so a notFound() in a page still sets the 404 status. */}
                {children}
                {/* These read search params, which requires a Suspense boundary. */}
                <Suspense>
                    <Footer/>
                    <Analytics/>
                </Suspense>
            </Providers>
        </body>
        </html>
    );
}
