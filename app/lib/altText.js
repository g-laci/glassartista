/**
 * Adds an `alt` text to every slide: its own title, otherwise the last title before it in the same
 * set (untitled slides continue the topic of the titled one), otherwise `fallback`.
 */
export function withAltText(slides, fallback = "") {
    let current = fallback;
    return slides.map((slide) => {
        if (slide.title) current = slide.title;
        return {...slide, alt: slide.alt || current};
    });
}
