#!/usr/bin/env node
// Generates the 1200×630 social preview images (Open Graph / Twitter) in public/og from the site's own
// photography and logos: the page photo, a dark gradient (as on the landing page) and the brand logo.
// Uses sharp, which ships with Next.js. Re-run after changing the photos below: npm run seo:og-images

import {mkdirSync} from "node:fs";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const OUT_DIR = "public/og";

const LOGOS = {
    glassartista: {src: "public/design/glassartista_logo_text.png", height: 250},
    tiffanystudio: {src: "public/design/tiffanystudiologotext.png", height: 330},
};

/** name -> {brand, photo, position}; position = sharp crop gravity of the photo. */
const IMAGES = {
    "glassartista-home": {brand: "glassartista", photo: "public/glassartista/dome/dome-2.webp", position: "centre"},
    "glassartista-gallery": {brand: "glassartista", photo: "public/glassartista/window/window-2.jpg", position: "centre"},
    "glassartista-details": {brand: "glassartista", photo: "public/glassartista/dome/dome-5.webp", position: "centre"},
    "glassartista-contact": {brand: "glassartista", photo: "public/glassartista/ecclesial/ecclesial-1.jpg", position: "centre"},
    "tiffanystudio-home": {brand: "tiffanystudio", photo: "public/tiffanystudio/magnolia/magnolia-2.jpg", position: "centre"},
    "tiffanystudio-tiffanylamps": {brand: "tiffanystudio", photo: "public/tiffanystudio/peony/peony-2.jpg", position: "centre"},
    "tiffanystudio-available": {brand: "tiffanystudio", photo: "public/tiffanystudio/geometric/geometric-11.jpg", position: "north"},
    "tiffanystudio-contact": {brand: "tiffanystudio", photo: "public/tiffanystudio/waterlily/waterlily-1.jpg", position: "centre"},
};

const BACKGROUND = "#111111";
const PANEL_WIDTH = 440; // dark logo panel on the left
const PHOTO_LEFT = 340; // the photo starts under the panel's right edge and fades in

/** Left-to-right black gradient, like the landing page overlay (from-black/90 to-black/0). */
function gradient(width, height, direction = "right") {
    const [x1, x2] = direction === "right" ? ["0%", "100%"] : ["100%", "0%"];
    return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <defs><linearGradient id="g" x1="${x1}" y1="0" x2="${x2}" y2="0">
            <stop offset="0" stop-color="#000" stop-opacity="0.9"/>
            <stop offset="0.55" stop-color="#000" stop-opacity="0.55"/>
            <stop offset="1" stop-color="#000" stop-opacity="0.05"/>
        </linearGradient></defs>
        <rect width="100%" height="100%" fill="url(#g)"/></svg>`);
}

async function photo(src, width, height, position) {
    return sharp(src).rotate().resize(width, height, {fit: "cover", position}).toBuffer();
}

async function logo(brand, maxHeight) {
    const {src, height} = LOGOS[brand];
    return sharp(src).resize({height: Math.min(height, maxHeight), fit: "inside"}).png().toBuffer();
}

function save(image, name) {
    return image.jpeg({quality: 82, mozjpeg: true}).toFile(`${OUT_DIR}/${name}.jpg`)
        .then((info) => console.log(`${OUT_DIR}/${name}.jpg  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`));
}

/** Horizontal fade from the background colour (left) to transparent (right). */
function fade(width, height) {
    return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="${BACKGROUND}" stop-opacity="1"/>
            <stop offset="1" stop-color="${BACKGROUND}" stop-opacity="0"/>
        </linearGradient></defs>
        <rect width="100%" height="100%" fill="url(#f)"/></svg>`);
}

/** Logo on a dark panel at the left, the page photo on the right, blended at the seam. */
async function pageImage(name, {brand, photo: src, position}) {
    const photoWidth = WIDTH - PHOTO_LEFT;
    const logoBuffer = await logo(brand, 400);
    const {width: logoWidth, height: logoHeight} = await sharp(logoBuffer).metadata();
    const image = sharp({create: {width: WIDTH, height: HEIGHT, channels: 3, background: BACKGROUND}}).composite([
        {input: await photo(src, photoWidth, HEIGHT, position), left: PHOTO_LEFT, top: 0},
        {input: fade(PANEL_WIDTH - PHOTO_LEFT + 160, HEIGHT), left: PHOTO_LEFT, top: 0},
        {input: logoBuffer, left: Math.round((PANEL_WIDTH - logoWidth) / 2), top: Math.round((HEIGHT - logoHeight) / 2)},
    ]);
    await save(image, name);
}

/** Brand-choice landing page: both halves, as on the page itself. */
async function landingImage() {
    const half = WIDTH / 2;
    const [left, right, leftLogo, rightLogo] = await Promise.all([
        photo("public/design/index-tiffany.webp", half, HEIGHT, "centre"),
        photo("public/design/index-olomuveg.webp", half, HEIGHT, "centre"),
        logo("tiffanystudio", 300),
        logo("glassartista", 230),
    ]);
    const [leftMeta, rightMeta] = await Promise.all([sharp(leftLogo).metadata(), sharp(rightLogo).metadata()]);
    const image = sharp({create: {width: WIDTH, height: HEIGHT, channels: 3, background: "#111111"}}).composite([
        {input: left, left: 0, top: 0},
        {input: right, left: half, top: 0},
        {input: gradient(half, HEIGHT, "right"), left: 0, top: 0},
        {input: gradient(half, HEIGHT, "left"), left: half, top: 0},
        {input: leftLogo, left: Math.round((half - leftMeta.width) / 2), top: Math.round((HEIGHT - leftMeta.height) / 2)},
        {input: rightLogo, left: half + Math.round((half - rightMeta.width) / 2), top: Math.round((HEIGHT - rightMeta.height) / 2)},
    ]);
    await save(image, "glassartista-landing");
}

mkdirSync(OUT_DIR, {recursive: true});
await landingImage();
for (const [name, config] of Object.entries(IMAGES)) {
    await pageImage(name, config);
}
