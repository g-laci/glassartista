import {BRANDS} from "@/app/lib/i18n";
import {buildPageJsonLd, buildPageMetadata} from "@/app/lib/seo";
import {withAltText} from "@/app/lib/altText";
import JsonLd from "@/app/components/seo/JsonLd";
import {DETAILS_NAV_TEXT, DETAILS_SECTION_KEYS, DETAILS_TEXT} from "@/app/content/details";
import {GLASSARTISTA_NAV_TEXT} from "@/app/content/navigation";
import DetailsView from "./DetailsView";

export async function generateMetadata({params}) {
    return buildPageMetadata(BRANDS.GLASSARTISTA, "details", (await params).lang);
}

export default async function Page({params}) {
    const {lang} = await params;
    const nav = GLASSARTISTA_NAV_TEXT[lang];
    const sections = DETAILS_SECTION_KEYS.map((key) => ({key, slides: withAltText(DETAILS_TEXT[lang][key], nav[key])}));
    return (
        <>
            <JsonLd data={buildPageJsonLd(BRANDS.GLASSARTISTA, "details", lang)}/>
            <h1 className="sr-only">{`${nav.details} – GlassArtista`}</h1>
            <DetailsView sections={sections} navText={DETAILS_NAV_TEXT[lang]}/>
        </>
    );
}
