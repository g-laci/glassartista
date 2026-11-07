'use client'

import {createRef, useEffect, useRef, useState} from "react";
import {useSite} from "@/app/lib/SiteContext";

const SECTION_COOLDOWN_MS = 700;
const MIN_SWIPE_PX = 40;

function scrollToSection(sectionRefs, index) {
    if (index === 0) {
        window.scrollTo({top: 0, behavior: "smooth"});
    } else {
        sectionRefs[index].current.scrollIntoView({behavior: "smooth", block: "start"});
    }
}

function setHash(key) {
    window.history.replaceState(null, '', `#${key}`);
}

/**
 * Full-screen section paging for pages made of stacked sections (one per key).
 * - mouse wheel / vertical swipe move one section at a time (page scrolling is disabled)
 * - the URL hash tracks the current section, and an initial hash scrolls to its section
 * - goToPrevious / goToNext wrap around at the ends
 *
 * @param {string[]} sectionKeys stable list of section keys (used as element ids and hashes)
 */
export function useSectionNavigation(sectionKeys) {
    const {locale} = useSite();
    const [sectionRefs] = useState(() => sectionKeys.map(() => createRef()));
    const currentSection = useRef(0);

    // Scroll to the section named by the URL hash (re-run when the locale changes).
    useEffect(() => {
        const index = sectionKeys.indexOf(window.location.hash.replace('#', ''));
        if (index !== -1 && sectionRefs[index].current) {
            currentSection.current = index;
            sectionRefs[index].current.scrollIntoView({behavior: "smooth", block: "start"});
        }
    }, [locale, sectionKeys, sectionRefs]);

    // Wheel and swipe paging.
    useEffect(() => {
        let isCoolingDown = false;
        let touchStartY = null;

        const moveBy = (direction) => {
            const next = currentSection.current + direction;
            if (next < 0 || next >= sectionKeys.length) return;
            currentSection.current = next;
            setHash(sectionKeys[next]);
            isCoolingDown = true;
            scrollToSection(sectionRefs, next);
            setTimeout(() => {
                isCoolingDown = false;
            }, SECTION_COOLDOWN_MS);
        };

        const handleWheel = (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (isCoolingDown) return;
            moveBy(event.deltaY > 0 ? 1 : -1);
        };

        const handleTouchStart = (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (event.touches.length === 1) {
                touchStartY = event.touches[0].clientY;
            }
        };

        const handleTouchEnd = (event) => {
            event.preventDefault();
            if (touchStartY === null) return;
            const deltaY = touchStartY - event.changedTouches[0].clientY;
            if (Math.abs(deltaY) > MIN_SWIPE_PX && !isCoolingDown) {
                moveBy(deltaY > 0 ? 1 : -1);
            }
            touchStartY = null;
        };

        window.addEventListener("wheel", handleWheel, {passive: false});
        window.addEventListener("touchstart", handleTouchStart, {passive: false});
        window.addEventListener("touchend", handleTouchEnd, {passive: false});
        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [locale, sectionKeys, sectionRefs]);

    const goToPrevious = () => {
        const previous = currentSection.current - 1;
        if (previous < 0) {
            const last = sectionKeys.length - 1;
            currentSection.current = last;
            setHash(sectionKeys[last]);
            scrollToSection(sectionRefs, last);
            return;
        }
        currentSection.current = previous;
        // Returning to the first section keeps the current hash.
        if (previous !== 0) setHash(sectionKeys[previous]);
        scrollToSection(sectionRefs, previous);
    };

    const goToNext = () => {
        const next = currentSection.current + 1 < sectionKeys.length ? currentSection.current + 1 : 0;
        currentSection.current = next;
        setHash(sectionKeys[next]);
        scrollToSection(sectionRefs, next);
    };

    return {sectionRefs, goToPrevious, goToNext};
}

/** Per-section carousel positions, keyed by section key. */
export function useCarouselPositions(sectionKeys) {
    const [positions, setPositions] = useState(() => Object.fromEntries(sectionKeys.map((key) => [key, 0])));

    const setPosition = (key, value) => setPositions((current) => ({...current, [key]: value}));

    /** Moves the carousel of `key` by `direction` (±1), wrapping around `length` slides. */
    const step = (key, length, direction) => setPosition(key, (positions[key] + direction + length) % length);

    return {positions, setPosition, step};
}
