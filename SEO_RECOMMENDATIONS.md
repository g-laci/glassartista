# SEO recommendations

Proposals that change **visible content** or need **external accounts**. None of this has been
implemented; each item needs your approval. The technical implementation is documented in
`SEO_IMPLEMENTATION.md`.

> **About the keyword data.** No paid keyword tool was used, so there are **no search-volume figures**
> here. The keyword lists come from how people in each market name these products and services. Check
> them in Google Search Console (Performance → Queries, about 4 weeks after launch) and in Google Ads
> Keyword Planner (free with an Ads account) before writing new pages.

## 1. Priority fixes to existing copy (small, high value)

| # | Where | Current | Proposed | Why |
|---|---|---|---|---|
| 1 | HU studio text, DE studio text (`studio.js`) | "Louis **de** Comfort Tiffany" | "Louis Comfort Tiffany" | The correct name; it's also what people search for. |
| 2 | DE landing (`landing.js` p1) | "**Die** Magnolia Tiffany Studio beschäftigt sich…" | "**Das** Magnolia Tiffany Studio fertigt seit über 20 Jahren Tiffany-Lampen…" | Grammar ("das Studio"). |
| 3 | DE nav `engineeringDesign` | "Ingenieure Planung" | "Ingenieurplanung" (or "Technische Planung", which matches the home page) | Grammar. |
| 4 | DE nav `leadRailTechnology` | "Bleisglas-Technologie" | "Bleiverglasung" | Typo, and "Bleiverglasung" is the established craft term. |
| 5 | DE nav / home `installation` | "Installierung" | "Montage" / "Einbau" | "Installierung" is unidiomatic. |
| 6 | DE nav `availableStanding` | "Bestellbare Stehende Tiffany-Lampen" | "Bestellbare Tiffany-Stehlampen" | "Stehlampe" is the word people search for. |
| 7 | DE nav `landing` / tooltip | "Landingpage" | "Startseite" | Natural German. |
| 8 | EN nav tooltips | "Follow on us Instagram!", "Follow on me Facebook!" | "Follow us on Instagram!", "Follow us on Facebook!" | Grammar. |
| 9 | DE contact form | mixes "du" ("Bitte gib deinen Namen an!") and "Sie" | use "Sie" throughout: "Bitte geben Sie Ihren Namen an!" | Consistent formal address. |
| 10 | Footer | "2022-2025" | "2022–2026", or computed from the current year | It's out of date. |
| 11 | Footer (HU) vs. everywhere else | "Magnólia Tiffanystud**i**ó" | "Magnólia Tiffanystúdió" | **The brand name must be spelled identically** everywhere (site, Google Business Profile, social profiles). Search engines and maps match businesses by name. |
| 12 | DE/EN landing p1 | describes only lamps | add one sentence on restoration, as in the HU text: "Außerdem restaurieren wir alte Bleiglasfenster und Tiffany-Lampen." | The DE/EN pages leave out a service the HU page mentions. |

## 2. Keywords by market and page

The terms are local and not translated one-to-one. People search differently in each country.

### Hungary (tiffanystudio.hu, glassartista.com/hu)

| Page | Main keyword | Supporting / long-tail |
|---|---|---|
| Studio home | tiffany lámpa | tiffany lámpa készítés, tiffany stúdió Miskolc, tiffany lámpa javítás / restaurálás, egyedi tiffany lámpa |
| Tiffany lamps | tiffany lámpák | magnolia tiffany lámpa, szitakötős tiffany lámpa ("Dragonfly" in Hungarian), pünkösdi rózsás (peony) tiffany lámpa, tündérrózsás (waterlily) tiffany lámpa |
| Available lamps | tiffany lámpa rendelés | asztali tiffany lámpa, álló tiffany lámpa, tiffany állólámpa, tiffany lámpa ár |
| GA home | ólomüveg | ólomüveg ablak készítés, díszüveg, ólomüveg bejárati ajtó, ólomüveg restaurálás |
| GA gallery | ólomüveg kupola | ólomüveg mennyezet, díszüveg előtető, templomi ólomüveg ablak, fazettázott üveg |
| GA details | ólomüveg technika | ólomsínes technika, katedrálüveg, Lamberts üveg |

Notes:
- "ólomüveg" is far more common in searches than "építészeti díszüveg"; it already appears in the
  metadata.
- Local intent ("Miskolc", "Diósgyőr", "Borsod") favours a Google Business Profile (§4).
- "szitakötő" and "pünkösdi rózsa" are the Hungarian names for Dragonfly and Peony. Mentioning them
  next to the English model names would catch Hungarian searches.

### Austria and Germany (tiffanystudio.at, glassartista.com)

| Page | Main keyword | Supporting / long-tail |
|---|---|---|
| Studio home | Tiffany Lampe | Tiffany Lampen Manufaktur, Tiffany Lampe handgefertigt, Tiffany Lampe restaurieren / reparieren, Tiffany Studio Tirol |
| Tiffany lamps | Tiffany Lampen | Libellen Tiffany Lampe, Magnolien Tiffany Lampe, Tiffany Lampe Pfingstrose, Seerosen Tiffany Lampe |
| Available lamps | Tiffany Lampe kaufen | Tiffany Tischlampe, Tiffany Stehlampe, Tiffany Lampe groß, Tiffany Lampe Original Reproduktion |
| GA home | Bleiglas | Bleiglasfenster, Bleiverglasung, Glaskunst, Kunstverglasung nach Maß |
| GA gallery | Bleiglaskuppel | Glaskuppel, Glasvordach, Bleiglas Haustür, Kirchenfenster |
| GA details | Bleiverglasung | Bleiglas Technik, mundgeblasenes Glas, Lamberts Glas |
| Restoration (missing page) | Bleiglasfenster restaurieren | Kirchenfenster Restaurierung, Bleiglas Reparatur |

Notes:
- Austrians use "Bleiglas" and "Glaskunst"; Germans additionally use "Glasmalerei" (strictly, painted
  glass) and "Tiffany-Technik". Use both naturally; there's no need for separate pages.
- The German lamp names are currently a mix of German and English ("Peony Tiffany Lampe",
  "Tulip Tiffany Lampe"). Germans search mostly for the **German** motif names, so use "Pfingstrosen
  Tiffany-Lampe (Peony)" and "Tulpen Tiffany-Lampe (Tulip)".
- The phone number (+49) and the Achenkirch address near the Bavarian border support "Tiffany Lampe
  Bayern / München" searches, but only mention regions the studio actually serves (e.g. delivery or
  installation in Bavaria), and only if true.

### English (tiffanystudio.at/en, glassartista.com/en)

| Page | Main keyword | Supporting |
|---|---|---|
| Studio home | handmade Tiffany lamps | Tiffany lamp reproduction, Tiffany lamp restoration Europe |
| Tiffany lamps | Tiffany lamps | Dragonfly Tiffany lamp, Magnolia Tiffany lamp, Peony Tiffany lamp, Waterlily Tiffany lamp |
| Available lamps | Tiffany lamps for sale | Tiffany table lamp, Tiffany floor lamp |
| GA home | bespoke stained glass | architectural stained glass, leaded glass windows |
| GA gallery | stained glass dome | stained glass canopy, leaded glass entrance door, church stained glass |

Note: the English home page uses "Lead-glass domes"; people search for "stained glass dome" or
"leaded glass dome".

### Keyword cannibalisation

- **Landing page vs. GlassArtista home** (glassartista.com `/` and `/home`). Both describe the
  architectural-glass offer with nearly the same paragraph (landing p2 = home p1–p3). The metadata now
  separates them (landing = brand choice, home = "Bleiglas nach Maß"). Rewriting landing p2 to a short
  teaser, so `/home` is the single strong page for "Bleiglas / ólomüveg", would separate them further.
- **Studio home vs. Tiffany lamps page.** Fine: the home page targets the studio and craft, the lamps
  page targets the models.

## 3. Missing landing pages (content gaps)

In priority order. Each needs real text and photos from you; nothing should be invented. Each also
needs adding to `PAGES` in `app/content/seo.js` (metadata, sitemap, hreflang) and to the navigation.

1. **One page per Tiffany lamp model** (`/tiffanylamps/magnolia`, `/tiffanylamps/dragonfly`, …).
   - The text already exists (one section per lamp). As separate URLs, each lamp can rank for its own
     model search ("Dragonfly Tiffany Lampe", "magnolia tiffany lámpa"), have its own share image, and
     appear in Google Images with a matching page.
   - The single biggest opportunity.
2. **Restoration / repair**: "Restaurierung von Tiffany-Lampen und Bleiglasfenstern" /
   "Tiffany lámpák és ólomüveg ablakok restaurálása".
   - It's mentioned in several places, but no page targets it.
   - High-intent searches with little competition.
3. **Lamp bases** (`/lampbases`). There's a disabled "Lampenfüße / Lámpatalpak" menu entry. Either build
   the page (bronze bases are a frequent search) or remove the menu entry.
4. **About / the artist**: Eszter Nyíri, experience since 2005 / 20+ years, the workshops in Miskolc and
   Achenkirch, photos of the studio. Strong trust (E-E-A-T) signal; also the natural target for
   press links.
5. **Individual project pages** for the large GlassArtista works (dome, canopy, entrance portal): size,
   year, client type, technique. Facts like these (10.5 m², 1820 glass pieces, 144 crystals) already
   exist in the gallery text and make excellent case studies.
6. **FAQ**, e.g.:
   - Wie lange dauert eine Tiffany-Lampe?
   - Wird international geliefert?
   - Wie pflege ich Bleiglas?

   Only if you have real answers. A FAQ section no longer gets rich results, but it does answer
   long-tail searches.
7. **Impressum** (AT) and **Datenschutzerklärung / Adatvédelmi tájékoztató / Privacy policy**:
   - Legally required for the Austrian site (ECG §5, MedienG §25) and under GDPR (contact form,
     reCAPTCHA, Vercel Analytics).
   - Also a trust signal. **Highest priority, but it needs your legal details** (legal form, UID
     number if any, chamber membership).

## 4. Local SEO

- **Google Business Profile.** Create or claim **two profiles**, one per location (no listings have
  been created or changed):
  - Miskolc: "Magnólia Tiffanystúdió". Category "Glass artist" / "Üvegművész", secondary "Lamp shop".
  - Achenkirch: "Magnolia Tiffany Studio". Same categories; add "Glasmaler" if available.
  - For each: website = the matching domain; exactly the address and phone shown on the site; photos
    of the workshop and work; a services list (Tiffany lamps, stained glass windows, restoration).
  - If GlassArtista should have its own profile, it needs a distinct customer-facing location or a
    service-area profile; don't create duplicate profiles at the same address.
- **NAP consistency.** Name, address and phone must match character for character across the site,
  the profiles, Facebook, Instagram and directories. Note the "Tiffanystudió / Tiffanystúdió" spelling
  issue in §1.
- **Reviews.** Ask satisfied customers for Google reviews. Never put reviews or ratings into the site's
  structured data unless they're shown on the site and collected there.
- **Directories:**
  - Hungary: Cylex, Arany Oldalak, Firmania.
  - Austria: Herold.at, WKO Firmen A–Z (if a chamber member), Cylex.at.
  - Germany: Gelbe Seiten, Das Örtliche (only if there's a German business presence).
- **Bing Places.** Import from Google Business Profile once it exists.

## 5. Competitor research

Search incognito, in each country's Google (google.hu / google.at / google.de) and in each language,
for the main keywords in §2. Note:
- Which pages rank (product page, category, blog?).
- Their title patterns.
- Whether they show prices.
- Image results.
- Whether they appear in the map pack.

Likely competitor types:
- Hungarian üvegművész and ólomüveg workshops.
- Austrian and German Glasmalerei / Kunstglaserei businesses.
- Large Tiffany lamp retailers selling mass-produced lamps; differentiate on handwork and original
  designs.

## 6. Backlink opportunities

- Architects and interior designers you've worked with: a credit link from their project pages.
- Churches and parishes whose windows you restored: often mentioned in parish newsletters and websites.
- Local press: Miskolc (minap.hu, boon.hu), Tirol (Tiroler Tageszeitung, Bezirksblätter Schwaz) for
  feature stories on the craft.
- Tourism: Achenkirch / Achensee tourism portal (craft workshops, studio visits).
- Glass suppliers named in the content (Glashütte Lamberts, Uroboros, Youghiogheny, Bullseye): some
  publish customer showcases.
- Craft associations: Hungarian glass art societies, the Austrian Glaser guild, Tiffany-glass forums
  and communities.
- YouTube: the GlassArtista channel exists. Link videos to the matching pages and add the site URL to
  video descriptions.
- Cross-links between the brands already exist (landing ↔ studio). No link exchanges or paid links.

## 7. Performance follow-ups (no visual change, not yet implemented)

- **Videos.** All slide videos use `preload="auto"`. Using `preload="metadata"` for slides outside the
  first section would save bandwidth. It needs a visual check, because the slide previews rely on the
  first frame.
- **Full-screen viewer.** It loads the original files unoptimized: church window photos are 4–5 MB
  (59 source files are over 1 MB). Re-export the originals at about 2560 px / quality 85 (about 0.5–1
  MB each) and keep the magnifier.
- **Fonts.** 12 font files are preloaded, including Montserrat and Inter italics. Check whether the
  italics are used; dropping them saves 4 requests on every page.
- **Landing page backgrounds** are CSS `background-image`, so they aren't optimized and are found late
  for LCP. Switching them to `next/image` with `priority` would improve LCP but changes markup; test it
  visually.
- **Favicons.** Add `apple-touch-icon` (180×180) and brand-specific favicons per domain (currently one
  favicon for both brands).

## 8. Measurement (needs approval)

- **Conversions.** Track successful contact-form submissions as a Vercel Analytics custom event
  (cookieless, no banner needed).
- **GA4.** Only with a consent banner (e.g. Klaro or CookieConsent) and consent mode. Not recommended
  unless you need GA4-specific reports; Search Console + Vercel Analytics cover the essentials.
- **reCAPTCHA** loads Google scripts on the contact pages. Disclose it in the privacy policy, or
  consider a privacy-friendlier alternative (Cloudflare Turnstile, Friendly Captcha).
