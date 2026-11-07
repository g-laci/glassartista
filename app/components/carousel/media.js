/** True for slide sources that should be rendered as <video>. */
export function isVideo(src) {
    if (!src) return false;
    const clean = src.split("?")[0].toLowerCase();
    return clean.endsWith(".mp4") || clean.startsWith("data:video") || clean.includes("video/mp4");
}
