'use client'

import {PiAcornFill, PiFlowerFill, PiFlowerTulipFill} from "react-icons/pi";
import {TbFlower} from "react-icons/tb";
import {GiChestnutLeaf, GiCurlingVines, GiDragonfly, GiFairyWings, GiLilyPads} from "react-icons/gi";
import {IoRose} from "react-icons/io5";
import {MdLocalFlorist} from "react-icons/md";
import {SectionCarousels} from "@/app/components/sections/SectionCarousels";

const LAMP_ICONS = {
    magnolia: PiFlowerFill,
    goldblue: GiDragonfly,
    peony: IoRose,
    acorn: PiAcornFill,
    waterlily: GiLilyPads,
    chestnut: GiChestnutLeaf,
    vine: GiCurlingVines,
    dragonfly: GiFairyWings,
    tulip: PiFlowerTulipFill,
    little_peony: MdLocalFlorist,
    art_nouveau: MdLocalFlorist,
    peony2: TbFlower,
};

export default function TiffanyLampsView({sections, navText}) {
    return <SectionCarousels sections={sections} icons={LAMP_ICONS} navText={navText}/>;
}
