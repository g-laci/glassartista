'use client'

import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

/** Magnifying-glass effect: shows a zoomed copy of `children` in a circle under the cursor. */
export function Lens({children, zoomFactor = 1.5, lensSize = 170}) {
    const [isHovering, setIsHovering] = useState(false);
    const [mousePosition, setMousePosition] = useState({x: 100, y: 100});

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setMousePosition({x: event.clientX - rect.left, y: event.clientY - rect.top});
    };

    const {x, y} = mousePosition;
    const mask = `radial-gradient(circle ${lensSize / 2}px at ${x}px ${y}px, black 100%, transparent 100%)`;

    return (
        <div
            className="relative overflow-hidden rounded-lg z-20"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}>
            {children}
            <AnimatePresence>
                {isHovering && (
                    <div>
                        <motion.div
                            initial={{opacity: 0, scale: 0.58}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.8}}
                            transition={{duration: 0.3, ease: "easeOut"}}
                            className="absolute inset-0 overflow-hidden"
                            style={{
                                maskImage: mask,
                                WebkitMaskImage: mask,
                                transformOrigin: `${x}px ${y}px`,
                                zIndex: 50,
                            }}>
                            <div
                                className="absolute inset-0"
                                style={{transform: `scale(${zoomFactor})`, transformOrigin: `${x}px ${y}px`}}>
                                {children}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
