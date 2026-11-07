'use client'

import Link from "next/link";
import {Button} from "@heroui/react";
import {BsLampFill} from "react-icons/bs";
import {GiWindowBars} from "react-icons/gi";

const ICONS = {lamp: BsLampFill, window: GiWindowBars};

/** Landing page button: a crawlable link to `href` (internal path or external URL) styled as a button. */
export default function LandingButton({href, icon, children}) {
    const Icon = ICONS[icon];
    return (
        <Button as={Link} href={href} className="light" variant="faded" startContent={<Icon size={20}/>}>
            {children}
        </Button>
    );
}
