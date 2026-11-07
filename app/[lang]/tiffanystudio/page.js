import {resolveLocale} from "@/app/lib/i18n";
import {STUDIO_TEXT} from "@/app/content/studio";
import StudioView from "./StudioView";

export default async function TiffanyStudioPage({params}) {
    const locale = resolveLocale((await params).lang);
    return <StudioView slides={STUDIO_TEXT[locale].slides}/>;
}
