# GlassArtista & Magnolia Tiffany Studio

A multilingual Next.js website showcasing architectural decorative glass works and handcrafted Tiffany lamps.

## Overview

This project presents two distinct brands:

- **GlassArtista** - Architectural and interior decorative glass works including stained-glass domes, glass canopies, entrance doors, skylights, and modern glass windows
- **Magnolia Tiffany Studio** - Handcrafted Tiffany lamps based on original Louis Comfort Tiffany designs

## Features

- **Multilingual Support**: Available in Hungarian (hu), German (de), and English (en)
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Interactive Animations**: Smooth scrolling effects and carousel presentations using Framer Motion
- **Contact Form**: Integrated contact form with reCAPTCHA validation
- **Modern UI**: Built with Hero UI (NextUI) and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19
- **UI Library**: Hero UI, React Icons, Tabler Icons
- **Styling**: Tailwind CSS 4, Animate.css, `next/font`
- **Animations**: Framer Motion
- **Forms**: Hero UI form components, reCAPTCHA, Nodemailer (API route)
- **Language**: JavaScript (React)

## Development

```bash
npm install
npm run dev     # development server
npm run lint    # ESLint (next/core-web-vitals)
npm run build   # production build (also runs lint)
```

Environment variables (`.env`): `SMTP_USER_GLASSARTISTA`, `SMTP_PASS_GLASSARTISTA`,
`SMTP_USER_TIFFANYSTUDIO`, `SMTP_PASS_TIFFANYSTUDIO` (Gmail app passwords, server only),
`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `INDEXNOW_KEY` (server only).

SEO tooling: `npm run seo:audit` (checks all domains against a running production server),
`npm run seo:lastmod`, `npm run seo:og-images`, `npm run indexnow` (after deployments).

## Project Structure
```
middleware.js                        # Domain + locale routing, canonical 301 redirects (see app/lib/i18n.js)
app/
├── [host]/                          # Site key set by the middleware (glassartista.com, tiffanystudio.at/.hu)
│   ├── robots.txt/, sitemap.xml/    # Per-domain robots.txt and sitemap (static)
│   └── [lang]/                      # Locale; layout.js is the root layout (<html lang>, fonts, footer)
│       ├── page.js                  # Landing page with dual brand selection (glassartista.com only)
│       ├── (glassartista)/          # GlassArtista section (home, gallery, details, contact)
│       ├── tiffanystudio/           # Tiffany Studio section (home, tiffanylamps, tiffanylampsavailable, contact)
│       ├── [...rest]/ + not-found.js# 404
│       └── */page.js                # Server components: metadata + JSON-LD, pick the locale's content, render a client *View
├── api/contact/route.js             # Contact form handler (validation + e-mail)
├── api/indexnow-key/route.js        # IndexNow key file (/<key>.txt)
├── components/                      # carousel/, sections/, navigation/, contact/, seo/, Navbar*.js, Footer.js
├── content/                         # Page texts and image lists per locale; seo.js = titles/descriptions
└── lib/                             # i18n.js (sites, locales, URLs), seo.js (metadata, JSON-LD), fonts
scripts/                             # seo-audit, seo-lastmod, generate-og-images, indexnow
```

### Domains and locales

`app/lib/i18n.js` holds the per-domain configuration (`SITES`). `www.glassartista.com` serves GlassArtista
(de at the root, `/hu`, `/en`); `www.tiffanystudio.at` serves the studio in German (root) and English (`/en`);
`www.tiffanystudio.hu` serves the studio in Hungarian. Every page is prerendered per domain. See
`SEO_IMPLEMENTATION.md` for URLs, redirects, metadata, sitemaps and IndexNow, and `SEO_RECOMMENDATIONS.md`
for content proposals.

For local development, `localhost:3000` behaves as glassartista.com; `at.localhost:3000` and
`hu.localhost:3000` emulate the studio domains.

## Available Languages

- `hu` - Hungarian (Magyar)
- `de` - German (Deutsch) - default on tiffanystudio.at and glassartista.com (`hu` on tiffanystudio.hu)
- `en` - English

## Key Pages

- `glassartista.com/` - Landing page with brand selection
- `glassartista.com/home`, `/gallery`, `/details`, `/contact` - GlassArtista pages
- `tiffanystudio.at/`, `tiffanystudio.hu/` - Tiffany Studio showcase with interactive scroll
- `/tiffanylamps`, `/tiffanylampsavailable`, `/contact` - Tiffany Studio pages

## Contact Information

- **Email**: info@glassartista.com
- **Instagram**: [@glassartista\_h](https://www.instagram.com/glassartista_h)
- **Facebook**: [GlassArtista](https://www.facebook.com/glassartistah)
- **YouTube**: [@GlassArtista](https://www.youtube.com/@GlassArtista)

## License

© 2025 GlassArtista. All rights reserved.