import localFont from "next/font/local";

/**
 * Self-hosted brand type — no runtime font CDN requests.
 * Marcellus, Cormorant Garamond and Open Sans are latin-subset woff2
 * (Cormorant and Open Sans are variable files covering their weight range);
 * Allura is a single-weight display script; Gulzar is the Urdu Nastaliq
 * arabic subset, unrelated to this rebrand and kept as-is — Urdu dish names,
 * the bilingual logotype and headline lockups are a separate brand
 * requirement from the visual-identity refresh this file otherwise serves.
 *
 * adjustFontFallback: previously disabled ("false") so the fallback stacks
 * stayed exactly the token stacks (Georgia / system-ui) rather than a
 * synthesized metric match. That turned out to be a real perf bug (SEO
 * final-check, Aug 28 2026): with no metric adjustment, the fallback serif
 * and the real webfont render at different box sizes, so the hero headline
 * visibly reflows on swap — Lighthouse measured a 0.237 layout-shift score
 * (fails the <0.1 "good" CLS threshold) directly attributed to these three
 * fonts loading, which also delayed when LCP was considered settled (8.1s).
 * Re-enabled here with the closest matching system category (Next computes
 * ascent/descent/line-gap/size-adjust overrides against that category so
 * the fallback box matches the real font before swap) — the token fallback
 * stacks (Georgia / system-ui) are kept as-is for the *font-family* list;
 * only the metric-matching target changes. No visual change once the real
 * webfont has loaded — this only fixes the pre-swap flash.
 */

export const marcellus = localFont({
  src: [{ path: "../fonts/marcellus-latin-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-marcellus",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-latin-var.woff2", weight: "300 700", style: "normal" },
    { path: "../fonts/cormorant-latin-var-italic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const openSans = localFont({
  src: [
    { path: "../fonts/opensans-latin-var.woff2", weight: "300 800", style: "normal" },
    { path: "../fonts/opensans-latin-var-italic.woff2", weight: "300 800", style: "italic" },
  ],
  variable: "--font-open-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const allura = localFont({
  src: [{ path: "../fonts/allura-latin-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-allura",
  display: "swap",
  preload: false, // decorative, used once site-wide — not worth a preload slot
  fallback: ["Brush Script MT", "cursive"],
  adjustFontFallback: false,
});

export const gulzar = localFont({
  src: [{ path: "../fonts/gulzar-arabic-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-gulzar",
  display: "swap",
  // SEO audit High #6 (mobile LCP/TTI): this is by far the heaviest font
  // file (208KB — an Arabic/Nastaliq shaping font, inherently larger than a
  // latin subset) but it was preloaded site-wide even though it only ever
  // renders a few decorative Urdu words in the nav/footer/logotype, never
  // above-the-fold LCP content. Preloading it competed with the fonts and
  // images that actually gate first paint on every single page load.
  // `display: "swap"` already means the RTL accents just show slightly
  // later without it — no layout shift, since those spans aren't sized
  // against a fallback metric.
  preload: false,
  fallback: ["Noto Nastaliq Urdu", "serif"],
  adjustFontFallback: false,
});
