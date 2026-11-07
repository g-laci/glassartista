'use client'

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {Tooltip} from "@heroui/react";
import {FaRegHandPointDown} from "react-icons/fa";
import {ImageModal} from "@/app/components/carousel/ImageModal";
import {isVideo} from "@/app/components/carousel/media";
import {useSite} from "@/app/lib/SiteContext";
import {IMAGE_CLICK_HINT} from "@/app/content/common";

const WHEEL_COOLDOWN_MS = 600; // matches the slide transition
const HINT_DELAY_MS = 850;
const TAP_TOLERANCE_PX = 10;
const SWIPE_THRESHOLD_PX = 50;
const TILT_TRANSFORM = "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)";
const SLIDE_TRANSITION = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";

/** Wraps `index` into the range [0, length). */
const wrap = (index, length) => (index + length) % length;

/**
 * Steps the carousel on mouse-wheel over `containerRef` (one step per gesture). The listener is
 * non-passive so the page itself does not scroll.
 */
function useWheelStep(containerRef, onStep) {
    const onStepRef = useRef(onStep);
    const isCoolingDown = useRef(false);

    useEffect(() => {
        onStepRef.current = onStep;
    });

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;
        const handleWheel = (event) => {
            event.stopPropagation();
            event.preventDefault();
            if (isCoolingDown.current) return;
            isCoolingDown.current = true;
            if (event.deltaY !== 0) onStepRef.current(event.deltaY < 0 ? -1 : 1);
            setTimeout(() => {
                isCoolingDown.current = false;
            }, WHEEL_COOLDOWN_MS);
        };
        node.addEventListener("wheel", handleWheel, {passive: false});
        return () => node.removeEventListener("wheel", handleWheel);
    }, [containerRef]);
}

function ImageSlide({slide, index, current, eager, icon: Icon, onSlideClick, touchHandlers}) {
    const slideRef = useRef(null);
    const [showHint, setShowHint] = useState(false);
    const {locale} = useSite();
    const isCurrent = current === index;

    // Show the "click to view" hint once the slide has finished moving into place.
    useEffect(() => {
        if (!isCurrent) {
            setShowHint(false);
            return;
        }
        const timeout = setTimeout(() => setShowHint(true), HINT_DELAY_MS);
        return () => clearTimeout(timeout);
    }, [isCurrent]);

    // Tilt: the cursor offset from the slide centre drives the CSS variables used by TILT_TRANSFORM.
    const setTilt = (x, y) => {
        slideRef.current?.style.setProperty("--x", `${x}px`);
        slideRef.current?.style.setProperty("--y", `${y}px`);
    };
    const handleMouseMove = (event) => {
        const rect = slideRef.current.getBoundingClientRect();
        setTilt(
            event.clientX - (rect.left + Math.floor(rect.width / 2)),
            event.clientY - (rect.top + Math.floor(rect.height / 2)),
        );
    };

    // Once loaded, media is shown fully opaque until the slide is next deselected.
    const revealOnLoad = (event) => {
        event.currentTarget.style.opacity = "1";
    };

    const {src, position, title} = slide;
    const alt = slide.alt ?? title ?? "";
    const mediaClassName = "absolute inset-0 w-[100%] h-[100%] rounded-xl object-cover transition-opacity duration-600 ease-in-out";
    const mediaStyle = {opacity: isCurrent ? 1 : 0.1, objectPosition: position || "bottom center"};

    return (
        <div className="[perspective:1200px] [transform-style:preserve-3d] animate__animated animate__fadeInLeftBig animate__slow">
            <li
                ref={slideRef}
                className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[60vmin] md:w-[40vmin] xl:w-[40vmin] h-[80vmin] md:h-[60vmin] xl:h-[60vmin] mx-[-2vmin] z-10 cursor-pointer"
                onClick={() => onSlideClick(index)}
                onTouchStart={touchHandlers.onTouchStart}
                onTouchMove={touchHandlers.onTouchMove}
                onTouchEnd={() => touchHandlers.onTouchEnd(index)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setTilt(0, 0)}
                style={{
                    "--x": "0px",
                    "--y": "0px",
                    transform: isCurrent ? "scale(1) rotateX(0deg)" : "scale(0.7) rotateX(8deg)",
                    transition: SLIDE_TRANSITION,
                    transformOrigin: "center",
                }}>
                <div
                    className="absolute top-0 left-0 w-full h-full bg-[#111111] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
                    style={{transform: isCurrent ? TILT_TRANSFORM : "none"}}>

                    {src ? (
                        isVideo(src) ? (
                            <video
                                className={mediaClassName}
                                style={mediaStyle}
                                draggable={false}
                                aria-label={alt}
                                src={src}
                                onLoadedData={revealOnLoad}
                                playsInline
                                muted
                                loop
                                autoPlay={isCurrent}
                                preload="auto"
                            />
                        ) : (
                            <Image
                                className={mediaClassName}
                                style={mediaStyle}
                                draggable={false}
                                alt={alt}
                                src={src}
                                fill
                                // Frames are portrait and most photos landscape (object-cover crops the
                                // sides), so request ~1.5x the frame width (60vmin / 80vmin frame height).
                                sizes="(min-width: 768px) 90vmin, 120vmin"
                                quality={85}
                                priority={eager && index === 0}
                                onLoad={revealOnLoad}
                            />
                        )
                    ) : (
                        Icon && <div className="flex items-center justify-center w-full h-full">
                            <Icon size={30}/>
                        </div>
                    )}

                    {isCurrent && src && showHint && (
                        <Tooltip
                            content={
                                <span className="flex items-center gap-2">
                                    {IMAGE_CLICK_HINT[locale]}
                                    <FaRegHandPointDown size={16}/>
                                </span>}
                            showArrow={true} placement="top" offset={15} radius="full" color="foreground"
                        >
                            <div className="absolute inset-0 bg-black/0 transition-all duration-1000"/>
                        </Tooltip>
                    )}
                </div>
            </li>
        </div>
    );
}

/**
 * Slideshow of images/videos. Clicking (or tapping) a side slide selects it; clicking the current
 * slide opens it full screen. Supports swipe and mouse-wheel. `eager` loads the first image with
 * high priority (use it for the carousel visible on page load).
 */
export function ImageCarousel({slides, current, setCurrent, handlePreviousClick, handleNextClick, icon, eager = false}) {
    const [modalOpen, setModalOpen] = useState(false);
    const containerRef = useRef(null);
    const touchStart = useRef({x: null, y: null});
    const touchEnd = useRef({x: null, y: null});

    const selectOrOpen = (index) => {
        if (current !== index) {
            setCurrent(index);
        } else if (slides[index]?.src) {
            setModalOpen(true);
        }
    };

    const touchHandlers = {
        onTouchStart: (event) => {
            touchStart.current = {x: event.touches[0].clientX, y: event.touches[0].clientY};
        },
        onTouchMove: (event) => {
            touchEnd.current = {x: event.touches[0].clientX, y: event.touches[0].clientY};
        },
        onTouchEnd: (index) => {
            if (touchStart.current.x === null || touchEnd.current.x === null) {
                selectOrOpen(index);
                return;
            }
            const diffX = touchStart.current.x - touchEnd.current.x;
            const diffY = touchStart.current.y - touchEnd.current.y;
            if (Math.abs(diffX) < TAP_TOLERANCE_PX && Math.abs(diffY) < TAP_TOLERANCE_PX) {
                selectOrOpen(index);
            } else if (diffX > SWIPE_THRESHOLD_PX) {
                handleNextClick?.();
            } else if (diffX < -SWIPE_THRESHOLD_PX) {
                handlePreviousClick?.();
            }
            touchStart.current = {x: null, y: null};
            touchEnd.current = {x: null, y: null};
        },
    };

    useWheelStep(containerRef, (direction) => (direction < 0 ? handlePreviousClick() : handleNextClick()));

    return (
        <div className="relative w-[60vmin] md:w-[40vmin] xl:w-[40vmin] h-[80vmin] md:h-[60vmin] xl:h-[60vmin] mx-auto xl:pl-16 mb-3 select-none">
            <ul
                ref={containerRef}
                className="absolute flex mx-[4vmin] transition-transform duration-1000 ease-in-out xl:py-3"
                style={{transform: `translateX(-${current * (100 / slides.length)}%)`}}
                tabIndex={0}
            >
                {slides.map((slide, index) => (
                    <ImageSlide
                        key={index}
                        slide={slide}
                        index={index}
                        current={current}
                        eager={eager}
                        icon={icon}
                        onSlideClick={selectOrOpen}
                        touchHandlers={touchHandlers}
                    />
                ))}
            </ul>

            <ImageModal
                src={slides[current]?.src ?? ''}
                alt={slides[current]?.alt ?? slides[current]?.title ?? ''}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}

function TextSlide({slide, index, current, icon: Icon, onSlideClick, touchHandlers}) {
    const isCurrent = current === index;
    const {paragraph, title} = slide;

    return (
        <div className="[perspective:300px] [transform-style:preserve-3d] animate__animated animate__fadeInLeftBig animate__slow">
            <li
                className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] xl:w-[50vmin] h-[70vmin] md:h-[30vmin] xl:h-[70vmin] z-10 mx-[2vmin] cursor-pointer"
                onClick={() => onSlideClick(index)}
                onTouchStart={touchHandlers.onTouchStart}
                onTouchMove={touchHandlers.onTouchMove}
                onTouchEnd={() => touchHandlers.onTouchEnd(index)}
                style={{
                    transform: isCurrent ? "scale(1) rotateX(0deg)" : "scale(0.98) rotateX(8deg)",
                    transition: SLIDE_TRANSITION,
                    transformOrigin: "bottom",
                }}>
                <div className="justify-items-center content-center absolute top-0 left-0 w-full h-full rounded-[1%] overflow-hidden transition-all duration-150 ease-out">
                    <article
                        className={`relative  transition-opacity duration-1000 ease-in-out ${isCurrent ? "opacity-100 visible" : "opacity-10 visible"}`}>
                        {(title || paragraph) ? (
                            <div className="flex flex-col items-center gap-2 md:gap-4 lg:gap-8">
                                {title && (
                                    <>
                                        {Icon && <Icon size={35}/>}
                                        <h2 className="text-2xl md:text-5xl lg:text-6xl text-center font-semibold relative allura-regular">
                                            {title}
                                        </h2>
                                    </>
                                )}
                                {paragraph && (
                                    <p className="text-sm md:text-lg text-justify inter-description relative"
                                       style={{whiteSpace: "pre-line"}}>
                                        {paragraph}
                                    </p>
                                )}
                            </div>
                        ) : (
                            Icon && <Icon size={30}/>
                        )}
                    </article>
                </div>
            </li>
        </div>
    );
}

/** Text companion of ImageCarousel; shares its `current` index. Supports swipe and mouse-wheel. */
export function TextCarousel({slides, current, setCurrent, icon}) {
    const containerRef = useRef(null);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const step = (direction) => setCurrent(wrap(current + direction, slides.length));
    const select = (index) => {
        if (current !== index) setCurrent(index);
    };

    const touchHandlers = {
        onTouchStart: (event) => {
            touchStartX.current = event.touches[0].clientX;
        },
        onTouchMove: (event) => {
            touchEndX.current = event.touches[0].clientX;
        },
        onTouchEnd: (index) => {
            if (touchStartX.current === null || touchEndX.current === null) {
                select(index);
                return;
            }
            const diff = touchStartX.current - touchEndX.current;
            if (Math.abs(diff) < TAP_TOLERANCE_PX) {
                select(index);
            } else if (diff > SWIPE_THRESHOLD_PX) {
                step(1);
            } else if (diff < -SWIPE_THRESHOLD_PX) {
                step(-1);
            }
            touchStartX.current = null;
            touchEndX.current = null;
        },
    };

    useWheelStep(containerRef, step);

    return (
        <div className="relative w-[70vmin] xl:w-[50vmin] h-[70vmin] md:h-[30vmin] xl:h-[70vmin] mx-auto xl:ml-16">
            <ul
                ref={containerRef}
                className="absolute flex xl:mx-[-4vmin] transition-transform duration-1000 ease-in-out"
                style={{transform: `translateX(-${current * (100 / slides.length)}%)`}}
                tabIndex={0}
            >
                {slides.map((slide, index) => (
                    <TextSlide
                        key={index}
                        slide={slide}
                        index={index}
                        current={current}
                        icon={icon}
                        onSlideClick={select}
                        touchHandlers={touchHandlers}
                    />
                ))}
            </ul>
        </div>
    );
}
