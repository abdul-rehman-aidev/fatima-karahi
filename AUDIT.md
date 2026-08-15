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
