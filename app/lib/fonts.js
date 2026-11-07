import {Allura, Antonio, Inter, Montserrat} from "next/font/google";

// Self-hosted by next/font. Each font is exposed as a CSS variable consumed in globals.css.
// latin-ext is required for Hungarian characters (ő, ű).

const montserrat = Montserrat({
    subsets: ["latin", "latin-ext"],
    style: ["normal", "italic"],
    variable: "--font-montserrat",
});

const inter = Inter({
    subsets: ["latin", "latin-ext"],
    style: ["normal", "italic"],
    axes: ["opsz"],
    variable: "--font-inter",
});

const allura = Allura({
    weight: "400",
    subsets: ["latin", "latin-ext"],
    variable: "--font-allura",
});

const antonio = Antonio({
    subsets: ["latin", "latin-ext"],
    variable: "--font-antonio",
});

export const fontVariables = [montserrat, inter, allura, antonio].map((font) => font.variable).join(" ");
