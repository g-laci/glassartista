import {resolveLocale} from "@/app/lib/i18n";
import {TIFFANY_LAMPS_NAV_TEXT, TIFFANY_LAMPS_SECTION_KEYS, TIFFANY_LAMPS_TEXT} from "@/app/content/tiffanyLamps";
import TiffanyLampsView from "./TiffanyLampsView";

export default async function TiffanyLampsPage({params}) {
    const locale = resolveLocale((await params).lang);
    const sections = TIFFANY_LAMPS_SECTION_KEYS.map((key) => ({key, slides: TIFFANY_LAMPS_TEXT[locale][key]}));
    return <TiffanyLampsView sections={sections} navText={TIFFANY_LAMPS_NAV_TEXT[locale]}/>;
}
