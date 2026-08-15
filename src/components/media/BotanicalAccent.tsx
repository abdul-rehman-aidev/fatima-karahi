import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";

export type BotanicalAccentProps = {
  /** path under /public, e.g. "/decorative/sharp/chili-sprig-01.png" */
  src: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  /** CSS width at the default (desktop) breakpoint, e.g. "180px" */
  width: string;
  opacity?: number;
  /** degrees */
  rotate?: number;
  /** keep low — these sit behind real content, never above it */
  zIndex?: number;
  /** hide below the md breakpoint (768px). Default true: these are
   *  atmospheric accents, not content, and mobile layouts are tight enough
   *  without them. */
  hideOnMobile?: boolean;
  /** shows at this width below md instead of hiding — only meaningful when
   *  hideOnMobile is false */
  mobileWidth?: string;
  /** eager-load + fetchPriority="high", for an above-the-fold hero instance */
  priority?: boolean;
  /** true centering (e.g. top:"50%" left:"50%") via translate(-50%,-50%),
   *  composed with `rotate` in one transform — use this instead of
   *  hardcoding negative margins to center an accent on a point. */
  center?: boolean;
};

/**
 * Purely atmospheric image accent (dried chilies, cardamom, mint sprigs...)
 * absolutely positioned within whatever section places it — that parent
 * MUST be `position: relative` (or another positioning context), or the
 * offsets below resolve against the page instead of the section.
 *
 * Decorative only: aria-hidden, empty alt, pointer-events: none, and no
 * box model of its own (no margin/padding/border/shadow/background) so it
 * never affects layout or intercepts interaction. `max-width: none` on the
 * image overrides Tailwind's preflight `img { max-width: 100% }` reset,
 * so the `width` prop stays authoritative regardless of the containing
 * block's size.
 *
 * `center` composes `translate(-50%, -50%)` with `rotate` into one
 * transform, so `top: "50%", left: "50%", center` truly centers the accent
 * on that point regardless of its width — no hardcoded negative margins.
 *
 * hideOnMobile/mobileWidth are a pure-CSS breakpoint swap (Tailwind's
 * `md:`/`max-md` display toggle) — no JS, so no hydration flash, matching
 * this project's other breakpoint-dependent pieces. `width` is a per-instance
 * runtime string, and inline styles can't express a media query, so
 * swapping it by breakpoint needs either a second element or a bespoke
 * global CSS rule; rendering both breakpoints' <img> and toggling
 * visibility keeps this self-contained in one file instead of growing
 * globals.css for a single component. Browsers dedupe the repeated
 * identical `src` fetch, so this doesn't cost a second image request.
 */
export function BotanicalAccent({
  src,
  top,
  bottom,
  left,
  right,
  width,
  opacity = 1,
  rotate = 0,
  zIndex = 0,
  hideOnMobile = true,
  mobileWidth,
  priority = false,
  center = false,
}: BotanicalAccentProps) {
  const transform = [center && "translate(-50%, -50%)", rotate && `rotate(${rotate}deg)`]
    .filter(Boolean)
    .join(" ");

  const style = (w: string): CSSProperties => ({
    top,
    bottom,
    left,
    right,
    width: w,
    maxWidth: "none",
    opacity,
    transform: transform || undefined,
    zIndex,
  });

  if (hideOnMobile) {
    return (
      <AccentImg src={src} priority={priority} className="hidden md:block" style={style(width)} />
    );
  }

  if (mobileWidth) {
    return (
      <>
        <AccentImg src={src} priority={priority} className="md:hidden" style={style(mobileWidth)} />
        <AccentImg src={src} priority={priority} className="hidden md:block" style={style(width)} />
      </>
    );
  }

  return <AccentImg src={src} priority={priority} style={style(width)} />;
}

// Every image currently under /public/decorative (sharp/ and blurred/) is
// batch-cropped to this exact 432x578 canvas — confirmed via sharp metadata
// on all 12 source files, not assumed. Passed as the <img> width/height
// HTML attributes (distinct from the CSS `width` style, which sets the
// displayed size), this lets the browser reserve the correct aspect ratio
// immediately, before a lazy-loaded accent's bytes ever arrive. Without it,
// an unloaded <img> with only a CSS width and no height/aspect-ratio hint
// collapses to ~0 height and visibly pops into shape on load — confirmed via
// a DOM inspection where an unloaded accent measured 2px tall pre-load.
const INTRINSIC_WIDTH = 432;
const INTRINSIC_HEIGHT = 578;

function AccentImg({
  src,
  style,
  className,
  priority,
}: {
  src: string;
  style: CSSProperties;
  className?: string;
  priority: boolean;
}) {
  return (
    <img
      src={src}
      width={INTRINSIC_WIDTH}
      height={INTRINSIC_HEIGHT}
      alt=""
      aria-hidden="true"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={cx("absolute pointer-events-none", className)}
      style={style}
    />
  );
}
