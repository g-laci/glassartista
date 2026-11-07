'use client'

import {FaLandmarkDome} from "react-icons/fa6";
import {BiArch, BiVerticalTop} from "react-icons/bi";
import {GiDoorway, GiWindowBars} from "react-icons/gi";
import {MdChurch} from "react-icons/md";
import {BsDoorOpenFill} from "react-icons/bs";
import {SectionCarousels} from "@/app/components/sections/SectionCarousels";

const PROJECT_ICONS = {
    dome: FaLandmarkDome,
    canopy: BiArch,
    entrance: GiDoorway,
    window: GiWindowBars,
    ceiling: BiVerticalTop,
    ecclesial: MdChurch,
    entranceDoor: BsDoorOpenFill,
};

export default function GalleryView({sections, navText}) {
    return <SectionCarousels sections={sections} icons={PROJECT_ICONS} navText={navText}/>;
}
