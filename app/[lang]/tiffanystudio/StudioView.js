'use client'

import {createRef, useEffect, useRef, useState} from "react";
import Image from "next/image";
import {motion} from "framer-motion";
import {ImageCarousel, TextCarousel} from "@/app/components/carousel/Carousel";
import {CarouselControls} from "@/app/components/carousel/CarouselControls";

const SECTION_COOLDOWN_MS = 300;
const XL_BREAKPOINT_PX = 1280;
const BACKGROUND_COLORS = ["#000000", "#170008", "#0f172a", "#171717", "#171200", "#001702"];
const BRAND_TITLES = ["Magnólia Tiffanystúdió", "Magnolia Tiffany Studio"];

/**
 * Tiffany Studio home. Desktop: a wheel-paged list of paragraphs next to a fixed image.
 * Mobile: a text carousel and an image carousel sharing one position.
 */
export default function StudioView({slides}) {
    const [sectionRefs] = useState(() => slides.map(() => createRef()));
    const currentSection = useRef(0);
    const [activeSection, setActiveSection] = useState(0);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [backgroundIndex, setBackgroundIndex] = useState(0);

    // Desktop: the wheel moves one paragraph at a time.
    useEffect(() => {
        let isCoolingDown = false;
        const handleWheel = (event) => {
            event.preventDefault();
            if (isCoolingDown) return;
            const next = currentSection.current + (event.deltaY > 0 ? 1 : -1);
            if (next < 0 || next >= sectionRefs.length) return;

            currentSection.current = next;
            setActiveSection(next);
            setBackgroundIndex(next);
            isCoolingDown = true;
            if (next === 0) {
                window.scrollTo({top: 0, behavior: "smooth"});
            } else {
                sectionRefs[next].current.scrollIntoView({behavior: "smooth", block: "start"});
            }
            setTimeout(() => {
                isCoolingDown = false;
            }, SECTION_COOLDOWN_MS);
        };
        window.addEventListener("wheel", handleWheel, {passive: false});
        return () => window.removeEventListener("wheel", handleWheel);
    }, [sectionRefs]);

    // Mobile: the carousel position also drives the section (and so the background colour).
    const selectSlide = (index) => {
        setCarouselIndex(index);
        if (window.innerWidth < XL_BREAKPOINT_PX) {
            currentSection.current = index;
            setBackgroundIndex(index);
        }
    };
    const step = (direction) => selectSlide((carouselIndex + direction + slides.length) % slides.length);
    const backgroundColor = BACKGROUND_COLORS[backgroundIndex % BACKGROUND_COLORS.length];

    return (
        <>
            <motion.div
                initial={{background: "linear-gradient(to bottom, #111111 0%, #000000 50%, #000000 100%)"}}
                animate={{background: `linear-gradient(to bottom, #111111 0%, ${backgroundColor} 50%, ${backgroundColor} 100%)`}}
                className="fixed w-screen h-screen"></motion.div>
            <div className=" h-min items-center justify-center hidden xl:block">
                <div className="flex flex-row gap-5 w-10/12 items-center justify-center mx-auto">
                    <div className="w-5/12 flex flex-col items-center justify-center  animate__animated animate__fadeInLeft">
                        <div className="w-[60vmin] flex flex-col gap-10 mt-20 items-center justify-center">
                            {slides.map((slide, index) => {
                                const visibility = activeSection === index ? "text-white" : "opacity-20";
                                return (
                                    <div key={(slide.title || "") + index} ref={sectionRefs[index]}
                                         className="max-w-md scroll-mt-40 items-center justify-center">
                                        <div className={`flex flex-col ${slide.title ? 'gap-10' : ''}`}>
                                            <h2 className={`font-bold ${visibility} ${BRAND_TITLES.includes(slide.title) ? "text-5xl allura-regular" : "text-4xl"}`}>
                                                {slide.title || ""}
                                            </h2>
                                            <p className={`text-lg text-justify ${visibility}`}>
                                                {slide.paragraph || ""}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="h-[90vh]"/>
                        </div>
                    </div>

                    <div className="pl-5 w-[40vmin] ">
                        <Image
                            src={slides[activeSection].src}
                            width={1000}
                            height={1500}
                            sizes="90vmin" // landscape photos cropped into a 40x60vmin frame
                            quality={85}
                            className="animate__animated animate__fadeInRight w-[40vmin] h-[60vmin] fixed top-20 mt-20 object-cover rounded-lg shadow-lg max-h-[80vh]"
                            alt="current section"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full h-[80vh] xl:hidden justify-self-center">
                <div className="relative overflow-hidden w-fit h-full justify-center items-center flex flex-col gap-4">
                    <div className="w-screen overflow-hidden">
                        <TextCarousel slides={slides} current={carouselIndex} setCurrent={selectSlide}/>
                    </div>
                    <div className="w-screen overflow-hidden">
                        <ImageCarousel
                            slides={slides}
                            current={carouselIndex}
                            setCurrent={selectSlide}
                            handlePreviousClick={() => step(-1)}
                            handleNextClick={() => step(1)}
                            eager
                        />
                    </div>
                </div>
                <div className="justify-center w-full flex mt-4 animate__animated animate__fadeInUp">
                    <CarouselControls onPrevious={() => step(-1)} onNext={() => step(1)}/>
                </div>
            </div>
        </>
    );
}
