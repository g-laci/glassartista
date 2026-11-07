const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            height: {
                // Generates the responsive variants (e.g. `lg:h-screen-minus-navbar-desktop`, 80px).
                // The unprefixed class is overridden by the unlayered rule in globals.css (64px).
                'screen-minus-navbar-desktop': 'calc(100vh - 80px)',
            },
        },
    },
    // NOTE: this compiles `dark:` utilities to `:is(class *)`, which never matches, so every
    // `dark:` class (ours and HeroUI's) is inert. The site's current look depends on that;
    // changing it to "class" would switch them all on and alter the design.
    darkMode: ["class", "class"],
    plugins: [heroui()],
};
