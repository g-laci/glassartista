import {resolveLocale} from "@/app/lib/i18n";
import {DETAILS_NAV_TEXT, DETAILS_SECTION_KEYS, DETAILS_TEXT} from "@/app/content/details";
import DetailsView from "./DetailsView";

export default async function DetailsPage({params}) {
    const locale = resolveLocale((await params).lang);
    const sections = DETAILS_SECTION_KEYS.map((key) => ({key, slides: DETAILS_TEXT[locale][key]}));
    return <DetailsView sections={sections} navText={DETAILS_NAV_TEXT[locale]}/>;
}
