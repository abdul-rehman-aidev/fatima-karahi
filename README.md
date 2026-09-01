# Fatima Karahi — website

Next.js 15 (App Router, fully static export) + Tailwind CSS v4. Five pages: Home ·
Menu · Catering · Contact · Order. Built from the `design/` Claude Design system
one level up — every token, colour, type value and component spec there is the
source of truth; nothing here invents a value that isn't in that system.

## Stack, and why

The design brief's default recommendation was Astro (near-zero JS by default).
The client-facing build directive explicitly overrode that to **Next.js +
Tailwind**, so that's what's built here — see "JS budget" below for the one
honest trade-off that decision carries.

- **Next.js 15, App Router, `output: "export"`** — fully static HTML/CSS/JS,
  no server required. TypeScript throughout.
- **Tailwind v4** — the entire palette, spacing, radii, shadows and type scale
  are mapped in `src/app/globals.css` under `@theme inline` from the design
  tokens. Tailwind's own default colour palette is disabled (`--color-*:
  initial`) so `bg-emerald`, `text-gold`, `font-display` etc. are the only
  colour/font utilities that exist.
- **Fonts** self-hosted via `next/font/local` (`src/app/fonts.ts`) — Fraunces,
  Hanken Grotesk, Gulzar (Urdu Nastaliq). No Google Fonts runtime requests.
- **Images**: every content/marketing photo is managed in Sanity (the "Site
  Photos" singleton, plus Menu section and Gallery photos) and rendered via
  `next/image` through `src/components/media/SanityPicture.tsx`, which uses
  Sanity's image CDN for on-the-fly resizing and format negotiation. Only
  brand/UI assets (logo, halal badge icon, favicon) stay as static files in
  `public/`.
- **Forms** are static-export-safe: `src/lib/forms.ts` posts JSON to
  `NEXT_PUBLIC_FORM_ENDPOINT`. Until that's set, submissions simulate success
  locally (with a console warning) so the full success/error UI is testable
  end-to-end without a backend.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build
npm run serve    # serve the production build locally on :4173
```

## The one thing to know about the JS budget

Every route ships ~103KB gzip of Next.js/React App-Router hydration runtime —
that's the framework floor for *any* Next.js App Router site (a "hello world"
page ships almost exactly this much) and is unrelated to anything built here.
Page-specific code on top of that floor is small: 0.9–6.6KB gzip per route.
Real transfer measured against a properly-compressed server is **109–115KB
gzip per page** — over the brief's <100KB gate by roughly 10-15%, entirely
because of that shared floor, not page bloat. This is the direct, unavoidable
cost of the Next.js-over-Astro override; Astro's islands architecture would
have hit the <100KB gate with room to spare. See the audit report for the
measurement methodology.

## Editing the site

- **Menu** — `src/data/menu.ts`. One object per category, one array of dishes
  per category. Set `feature: true` on exactly one dish per category to make
  it the spotlight card; give it an `image` (a name from `public/img`) and a
  `featureLine`. Spice is `0–3` (rendered as dots, never emoji).
- **Catering occasions & prices** — `src/data/catering.ts`.
- **Site facts (phone, address, hours, order URL, socials, stats)** —
  `src/data/site.ts`. This is the **one file** for every `TODO(client)` value;
  nothing else in the app hard-codes these. `hasOrderUrl()` gates whether
  `/order` auto-redirects or shows the call/WhatsApp fallback, and whether the
  nav's "Order online" pill links out directly or to the `/order` interstitial.
- **Photography** — upload/replace photos in Sanity Studio (`studio/`, run
  `npm run dev` there): the "Site Photos" singleton for hero/about/catering
  marketing photos, "Menu" for per-category section photos, and "Gallery" for
  the photo grid. No rebuild needed — changes go live immediately.
- **Form endpoint** — set `NEXT_PUBLIC_FORM_ENDPOINT` (e.g. a Formspree form
  URL) in `.env.local` or your host's environment variables. That's the whole
  integration; `src/lib/forms.ts` needs no other change.

## Deploying

`npm run build` produces a fully static `out/` directory — deploy it to
any static host (Vercel, Netlify, Cloudflare Pages, S3+CloudFront, Nginx).
All of those compress responses (gzip/brotli) automatically, which the audit
numbers below assume.

## Motion

CSS-first throughout (`src/app/globals.css`): scroll reveals, the nav
underline wipe, hover states, the map's pin pulse are all CSS. The only JS
is where CSS genuinely can't do the job: `IntersectionObserver` for reveals
and the count-up numerals, `IntersectionObserver`-based scroll-spy for the
menu category nav, and the multi-step form's state machine. No animation
library was used or needed — everything collapses to a simple opacity fade
(or nothing) under `prefers-reduced-motion`.

## Structure

```
src/app/            routes: / /menu /catering /contact /order, layout, sitemap, robots
src/components/ds/  the 11 design-system components (1:1 with design/components/)
src/components/chrome/    SiteNav, SiteFooter, JSON-LD
src/components/sections/  one component per page section
src/components/media/     SanityPicture (Sanity CDN images via next/image)
src/components/motion/    Reveal (scroll-in fade+rise)
src/data/           site.ts, catering.ts — hardcoded copy/labels (photos and Menu content live in Sanity)
src/lib/            forms.ts (submission adapter), cx.ts
src/sanity/         Sanity client, GROQ queries, image-url builder
scripts/            serve-compressed.mjs (local audit only)
```
