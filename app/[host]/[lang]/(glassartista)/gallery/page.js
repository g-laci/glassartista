import {BRANDS} from "@/app/lib/i18n";
import {buildPageJsonLd, buildPageMetadata, sectionItems} from "@/app/lib/seo";
import {withAltText} from "@/app/lib/altText";
import JsonLd from "@/app/components/seo/JsonLd";
import {GALLERY_NAV_TEXT, GALLERY_SECTION_KEYS, GALLERY_TEXT} from "@/app/content/gallery";
import {GLASSARTISTA_NAV_TEXT} from "@/app/content/navigation";
import GalleryView from "./GalleryView";

export async function generateMetadata({params}) {
    return buildPageMetadata(BRANDS.GLASSARTISTA, "gallery", (await params).lang);
}

export default async function Page({params}) {
    const {lang} = await params;
    const nav = GLASSARTISTA_NAV_TEXT[lang];
    const sections = GALLERY_SECTION_KEYS.map((key) => ({key, slides: withAltText(GALLERY_TEXT[lang][key], nav[key])}));
    return (
        <>
            <JsonLd data={buildPageJsonLd(BRANDS.GLASSARTISTA, "gallery", lang, sectionItems(sections))}/>
            <h1 className="sr-only">{`${nav.gallery} – GlassArtista`}</h1>
            <GalleryView sections={sections} navText={GALLERY_NAV_TEXT[lang]}/>
        </>
    );
}
