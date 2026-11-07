'use client'

import {Button} from "@heroui/react";
import {useRouter} from "next/navigation";
import {BsLampFill} from "react-icons/bs";
import {GiWindowBars} from "react-icons/gi";

const ICONS = {lamp: BsLampFill, window: GiWindowBars};

/** Landing page button that navigates to `href` (internal path or external URL). */
export default function LandingButton({href, icon, children}) {
    const router = useRouter();
    const Icon = ICONS[icon];
    return (
        <Button className="light" variant="faded" startContent={<Icon size={20}/>} onPress={() => router.push(href)}>
            {children}
        </Button>
    );
}
