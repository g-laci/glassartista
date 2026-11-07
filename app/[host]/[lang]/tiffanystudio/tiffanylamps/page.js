import {BRANDS} from "@/app/lib/i18n";
import {buildPageJsonLd, buildPageMetadata, sectionItems} from "@/app/lib/seo";
import {withAltText} from "@/app/lib/altText";
import JsonLd from "@/app/components/seo/JsonLd";
import {TIFFANY_LAMPS_NAV_TEXT, TIFFANY_LAMPS_SECTION_KEYS, TIFFANY_LAMPS_TEXT} from "@/app/content/tiffanyLamps";
import {TIFFANY_NAV_TEXT} from "@/app/content/navigation";
import TiffanyLampsView from "./TiffanyLampsView";

export async function generateMetadata({params}) {
    return buildPageMetadata(BRANDS.TIFFANY, "tiffanylamps", (await params).lang);
}

export default async function Page({params}) {
    const {lang} = await params;
    const nav = TIFFANY_NAV_TEXT[lang];
    const sections = TIFFANY_LAMPS_SECTION_KEYS.map((key) => ({key, slides: withAltText(TIFFANY_LAMPS_TEXT[lang][key], nav.tiffanyLamps)}));
    return (
        <>
            <JsonLd data={buildPageJsonLd(BRANDS.TIFFANY, "tiffanylamps", lang, sectionItems(sections))}/>
            <h1 className="sr-only">{`${nav.tiffanyLamps} – ${nav.branding}`}</h1>
            <TiffanyLampsView sections={sections} navText={TIFFANY_LAMPS_NAV_TEXT[lang]}/>
        </>
    );
}
