import {resolveLocale} from "@/app/lib/i18n";
import {GALLERY_NAV_TEXT, GALLERY_SECTION_KEYS, GALLERY_TEXT} from "@/app/content/gallery";
import GalleryView from "./GalleryView";

export default async function GalleryPage({params}) {
    const locale = resolveLocale((await params).lang);
    const sections = GALLERY_SECTION_KEYS.map((key) => ({key, slides: GALLERY_TEXT[locale][key]}));
    return <GalleryView sections={sections} navText={GALLERY_NAV_TEXT[locale]}/>;
}
