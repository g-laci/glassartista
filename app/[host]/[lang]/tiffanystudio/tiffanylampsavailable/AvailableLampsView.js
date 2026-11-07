'use client'

import {useState} from "react";
import Image from "next/image";
import {Tooltip} from "@heroui/react";
import {IoIosGrid} from "react-icons/io";
import {LuLamp, LuLampFloor} from "react-icons/lu";
import {FaRegHandPointDown} from "react-icons/fa";
import {ImageModal} from "@/app/components/carousel/ImageModal";
import {useSite} from "@/app/lib/SiteContext";
import {IMAGE_CLICK_HINT} from "@/app/content/common";

const GROUP_ICONS = {geometric: IoIosGrid, table: LuLamp, standing: LuLampFloor};

function LampGroup({group, diameterLabel, hint, onImageClick}) {
    const Icon = GROUP_ICONS[group.id];
    return (
        <>
            <div className="flex flex-col items-center justify-center text-center animate__animated animate__fadeInDown">
                <h2 className="text-3xl px-10 text-balance lg:text-5xl allura-regular ">{group.title}</h2>
                <Icon size={35} className="mt-6 mb-10"/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mx-12 animate__animated animate__fadeInUp">
                {group.lamps.map((lamp) => (
                    <div style={{position: "relative"}} key={lamp.index} className="flex flex-col items-center gap-1">
                        <Tooltip content={<span className="flex items-center gap-2">{hint}<FaRegHandPointDown size={16}/></span>}
                                 showArrow={true} placement="top" offset={15} radius="full" color="foreground">
                            <Image
                                src={lamp.src}
                                alt={lamp.name}
                                width={269}
                                height={group.imageHeight}
                                className="h-full mb-2 rounded-lg shadow-lg select-none cursor-pointer"
                                onClick={() => onImageClick(lamp)}
                                style={{objectFit: "cover"}}
                            />
                        </Tooltip>
                        <p className="text-center text-2xl antonio-navbar">{lamp.name}</p>
                        {lamp.diameter &&
                            <p className="text-center text-xl antonio-navbar">{`${lamp.diameter} ${diameterLabel}`}</p>
                        }
                    </div>
                ))}
            </div>
        </>
    );
}

/** Catalogue of orderable lamps in three groups; clicking an image opens it full screen. */
export default function AvailableLampsView({groups, diameterLabel}) {
    const {locale} = useSite();
    const [modalLamp, setModalLamp] = useState({src: '', name: ''});
    const [modalOpen, setModalOpen] = useState(false);

    const openImage = (lamp) => {
        setModalLamp(lamp);
        setModalOpen(true);
    };

    const [first, ...rest] = groups;
    const groupProps = {diameterLabel, hint: IMAGE_CLICK_HINT[locale], onImageClick: openImage};

    // The page root carries the first group's anchor; the other groups have their own.
    return (
        <div id={first.id}
             className="max-w-screen h-fit overflow-hidden flex flex-col gap-20 items-center justify-center mt-4 mb-16 ">
            <div className="flex flex-col items-center justify-center overflow-hidden">
                <LampGroup group={first} {...groupProps}/>
            </div>
            {rest.map((group) => (
                <div key={group.id} id={group.id} className="scroll-mt-20 flex flex-col items-center justify-center overflow-hidden">
                    <LampGroup group={group} {...groupProps}/>
                </div>
            ))}
            <ImageModal src={modalLamp.src} alt={modalLamp.name} open={modalOpen} onClose={() => setModalOpen(false)}/>
        </div>
    );
}
