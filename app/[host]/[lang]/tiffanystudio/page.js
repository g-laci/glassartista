import {BRANDS} from "@/app/lib/i18n";
import {buildPageJsonLd, buildPageMetadata} from "@/app/lib/seo";
import {withAltText} from "@/app/lib/altText";
import JsonLd from "@/app/components/seo/JsonLd";
import {STUDIO_TEXT} from "@/app/content/studio";
import {TIFFANY_NAV_TEXT} from "@/app/content/navigation";
import StudioView from "./StudioView";

export async function generateMetadata({params}) {
    return buildPageMetadata(BRANDS.TIFFANY, "home", (await params).lang);
}

export default async function TiffanyStudioPage({params}) {
    const {lang} = await params;
    const brand = TIFFANY_NAV_TEXT[lang].branding;
    return (
        <>
            <JsonLd data={buildPageJsonLd(BRANDS.TIFFANY, "home", lang)}/>
            <h1 className="sr-only">{brand}</h1>
            <StudioView slides={withAltText(STUDIO_TEXT[lang].slides, brand)}/>
        </>
    );
}
