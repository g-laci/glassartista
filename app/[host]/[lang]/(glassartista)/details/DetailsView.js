'use client'

import {LiaPencilRulerSolid} from "react-icons/lia";
import {PiCardsThreeFill} from "react-icons/pi";
import {MdGridGoldenratio, MdVideoLibrary} from "react-icons/md";
import {FaGem} from "react-icons/fa";
import {IoHammerSharp} from "react-icons/io5";
import {SectionCarousels} from "@/app/components/sections/SectionCarousels";

const TOPIC_ICONS = {
    engineeringDesign: LiaPencilRulerSolid,
    glasses: PiCardsThreeFill,
    leadRailTechnology: MdGridGoldenratio,
    decoration: FaGem,
    installation: IoHammerSharp,
    videos: MdVideoLibrary,
};

/** All paragraphs of a topic as one article, next to its image carousel. */
function TopicArticle({section: {key, slides}}) {
    return (
        <div className="xl:w-1/2 h-full overflow-hidden text-center xl:my-auto pt-4 xl:pt-0 xl:pr-10 animate__animated animate__fadeInRight">
            <article className="px-6 py-4">
                <h2 className="text-2xl font-semibold xl:text-left mb-3">
                    {slides[0]?.title || key.charAt(0).toUpperCase() + key.slice(1)}
                </h2>
                <div className="prose max-w-none text-justify">
                    {slides.map((slide, i) => slide.paragraph ? (
                        <p key={`${key}-p-${i}`} className="mb-3">{slide.paragraph}</p>
                    ) : null)}
                </div>
            </article>
        </div>
    );
}

export default function DetailsView({sections, navText}) {
    return (
        <SectionCarousels
            sections={sections}
            icons={TOPIC_ICONS}
            navText={navText}
            renderAside={(section) => <TopicArticle section={section}/>}
            animation="animate__fadeInDown"
        />
    );
}
