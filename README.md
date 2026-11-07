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
`SMTP_USER_TIFFANYSTUDIO`, `SMTP_PASS_TIFFANYSTUDIO` (Gmail app passwords, server only) and
`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.

## Project Structure
```
middleware.js                        # Domain + locale routing (see app/lib/i18n.js)
app/
├── [lang]/                          # Locale segment; layout.js is the root layout (<html lang>, fonts, footer)
│   ├── page.js                      # Landing page with dual brand selection
│   ├── (glassartista)/              # GlassArtista section (home, gallery, details, contact)
│   ├── tiffanystudio/               # Tiffany Studio section (home, tiffanylamps, tiffanylampsavailable, contact)
│   ├── [...rest]/ + not-found.js    # Localized 404
│   └── */page.js                    # Server components: pick the locale's content, render a client *View
├── api/contact/route.js             # Contact form handler (validation + e-mail)
├── components/
│   ├── carousel/                    # Image/text carousels, full-screen viewer, magnifier lens
│   ├── sections/                    # Full-screen section paging (gallery, details, Tiffany lamps)
│   ├── navigation/                  # Shared navbar parts, locale switching helpers
│   ├── contact/                     # Contact page layout and form
│   └── Navbar*.js, Footer.js, Providers.js
├── content/                         # All page texts and image lists, per locale (hu/de/en)
└── lib/                             # i18n + host config, site context (host/locale), fonts
```

### Domains and locales

`app/lib/i18n.js` holds the per-domain configuration. `tiffanystudio.at` / `tiffanystudio.hu` serve the
Tiffany Studio pages at the root (`/contact`, `/tiffanylamps`, …); `glassartista.com` serves the
GlassArtista site. Each domain's default locale is served without a URL prefix; other locales use
`/{locale}/…`. The request host is resolved on the server and shared with client components through
`useSite()`.

## Available Languages

- `hu` - Hungarian (Magyar)
- `de` - German (Deutsch) - default on tiffanystudio.at and glassartista.com (`hu` on tiffanystudio.hu)
- `en` - English

## Key Pages

- `/[lang]` - Landing page with brand selection
- `/[lang]/home` - GlassArtista information page
- `/[lang]/contact` - Contact form
- `/[lang]/tiffanystudio` - Tiffany Studio showcase with interactive scroll

## Contact Information

- **Email**: info@glassartista.com
- **Instagram**: [@glassartista\_h](https://www.instagram.com/glassartista_h)
- **Facebook**: [GlassArtista](https://www.facebook.com/glassartistah)
- **YouTube**: [@GlassArtista](https://www.youtube.com/@GlassArtista)

## License

© 2025 GlassArtista. All rights reserved.