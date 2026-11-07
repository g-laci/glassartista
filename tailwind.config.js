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
    darkMode: "class", // <html> carries the "dark" class
    plugins: [heroui()],
};
