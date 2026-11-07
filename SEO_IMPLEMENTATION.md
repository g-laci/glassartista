# SEO implementation

Technical SEO of the GlassArtista / Magnolia Tiffany Studio website: architecture, configuration and
operations. Content and keyword proposals live separately in `SEO_RECOMMENDATIONS.md`.

## 1. Domains, brands and locales

| Domain (canonical origin) | Brand | Locales served | URL scheme |
|---|---|---|---|
| `https://www.glassartista.com` | GlassArtista (architectural glass) + brand-choice landing page | de (default), hu, en | `/`, `/hu/…`, `/en/…` |
| `https://www.tiffanystudio.at` | Magnolia Tiffany Studio | de (default), en | `/`, `/en/…` |
| `https://www.tiffanystudio.hu` | Magnólia Tiffanystúdió | hu (default) | `/` |

- The `www.` host is canonical. Vercel redirects the apex domains to `www`. Set that redirect to **308**
  in the Vercel domain settings (manual task).
- The German content is written once (`hreflang="de"`, `og:locale` `de_AT`) and serves both Austria
  and Germany. Austria is reinforced by the `.at` domain and the Achenkirch address.
- English Tiffany Studio pages live on `tiffanystudio.at/en`.
- **Language buttons are configured separately from the locale routing** (`flagLocales` in
  `app/lib/i18n.js`). `tiffanystudio.at` deliberately shows **no Hungarian button**.
  `tiffanystudio.hu` shows all three, with DE and EN linking to `tiffanystudio.at`. Don't derive one
  from the other.

### Pages

| Brand | Page key | Public path |
|---|---|---|
| GlassArtista | landing | `/` (brand choice) |
| GlassArtista | home | `/home` |
| GlassArtista | gallery | `/gallery` |
| GlassArtista | details | `/details` |
| GlassArtista | contact | `/contact` |
| Tiffany Studio | home | `/` |
| Tiffany Studio | tiffanylamps | `/tiffanylamps` |
| Tiffany Studio | available | `/tiffanylampsavailable` |
| Tiffany Studio | contact | `/contact` |

That gives 27 indexable URLs: 15 on glassartista.com, 8 on tiffanystudio.at and 4 on tiffanystudio.hu.
Section anchors (`/gallery#dome`, `/tiffanylamps#peony`, …) are parts of those pages, not separate URLs.

## 2. Architecture

```
request ─► middleware.js ─┬─ 301 to the canonical URL (legacy / duplicate URLs)
                          ├─ rewrite /robots.txt, /sitemap.xml  → /{site}/robots.txt, /{site}/sitemap.xml
                          ├─ rewrite /<indexnow-key>.txt        → /api/indexnow-key
                          └─ rewrite page                        → /{site}/{locale}/…   (app/[host]/[lang]/…)
```

- **`app/lib/i18n.js`**: the single source of truth for sites, locales, language buttons and URL
  building (`localizePath`, `brandUrl`, `brandHref`). It's shared by the middleware and by server and
  client components.
- **`app/[host]/[lang]/…`**: `host` is the site key (`glassartista.com`, `tiffanystudio.at`,
  `tiffanystudio.hu`). Every valid host × locale combination is **prerendered at build time**
  (`generateStaticParams`, `dynamicParams = false`) and served from Vercel's CDN.
  Previously every page was rendered per request in `iad1`.
- **Brand guards**: `(glassartista)/layout.js` and `tiffanystudio/layout.js` return 404 when reached
  on the other brand's domain.
- **Development**: `localhost` behaves as glassartista.com. `at.localhost:3000` and `hu.localhost:3000`
  emulate the studio domains (`*.localhost` resolves to 127.0.0.1 in browsers). Links that go to
  another domain point to production.
- **`vercel.json`** pins serverless functions (contact API, IndexNow key route, 404 catch-all) to `fra1`
  (Frankfurt).

### Redirects (all 301, single hop)

| From | To |
|---|---|
| `glassartista.com/de/…` | `glassartista.com/…` |
| `glassartista.com/[hu\|en/]tiffanystudio/…` | the studio page on its canonical domain |
| `tiffanystudio.*/[locale/]home\|gallery\|details` | the same page on glassartista.com |
| `tiffanystudio.*/tiffanystudio/…` | the same page without the prefix |
| `tiffanystudio.at/hu/…` | `tiffanystudio.hu/…` |
| `tiffanystudio.at/de/…` | `tiffanystudio.at/…` |
| `tiffanystudio.hu/de/…` | `tiffanystudio.at/…` |
| `tiffanystudio.hu/en/…` | `tiffanystudio.at/en/…` |
| `tiffanystudio.hu/hu/…` | `tiffanystudio.hu/…` |
| trailing slash (`/home/`) | `/home` (308, Next.js default) |

There are no language or IP-based redirects; every version is reachable by every crawler.

### Status codes

- Unknown paths return **404** with `noindex`, including `/anything.txt` (it used to return the landing
  page with 200).
- `/robots.txt`, `/sitemap.xml` and `/favicon.ico` are real files (they used to be HTML pages with 200).
- No 410 is needed: no content has been removed.
- Pagination: not applicable.

### Non-production hosts

Any host other than the three production domains (`*.vercel.app`, previews, localhost) gets
`X-Robots-Tag: noindex, nofollow`. Its robots.txt stays permissive so crawlers can see that header.

## 3. Metadata

Implemented in `app/lib/seo.js` (`buildPageMetadata`). Texts are in `app/content/seo.js`.

Every page has:
- A unique localized `<title>` and meta description.
- A self-referencing absolute canonical.
- An hreflang set: hu, de, en and x-default (= en), the same on every member of the set.
- Robots `index, follow, max-image-preview:large`.
- Open Graph tags: type, url, site_name, title, description, locale + alternates, and an image
  (1200×630 JPEG with dimensions, alt and type).
- `twitter:card=summary_large_image` with title, description and image.
- `<html lang>` = the page's locale.

The site-level layout (`app/[host]/[lang]/layout.js`) sets `metadataBase`, `applicationName`, the robots
defaults and the favicon.

A domain root is written as `https://www.tiffanystudio.at` (no trailing slash), matching how Next.js
renders canonical and hreflang. Sitemap and JSON-LD use the same form.

### Share images

`public/og/*.jpg`: one per page (language-neutral), 50–140 KB. They're generated from the site's own
photos and logos by `npm run seo:og-images` (`scripts/generate-og-images.mjs`, using the `sharp` that
ships with Next.js). To change a photo, edit `IMAGES` in the script and re-run it.

## 4. Crawlable navigation

- All navigation is real `<a href>` links in the prerendered HTML:
  - Navbar entries and dropdown labels (HeroUI `Button as={Link}`).
  - Dropdown items (HeroUI `href`, routed client-side through `HeroUIProvider navigate`).
  - Landing buttons.
  - The "back" arrow.
- Language switching uses the footer flags, which are `<a href hreflang>` links to the equivalent
  page. On click they still keep the current section hash and query, as before.
- The mobile dropdown flags behave as before (JavaScript only); the footer provides the crawlable
  equivalents on every page.
- Each page has one `<h1>`.
  - Where the design has no visible page title, the heading is visually hidden (`sr-only`) and holds
    the existing navigation label and brand, e.g. "Munkáink – GlassArtista".
  - On the GlassArtista home page the logo image is the heading.
  - On the available-lamps page the group titles became `<h2>`.
- Image alt text comes from existing visible titles. Untitled slides inherit the last title in their
  section (`app/lib/altText.js`); available lamps use the lamp name; flags use the language name.

## 5. Structured data (JSON-LD)

Implemented by `buildPageJsonLd` in `app/lib/seo.js`, rendered with `app/components/seo/JsonLd.js`. Each
page has one `@graph` containing:

| Node | Content |
|---|---|
| `LocalBusiness` | The brand at the location shown on the page's contact details: Hungarian pages → Miskolc, János utca 23.; German and English pages → Achenkirch, Sagbichl 494C. Also: name (+ alternateName), url, logo, image, email, telephone, address, areaServed, contactPoint for each phone, founder, sameAs (social profiles). |
| `Person` | Eszter Nyíri, the owner; one `@id` shared across all domains. |
| `WebSite` | Per domain, with its languages and publisher. |
| `WebPage` / `CollectionPage` / `ContactPage` | url = canonical, name, description, inLanguage, primaryImageOfPage, breadcrumb. |
| `BreadcrumbList` | Brand root → page, on every non-root page. |
| `ItemList` of `VisualArtwork` | Gallery, Tiffany lamps and available lamps: name, image, creator. |

- Business facts come from `LOCATIONS` / `OWNER` in `app/content/site.js`, which must stay in sync with
  `app/content/contact.js`.
- Nothing is invented: there are no ratings, prices, opening hours or geo-coordinates.
- `Product` isn't used, because the site shows no prices or offers and so wouldn't qualify for Product
  rich results.

## 6. robots.txt and sitemaps

| Domain | robots.txt | Sitemap |
|---|---|---|
| glassartista.com | `https://www.glassartista.com/robots.txt` | `https://www.glassartista.com/sitemap.xml` (15 URLs, 222 images) |
| tiffanystudio.at | `https://www.tiffanystudio.at/robots.txt` | `https://www.tiffanystudio.at/sitemap.xml` (8 URLs, 272 images) |
| tiffanystudio.hu | `https://www.tiffanystudio.hu/robots.txt` | `https://www.tiffanystudio.hu/sitemap.xml` (4 URLs, 136 images) |

- robots.txt: `Allow: /`, `Disallow: /api/`, and a `Sitemap:` line pointing to the domain's own sitemap.
- Each sitemap lists only the canonical, indexable URLs of its own domain.
- Each entry carries `xhtml:link` hreflang alternates (cross-domain, which is allowed because all
  domains are verified in Search Console) and `image:image` entries.
- One sitemap per domain is enough, so there's no sitemap index.
- **`<lastmod>`** is the last git commit date of the page's content files (`contentFiles` in
  `app/content/seo.js`), stored in `app/content/lastmod.json`.
  - `npm run seo:lastmod` refreshes it; it also runs as `prebuild`.
  - In shallow clones (Vercel) it keeps the committed file unchanged.
  - **After committing content changes, run `npm run seo:lastmod` and commit the JSON.**
  - The current dates are all 2026-11-07, because that commit touched every content file.

## 7. IndexNow (Bing, Copilot, Yandex, Seznam, Naver)

- Key: `INDEXNOW_KEY`, 32 hex characters. It's generated into the local `.env` (git-ignored).
  **Add the same variable to the Vercel project (Production) and redeploy.**
- Verification file: `https://www.<domain>/<key>.txt` on all three domains (middleware →
  `app/api/indexnow-key`). It answers only for the configured key. IndexNow requires this file to be
  public; the key never enters the client bundle or git.
- Submission: `npm run indexnow` after a production deployment.
  - It reads the live sitemaps and submits only new URLs, URLs whose `lastmod` changed, and removed
    URLs, per domain.
  - It remembers what it sent in `.indexnow-state.json` (git-ignored).
  - `--dry-run` previews; `--all` submits everything (use it once, on first setup).
- Google doesn't use IndexNow; it relies on the sitemaps in Search Console.

## 8. Analytics and measurement

| Item | State |
|---|---|
| Vercel Web Analytics | Installed (`@vercel/analytics`). Cookieless, so no consent banner is needed for it. |
| Google Analytics 4 | Not installed. Not added: it would need a consent banner (GDPR/TTDSG) and your approval. |
| Google Search Console | All three domains verified (DNS). No meta tag needed. |
| Bing Webmaster Tools | Not verified. Import the sites from Search Console (manual task). |
| Consent management | None. Not needed for the current setup, except reCAPTCHA on the contact form, which should be disclosed in the privacy policy (see recommendations). |
| Conversion tracking | None. Contact-form submissions could be tracked as a Vercel Analytics custom event (needs approval). |

## 9. Validation

- `npm run seo:audit` (`scripts/seo-audit.mjs`) checks all three domains and every locale:
  - Against a local production server, emulating each domain via the `Host` header:
    `npm run build && npm start`, then `npm run seo:audit -- --base http://localhost:3000`.
  - Or against production: `npm run seo:audit -- --live`.
  - Checks: robots.txt, sitemaps (format, own-domain URLs, lastmod), status codes, titles and
    descriptions (present, unique, length), canonical, robots meta, `<html lang>`, hreflang (self,
    x-default, reciprocity, sitemap = HTML), OG and Twitter tags, OG image responses, JSON-LD (valid,
    required types, url = canonical), `<h1>`, image alt attributes, internal link targets (no 4xx, no
    redirects), the legacy redirects and 404s.
  - It exits with code 1 on any error.
- Result on 2026-11-07 (local production build): **27 pages, 0 errors, 0 warnings**. Also passing:
  `next build` and ESLint.
- External validators to run after deployment (manual): Google Rich Results Test, Schema.org Validator,
  Facebook Sharing Debugger, LinkedIn Post Inspector.

## 10. Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `INDEXNOW_KEY` | `.env` + Vercel (server) | IndexNow key (new) |
| `SMTP_USER_*`, `SMTP_PASS_*`, `SMTP_HOST` | `.env` + Vercel | contact form (unchanged) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | `.env` + Vercel | contact form (unchanged) |

## 11. Known limitations

- **The 404 page** is Next.js' built-in "This page could not be found" page, as it was before; the
  localized `not-found.js` isn't picked up for the catch-all route. Status 404 and `noindex` are correct.
  It also carries a second, layout-level `robots` meta tag (`index, follow`); search engines apply the
  most restrictive one, and the 404 status already excludes the page.
- **Section content is one URL per page.** Individual lamps and projects (`#peony`, `#dome`) can't rank
  as separate pages; see the recommendations for dedicated lamp pages.
- **The share images are language-neutral** (logo + photo, no text), so one image serves all locales.
- **The mobile dropdown flags** switch language via JavaScript; the crawlable language links are the
  footer flags (hidden on small screens except on the landing page, but present in the HTML).
- **Dev mode:** links to another domain point to production.
