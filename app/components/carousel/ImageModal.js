'use client'

import {useEffect, useRef} from "react";
import Image from "next/image";
import {IoCloseCircle} from "react-icons/io5";
import {Lens} from "@/app/components/carousel/Lens";
import {isVideo} from "@/app/components/carousel/media";

const stopPropagation = (event) => event.stopPropagation();

/** Full-screen viewer for an image (with magnifier) or a video. Closes on backdrop click. */
export function ImageModal({src, alt, open, onClose}) {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!open || !isVideo(src) || !video) return;
        video.currentTime = 0;
        video.play().catch(() => {});
        return () => video.pause();
    }, [src, open]);

    if (!open) return null;

    const close = (event) => {
        event.stopPropagation();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-52 flex items-center justify-center bg-black bg-opacity-80 select-none rounded-none"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-6 text-white text-3xl font-bold z-60 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 transition"
                onClick={close}
                onTouchEnd={close}
                aria-label="Close modal"
                tabIndex={0}
            >
                <IoCloseCircle size={30} className="cursor-pointer"/>
            </button>

            {isVideo(src) ? (
                <video
                    ref={videoRef}
                    src={src}
                    controls
                    playsInline
                    autoPlay
                    draggable={false}
                    className="w-[90vw] h-[90vh] shadow-lg rounded-none"
                    style={{objectFit: "contain"}}
                    onClick={stopPropagation}
                />
            ) : (
                <Lens>
                    {/* Full-resolution original, so the magnifier stays sharp. */}
                    <Image
                        unoptimized
                        width={0}
                        height={0}
                        draggable={false}
                        src={src}
                        alt={alt}
                        className="w-[90vw] h-[90vh] shadow-lg rounded-none"
                        style={{objectFit: "contain"}}
                        onClick={stopPropagation}
                    />
                </Lens>
            )}
        </div>
    );
}
