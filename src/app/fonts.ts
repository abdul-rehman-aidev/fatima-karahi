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
 * adjustFontFallback is disabled so the fallback stacks stay exactly the
 * token stacks (Georgia / system-ui) rather than a synthesized metric match.
 */

export const marcellus = localFont({
  src: [{ path: "../fonts/marcellus-latin-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-marcellus",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: false,
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
  adjustFontFallback: false,
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
  adjustFontFallback: false,
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
  preload: true,
  fallback: ["Noto Nastaliq Urdu", "serif"],
  adjustFontFallback: false,
});
