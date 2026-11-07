import {resolveLocale} from "@/app/lib/i18n";
import {AVAILABLE_LAMPS_TEXT, GEOMETRIC_META, STANDING_META, TABLE_META} from "@/app/content/availableLamps";
import AvailableLampsView from "./AvailableLampsView";

/** Pairs each lamp's image metadata with its localized name. */
function withNames(meta, names) {
    return meta.map((lamp, i) => ({...lamp, name: names[i].name}));
}

export default async function TiffanyLampsAvailablePage({params}) {
    const t = AVAILABLE_LAMPS_TEXT[resolveLocale((await params).lang)];
    const groups = [
        {id: 'geometric', title: t.titleGeometric, imageHeight: 358, lamps: withNames(GEOMETRIC_META, t.geometric)},
        {id: 'table', title: t.titleTable, imageHeight: 358, lamps: withNames(TABLE_META, t.table)},
        {id: 'standing', title: t.titleStanding, imageHeight: 537, lamps: withNames(STANDING_META, t.standing)},
    ];
    return <AvailableLampsView groups={groups} diameterLabel={t.diameter}/>;
}
