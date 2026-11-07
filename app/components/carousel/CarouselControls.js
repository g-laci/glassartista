'use client'

import {IconArrowNarrowRight} from "@tabler/icons-react";

function CarouselControl({isPrevious, title, onClick}) {
    return (
        <button
            className={`w-10 h-10 flex cursor-pointer items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${isPrevious ? "rotate-180" : ""}`}
            title={title}
            onClick={onClick}>
            <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200"/>
        </button>
    );
}

/** Previous / next arrow buttons for a carousel. */
export function CarouselControls({onPrevious, onNext}) {
    return (
        <>
            <CarouselControl isPrevious title="Go to previous slide" onClick={onPrevious}/>
            <CarouselControl title="Go to next slide" onClick={onNext}/>
        </>
    );
}
