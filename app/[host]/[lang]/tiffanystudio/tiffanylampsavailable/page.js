import {BRANDS} from "@/app/lib/i18n";
import {buildPageJsonLd, buildPageMetadata} from "@/app/lib/seo";
import JsonLd from "@/app/components/seo/JsonLd";
import {AVAILABLE_LAMPS_TEXT, GEOMETRIC_META, STANDING_META, TABLE_META} from "@/app/content/availableLamps";
import {TIFFANY_NAV_TEXT} from "@/app/content/navigation";
import AvailableLampsView from "./AvailableLampsView";

/** Pairs each lamp's image metadata with its localized name. */
function withNames(meta, names) {
    return meta.map((lamp, i) => ({...lamp, name: names[i].name}));
}

export async function generateMetadata({params}) {
    return buildPageMetadata(BRANDS.TIFFANY, "available", (await params).lang);
}

export default async function TiffanyLampsAvailablePage({params}) {
    const {lang} = await params;
    const t = AVAILABLE_LAMPS_TEXT[lang];
    const nav = TIFFANY_NAV_TEXT[lang];
    const groups = [
        {id: 'geometric', title: t.titleGeometric, imageHeight: 358, lamps: withNames(GEOMETRIC_META, t.geometric)},
        {id: 'table', title: t.titleTable, imageHeight: 358, lamps: withNames(TABLE_META, t.table)},
        {id: 'standing', title: t.titleStanding, imageHeight: 537, lamps: withNames(STANDING_META, t.standing)},
    ];
    const items = groups.flatMap((group) => group.lamps.map((lamp) => ({name: lamp.name, image: lamp.src, anchor: group.id})));
    return (
        <>
            <JsonLd data={buildPageJsonLd(BRANDS.TIFFANY, "available", lang, items)}/>
            <h1 className="sr-only">{`${nav.availableLamps} – ${nav.branding}`}</h1>
            <AvailableLampsView groups={groups} diameterLabel={t.diameter}/>
        </>
    );
}
