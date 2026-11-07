'use client'

import {useState} from "react";
import {Button} from "@heroui/react";
import {FaArrowAltCircleDown, FaArrowAltCircleUp} from "react-icons/fa";
import {ImageCarousel, TextCarousel} from "@/app/components/carousel/Carousel";
import {CarouselControls} from "@/app/components/carousel/CarouselControls";
import {useCarouselPositions, useSectionNavigation} from "@/app/components/sections/useSectionNavigation";

const PULSE_CLASS = "animate__animated animate__pulse animate__slow animate__infinite";

/**
 * Stacked full-screen sections, each with an image carousel and a companion panel (a text
 * carousel by default), plus fixed "previous / next section" buttons.
 *
 * @param sections   [{key, slides}] in display order
 * @param icons      {[key]: IconComponent} shown on slides without an image
 * @param navText    {prevButton, nextButton}
 * @param renderAside optional (section) => element replacing the text carousel
 * @param animation  entrance animation class of the controls and the top button
 */
export function SectionCarousels({sections, icons, navText, renderAside, animation = "animate__fadeInUp"}) {
    // Sections are fixed for the lifetime of the page; keep one stable key list for the hooks.
    const [sectionKeys] = useState(() => sections.map((section) => section.key));
    const {sectionRefs, goToPrevious, goToNext} = useSectionNavigation(sectionKeys);
    const {positions, setPosition, step} = useCarouselPositions(sectionKeys);

    return (
        <div className="overflow-x-hidden pb-12">
            {sections.map((section, index) => {
                const {key, slides} = section;
                const setCurrent = (value) => setPosition(key, value);
                const previous = () => step(key, slides.length, -1);
                const next = () => step(key, slides.length, 1);

                return (
                    <div
                        id={key}
                        key={key}
                        ref={sectionRefs[index]}
                        className={`w-screen h-screen-minus-navbar-desktop content-center justify-self-center ${index > 0 ? "lg:pt-[64px]" : "lg:pb-[64px]"}`}
                    >
                        <div className="w-full justify-self-center ">
                            <div className="relative  w-full h-full flex flex-col-reverse xl:flex-row gap-4 ">
                                <div className="xl:w-1/2 overflow-hidden">
                                    <ImageCarousel
                                        slides={slides}
                                        current={positions[key]}
                                        setCurrent={setCurrent}
                                        handlePreviousClick={previous}
                                        handleNextClick={next}
                                        icon={icons[key]}
                                        eager={index === 0}
                                    />
                                </div>
                                {renderAside ? renderAside(section) : (
                                    <div className="xl:w-1/2 overflow-hidden">
                                        <TextCarousel
                                            slides={slides}
                                            current={positions[key]}
                                            setCurrent={setCurrent}
                                            icon={icons[key]}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={`justify-center w-full flex animate__animated ${animation}`}>
                                <CarouselControls onPrevious={previous} onNext={next}/>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className={`fixed top-15 lg:top-16 left-1/2 -translate-x-1/2 z-51 animate__animated ${animation}`}>
                <Button className={PULSE_CLASS} onPress={goToPrevious} variant="flat" radius="full" size="sm"
                        endContent={<FaArrowAltCircleUp size={18}/>}>
                    {navText.prevButton}
                </Button>
            </div>
            <div className="fixed bottom-7 lg:bottom-3 left-1/2 -translate-x-1/2 z-51 animate__animated animate__fadeInUp">
                <Button className={PULSE_CLASS} onPress={goToNext} variant="flat" radius="full" size="sm"
                        endContent={<FaArrowAltCircleDown size={18}/>}>
                    {navText.nextButton}
                </Button>
            </div>
        </div>
    );
}
