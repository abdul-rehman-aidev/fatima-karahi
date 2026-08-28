# Handoff audit — Fatima Karahi website

Build: Next.js 15 App Router, static export. All numbers below are measured
against the actual `out/` build, served with real gzip/brotli compression
(see methodology note under Gate 3).

## Gate 1 — Anti-template audit

*"Could this section appear unchanged on a generic restaurant template?"*
checked against the design system's blacklist (no image-left/text-right grid
blocks, no three-icon feature rows, no generic card grids, no round food-bowl
icons, no chrome-gold/flag-green, no "Welcome to our website" copy).

| Page | Section | Verdict | Why |
|---|---|---|---|
| Home | Hero | Pass | Bilingual Urdu-over-English lockup, orchestrated ≤900ms entrance, no stock hero-with-search-bar pattern |
| Home | Signature rail | Pass | Staggered horizontal rail with alternating card heights + scroll-snap, not a 3-up card grid |
| Home | Story band | Pass | Large editorial pull-quote + overlapping image, not a text/image 50-50 split |
| Home | Catering spotlight | Pass | Asymmetric occasion vignettes (staggered vertical offset), not pricing-tier cards |
| Home | Trust band | Pass | Count-up numerals + single testimonial under a calligraphic divider; explicitly not an icon-feature row |
| Menu | Hero | Pass | Compact, image-scrimmed, not a generic page banner |
| Menu | Category nav | Pass | Sticky nav with a gliding gold underline (scroll-spy), bespoke to the brand |
| Menu | Dish rows | Pass | Editorial list with gold dotted price leaders + Urdu names + spice dots; not a table or icon-tag card grid |
| Menu | Feature dish | Pass | One full-bleed spotlight per category breaks list rhythm |
| Catering | Hero | Pass | Truck-art accent stripe (brand-specific), not a stock banner |
| Catering | Occasions | Pass | Editorial vignettes with varied heights, not pricing-tier boxes |
| Catering | How it works | Pass | Large Fraunces numerals + hairline, explicitly not a 3-icon row |
| Catering | Quote form | Pass | Multi-step with gold progress rail + branded success/error states; not a generic Formspree embed look |
| Contact | Hero + info | Pass | Bilingual, address in Fraunces, no boilerplate "get in touch" copy |
| Contact | Map | Pass | Bespoke emerald/gold map frame with jali texture + pulsing pin; explicitly not a default blue Google iframe |
| Order | Interstitial | Pass | Karahi mark + Urdu on emerald, quiet and branded; not a bare "redirecting…" page |
| Global | Nav | Pass | Condensing transparent→solid, gold order pill, full-screen emerald mobile overlay with large Fraunces links |
| Global | Footer | Pass | Jali texture, calligraphic divider, NAP + gold CTAs; not a 4-column link dump on white |
| Global | Icons | Pass | Near-iconless by design — only the bespoke karahi mark and the WhatsApp glyph exist as icons anywhere |

No section required redesign after the initial build.

## Gate 2 — Lighthouse (mobile, 390×844, simulated throttling)

| Page | Performance | Accessibility | SEO | Best Practices | LCP | CLS |
|---|---|---|---|---|---|---|
| Home | 100 | 100 | 100 | 100 | 1.1s | 0.004 |
| Menu | 100 | 100 | 100 | 100 | 1.3s | 0.006 |
| Catering | 99 | 100 | 100 | 100 | 1.1s | 0.005 |
| Contact | 100 | 100 | 100 | 100 | 1.3s | 0.006 |
| Order | 100 | 100 | 100 | 100 | 1.3s | 0.008 |

All gates (Perf ≥90, A11y ≥95, SEO ≥95, LCP <2.5s, CLS <0.1) **pass** with
comfortable margin.

**Methodology note:** the first audit pass, served via `npx serve`, scored
83-89 with LCP 3.2-3.9s. Root cause: `serve` sends no `Content-Encoding`
header at all — it was transferring raw, uncompressed assets (e.g. a 44KB
CSS file with zero compression) despite the browser requesting gzip/brotli.
That's an artifact of the local dev tool, not the site — every real static
host (Vercel, Netlify, Cloudflare Pages, Nginx) compresses automatically.
`scripts/serve-compressed.mjs` was written to serve the export with real
brotli/gzip so the local numbers are representative of production. Two real
bugs surfaced and were fixed during this pass: the Menu page's hero image was
missing `priority` (lazy-loading an above-the-fold LCP element dragged its
LCP to 3.9s), and `WhatsAppButton`'s inline variant used un-tinted gold text
on ivory backgrounds (2.16:1 contrast, below AA) — see Gate 5.

## Gate 3 — JS budget

**Per-route real transfer (gzip, evergreen browsers — Chrome/Safari/Firefox/
Edge do not fetch the `nomodule`-marked legacy polyfill bundle at all, so it's
excluded, matching what a real visitor or Lighthouse actually downloads):**

| Page | Scripts fetched | Real gzip transfer |
|---|---|---|
| Home | 7 | 109.4 KB |
| Menu | 7 | 109.9 KB |
| Catering | 7 | 114.5 KB |
| Contact | 8 | 112.2 KB |
| Order | 8 | 112.9 KB |

**Result: does not meet the <100KB gate.** Over by 9-15KB (9-15%) on every
route. Root cause, precisely measured: **~103.7KB of every page's transfer is
Next.js App Router's own client hydration runtime** (React + ReactDOM + the
Next router/RSC client) — the `255-*.js` and `4bd1b696-*.js` shared chunks.
This is not page-specific code; it is the fixed cost of choosing Next.js App
Router for any interactivity at all, and it's present, at very close to this
same size, in a default `create-next-app` project with zero custom code.

Everything actually built for this project sits on top of that floor and is
lean: 0.9KB (Home) to 6.6KB (Catering, the heaviest page — it carries the
multi-step quote form). Two bundler alternatives were tried and rejected:
Turbopack production build shipped *more* JS (131KB shared vs. 103KB with
webpack), and a custom `.browserslistrc` intended to shrink the legacy
polyfill bundle instead broke Next's chunk splitting (339KB shared) and was
reverted.

This is the direct, unavoidable consequence of the build directive's
stack override from the originally-recommended Astro (near-zero JS by
default) to Next.js + Tailwind — both were explicit requirements in the same
directive, and they are in tension for any App-Router site with client-side
interactivity (a mobile nav overlay, a multi-step form, scroll-spy, count-up
numerals). Reporting the real number rather than a flattering one because the
gate is stated as hard; the honest path to actually hitting <100KB would be
migrating to Astro's islands architecture, which ships JS only for the
specific interactive components rather than a whole-app hydration runtime.

## Gate 4 — Token discipline

```
raw hex values in .tsx/.ts:        1 (documented, justified — see below)
Tailwind default palette classes:  0
forbidden font names (as usage):   0
```

The one hex value is `themeColor: "#0E2A22"` in `src/app/layout.tsx` — the
`<meta name="theme-color">` tag requires a literal string and cannot
reference a CSS custom property. It's commented in place as `--emerald-deep`'s
value with a note to keep them in sync. Every other color, space, radius,
shadow and type value in the app resolves through the `@theme inline` block
in `globals.css`, which itself resolves only from `design/tokens/`.

## Gate 5 — Accessibility

- **Contrast, computed exactly (WCAG relative-luminance formula), for every
  gold/text pairing actually used in the app:**

  | Pairing | Ratio | AA (4.5:1) |
  |---|---|---|
  | saffron on emerald-deep | 6.36:1 | Pass |
  | saffron on emerald | 5.61:1 | Pass |
  | saffron-bright on emerald-deep | 8.57:1 | Pass |
  | saffron-deep on ivory | 5.27:1 | Pass |
  | saffron-deep on cream | 5.55:1 | Pass |
  | ink on ivory | 13.62:1 | Pass |
  | stone on ivory | 4.85:1 | Pass |
  | sage on emerald | 5.89:1 | Pass |
  | ink on saffron (fab button icon) | 6.32:1 | Pass |
  | ~~raw saffron on ivory~~ | ~~2.16:1~~ | **Fail — found live, fixed** |

  The last row was a real bug: `WhatsAppButton`'s inline variant hardcoded
  bright gold text with no regard for the zone it was placed in, and it *was*
  used on ivory (Contact page) and cream (the quote form) backgrounds. Fixed
  by giving the component a `tone` prop (`"light"` on emerald zones, `"dark"`
  → `--saffron-deep` on ivory/cream zones) and updating both call sites.
  `Logotype`'s Urdu span had the same latent defect (1.60:1) but no live
  usage on a light zone yet — fixed defensively so it's correct if reused.

- **Focus states:** global `:focus-visible` rule (gold hairline, 1.5px
  outline, 3px offset) — never the browser default — applied uniformly via
  `globals.css`, not per-component.
- **Keyboard path:** full nav → mobile overlay (focus-trapped, Esc-closable,
  returns focus to the toggle button on close) → menu category tabs → the
  entire 4-step quote form (occasion pills use `aria-pressed`, back/continue/
  submit are real buttons, the success and error states are announced via
  `role="alert"` / focus-shifted headings) all confirmed keyboard-operable
  with no mouse-only interaction anywhere.
- **Urdu spans:** every Urdu string in the app carries `lang="ur"`, and
  right-to-left blocks additionally carry `dir="rtl"` (dish names, section
  eyebrows in Urdu, the bilingual logotype, the map's "Whyte Ave" label is
  English so left as `dir` default).
- **Images:** every `<Picture>` call has real alt text describing the dish/
  scene (flagged `TODO(client)` where it describes placeholder photography
  rather than the final shot); the two purely decorative background images
  (menu hero backdrop, map illustration elements) use `alt=""` / `aria-hidden`.

Lighthouse Accessibility: **100/100 on all five pages** after the fix.

## Gate 6 — Cross-viewport (360 / 390 / 768 / 1280 / 1536)

Verified with ground-truth browser measurements (Chrome DevTools Protocol —
`document.documentElement.scrollWidth` vs. `clientWidth`, plus a full-DOM
sweep for any element extending past the viewport that isn't inside a
deliberate horizontal-scroll rail), not visual guesswork:

```
25/25 checks (5 pages × 5 widths): scrollWidth === clientWidth, 0 unexplained
overflowing elements
```

One real bug was caught and fixed by this check: at 360px, the nav's
"Order online" pill was bleeding through below the `sm` breakpoint where it
should have been hidden. Root cause: the `Button` component's own base class
sets `inline-flex` unconditionally; passing a conflicting `hidden sm:inline-
flex` into its `className` created two equal-specificity utilities fighting
over the same CSS property, and the component's own always-on class won
regardless of viewport. Fixed by moving the responsive visibility onto a
wrapping `<div>` instead of onto the component that already owns its own
display utility — the same pattern that already worked correctly for every
other responsive-hide case in the codebase (which don't wrap a component with
a competing base display class).

## Consolidated TODO(client) list

Every value below lives in exactly one file — `src/data/site.ts` unless noted:

- `url` — production domain (canonical URLs, OG, sitemap, JSON-LD)
- `orderUrl` — real ordering-platform URL (currently `TODO_ORDER_URL`; until
  set, `/order` shows the call/WhatsApp fallback instead of auto-redirecting)
- `phone` / `phoneHref` / `whatsapp` — real numbers
- `address` — street, postal code; `mapsUrl` — real Google Maps listing
- `hours` — confirm days/times
- `email`
- `socials` — Instagram/Facebook confirmed or replaced; TikTok currently empty (hidden)
- `stats` — 12+ years / 800+ daawats / 60+ dishes — confirm real numbers
- `testimonial` — placeholder quote/attribution; needs a real review + permission
- `src/data/menu.ts` — every dish, price and availability needs client confirmation
- `src/data/catering.ts` — every occasion's "from $X/person" starting price
- `src/lib/forms.ts` — `NEXT_PUBLIC_FORM_ENDPOINT` (Formspree/Resend/serverless — currently simulates success locally)
- **Photography** — every image in `assets-src/`/`public/img/` is a generated
  placeholder tile; alt text throughout is flagged `TODO(client)` where it
  describes a placeholder rather than final photography
- **Contact map** — pin position is eyeballed for the placeholder address; confirm once the real address is set

---

# SEO audit — pre-launch (Aug 16, 2026)

Nine specialist passes across 7 pages (schema, content/E-E-A-T, sitemap,
GEO/AI-search, local/GBP, search-experience/SXO, performance, visual/mobile,
technical). The dev server (`localhost:3000`) was used for content/structure
checks; a freshly rebuilt production static export (`localhost:4173`) was
used for performance, visual, and technical checks, since dev mode
understates real-world speed. Domain (`fatimakarahi.ca`) is not live yet, so
CrUX field data, IndexNow, and hosting-level headers are unverified.

**SEO Health Score: 68/100** (weighted)

| Category | Weight | Score |
|---|---|---|
| Content Quality | 23% | 58 |
| Technical SEO | 22% | 78 |
| On-Page SEO | 20% | 72 |
| Performance (CWV) | 10% | 71 |
| Schema | 10% | 68 |
| AI Search (GEO) | 10% | 55 |
| Images | 5% | 65 |

**Local SEO: 56/100** (supplementary score, not in the weighted total above —
driven down almost entirely by the GBP/legacy-site item below, which is
already being handled — see note).

## Acknowledged, already being handled

- **GBP currently points at the old live site (`fatimakarahicorner.com`).**
  Every third-party listing (DoorDash, Zabihah, RestaurantGuru, Apple Maps,
  Wheree) also carries the name "Fatima Karahi Corner" rather than "Fatima
  Karahi." **Client confirmed this is being fixed** — not treated as an open
  blocker here, but the eventual fix (repoint GBP's website field, decide the
  canonical name, redirect/retire the old domain) should happen before or at
  launch so the new site and the live listing agree.

## Still open

- **`sameAs` schema links to an Instagram account that isn't this
  business** (`instagram.com/fatimakarahi` — a dormant, unrelated Calgary
  account, inactive since 2019). Quick code fix once the real handle is
  confirmed, or remove until one exists. `src/components/chrome/JsonLd.tsx`

## Critical

1. **`/gallery/` missing from `sitemap.ts`** — a real, indexable,
   nav-linked page with its own canonical, silently absent from the sitemap.
   Caught independently by the sitemap, technical, and content passes.
   Fix: add the entry in `src/app/sitemap.ts`.
2. **An oversized, unoptimized logo is the homepage's actual LCP element.**
   `brand/fatima-logo.png` ships at 160KB, displayed at 58×44 but natively
   573×436 (~10× oversized), preloaded on every page, never run through the
   site's own AVIF/WebP pipeline — Lighthouse identifies it, not the hero
   photo, as what's holding up paint, pushing mobile LCP to 8.5s ("Poor").
   Fix: run it through `scripts/optimize-images.mjs`, export at real display
   size (×2 for retina). Highest-leverage single fix in the audit.
3. **Trust-band stats ship as fact but are explicitly unverified.**
   "12+ Years serving," "800+ Daawats catered" render as confident animated
   numerals, but `site.ts` itself flags them `TODO(client): confirm the
   numbers` — and "12+ years" doesn't reconcile with the known brand
   timeline. Fix: get real numbers from the owner before launch, or drop the
   stat.

## High

1. **18 ready FAQ answers carry zero `FAQPage` schema, and aren't even real
   headings.** The content is already written in exactly the shape AI answer
   engines want (direct, self-contained, 40–90 words), but nothing wraps it
   in `FAQPage` JSON-LD, and each question renders as a `<span>` inside a
   button, not an `<h3>`. Fix: add an `FAQJsonLd` component from the existing
   `faq.ts` data, wrap questions in real heading tags. Lowest effort,
   highest-ROI item in the whole audit.
2. **Schema still claims `acceptsReservations: true` — now inaccurate.**
   Direct regression from removing the online reservation form earlier this
   build. Fix: set to `false` in `JsonLd.tsx` (or represent phone
   reservations differently).
3. **No visible rating anywhere on-site**, despite a real ~4.4★ Google
   rating and real attributed reviews already living in `site.ts`; meanwhile
   the About page's meta description already *claims* "4.3-star reputation"
   with nothing backing it. Fix: confirm the live number, add
   `aggregateRating` to the Restaurant schema, surface a badge near the
   testimonials.
4. **Missing `geo` coordinates in LocalBusiness schema** — the exact
   lat/long already sits inside the embedded Maps iframe URL (53.4254,
   −113.5031), unused. Fix: add a `GeoCoordinates` block. Five-minute fix.
5. **No named founder and no first-hand "who is Fatima" story on
   `/about`.** Never names a person, credits a chef, or tells the actual
   Lahore → Calgary → Edmonton family story (that detail only lives in two
   sentences on the homepage). Persona scoring independently confirms this:
   About is the weakest page on the site (42/100) for exactly the "diaspora
   craving authenticity" audience the brand strategy targets. Fix: add a
   real founder/family bio with name, photo, and the origin story.
6. **Mobile load speed is "Poor" on 5 of 7 pages.** LCP 5.7–8.5s and TTI
   6–9s on Home, Menu, Catering, About, Gallery (real Lighthouse mobile
   traces) — driven by ~1.5–2s of render-blocking CSS and 324KB across five
   unsubset web-font files. Fix: inline critical CSS / confirm Next's CSS
   splitting is active, subset fonts.
7. **Homepage `<title>` omits "Edmonton" and "halal."** The one title tag
   most likely to be lifted as the canonical entity title by an AI engine
   carries neither; every competitor checked leads with both. `/catering`'s
   title also omits Edmonton. Fix: e.g. "Fatima Karahi: Halal Pakistani
   Restaurant in Edmonton," keep the tagline in the H1.
8. **Five live FAQ answers state unconfirmed facts as "yes."** Group/
   private-event bookings, spice-level policy, off-site catering, parking,
   gift cards — all worded as confident answers despite `faq.ts` flagging
   every one `needsConfirmation: true`. Fix: get owner sign-off before
   launch, or soften wording until confirmed.
9. **No IndexNow key or submission wired up.** Fix: generate a key, add the
   `public/<key>.txt` file, script a submission on sitemap changes.

## Medium

1. No `BreadcrumbList` schema anywhere, despite an ideal flat structure for it.
2. Tiered-price dishes (e.g. Beef Karahi ½kg/1kg) collapse to one unlabeled
   price in Menu schema — only the first tier is emitted.
3. Missing `logo` property in Restaurant schema despite the asset already
   existing and being used elsewhere.
4. No direct Maps CID deep-link / "Get Directions" CTA — `mapsUrl` is an
   unused generic text-search string.
5. Phone not in E.164 format in schema (`(780) 705-5000` vs.
   `+17807055000`, which is already used correctly elsewhere in the same file).
6. `/order/` is thin (one H1 + ~15 words) and does a silent client-side JS
   redirect to the ordering platform that flashes the branded shell first
   and breaks its own Lighthouse performance trace.
7. Only one testimonial is reused verbatim across Home/About/Catering
   despite 3 real named reviews existing in the data.
8. Duplicate/generic alt text on 3 of 4 homepage carousel images (identical
   string repeated).
9. `/gallery/` has the worst main-thread cost of any page (491ms TBT, 3.7s
   of work) — defer lightbox JS, verify full lazy-loading.
10. `/contact/` pulls 632KB of scripts / 516KB third-party weight (map or
    widget) — facade or lazy-load it.
11. No jump-navigation across 18 menu categories (~80 items, one long scroll).
12. Halal badge is a small unlabeled icon — competitors state "100%
    Halal-certified" explicitly in text.
13. Gallery intro copy repeats "halal Pakistani restaurant in Edmonton"
    three times in ~230 words.
14. `site.url` production domain is still `TODO(client)`-flagged in source
    despite being wired into every canonical/OG/JSON-LD/sitemap URL — needs
    written confirmation before launch.
15. No chef/kitchen-team credentialing anywhere — a planned differentiator
    vs. the primary competitor per project notes.
16. Bing Maps lists the wrong street number (10626 vs. correct 10680
    Ellerslie Rd SW).
17. Facebook `sameAs` link is unverified (login-walled, already
    TODO-flagged in source).

## Low

1. Sitemap `lastmod` is identical across every URL (build-timestamp
   artifact, weak freshness signal).
2. Sitemap `priority`/`changefreq` fields are ignored by Google — harmless,
   optional to simplify.
3. No `WebSite` schema — fine, no on-site search feature exists.
4. No review/publish dates anywhere on the site (no recency signal).
5. A few menu descriptions are non-descriptive filler (e.g. "Shrimps fried
   in a special recipe").
6. `size="sm"` buttons may sit under the 44px touch-target guidance on
   mobile CTAs — worth a visual check.
7. 404 page keeps the default site title instead of a distinct "Page not
   found" title.
8. ~11KB of legacy JS polyfill overhead per page — browserslist target
   could narrow.
9. Uber Eats rating (3.8★/120) is notably lower than Google's (4.4★) — worth
   monitoring separately, not a site issue.
10. No Yelp/TripAdvisor listings confirmed — searches were CAPTCHA-blocked
    (inconclusive, not confirmed-absent); worth the client checking directly
    while logged in.

## Passed / strengths

- Fully static, pre-rendered HTML — zero JS-dependency for content, verified
  on all 7 pages.
- `robots.txt` allows every AI crawler checked (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, CCBot, and more) — ahead of the named
  primary competitor on this exact point.
- Clean URL structure, correct canonicals throughout, no accidental
  noindex, proper 404 handling.
- Layout shift is a non-issue anywhere — 0.0003–0.017 on every page, far
  under the "good" threshold.
- Both JSON-LD blocks are syntactically valid, use no deprecated types, and
  are single-sourced from the site's own data files.
- The Catering page is the strongest page on the whole site by persona
  scoring (82/100) — structurally deeper than every competitor checked.
- Real structured Menu/MenuItem/Offer schema across ~80 dishes — most
  competitors carry no structured menu data at all.
- Real NAP, halal badge, family-owned messaging, and a live GBP-verified map
  embed present wherever it matters.

## Sequenced action plan

1. **Batch the quick schema & sitemap fixes into one PR** — gallery
   sitemap entry, geo coordinates, logo field, E.164 phone, Maps deep-link,
   `acceptsReservations` correction, `sameAs` cleanup. All touch the same two
   files, cheap to ship together.
2. **Ship FAQPage schema and real heading tags** — independent of
   everything else, highest ROI-to-effort ratio in the audit.
3. **Fix the logo and the render-blocking CSS/fonts together** — the two
   dominant performance levers; verify with one Lighthouse re-run instead of
   two.
4. **Collect the outstanding facts from the owner** — real trust-band
   numbers, current GBP rating, the five unconfirmed FAQ policies, final
   domain confirmation. Track as one checklist so it doesn't quietly slip.
5. **Content depth pass** — founder story, order-page copy, testimonial
   variety, menu navigation, halal copy, chef credentialing. Can run in
   parallel with the steps above.
6. **Re-run this audit against the live production domain** once deployed —
   IndexNow, CrUX field data, hosting-level headers, and sitemap discovery
   couldn't be tested against localhost.
