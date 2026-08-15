"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";

/**
 * Sticky category nav with the gliding gold underline — the menu page's
 * signature moment. Scroll-spy via IntersectionObserver; clicking a category
 * scrolls to its section (sections carry scroll-mt for the sticky offsets;
 * the anchor scroll itself is native, powered by the global `scroll-behavior:
 * smooth` on <html>).
 *
 * On top of that: the horizontal tab strip hides its native scrollbar, shows
 * edge-fade gradients only on the side(s) with more to scroll toward, and
 * exposes arrow buttons that scroll by a fixed 150px step — all of it inert
 * (not rendered) once every tab already fits without overflowing.
 */
export function MenuCategoryNav({ cats }: { cats: { id: string; label: string }[] }) {
  const [active, setActive] = useState(cats[0]?.id);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = cats
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // A narrow horizontal band ~1/3 down the viewport decides the active category.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -65% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [cats]);

  // Keep the active tab visible in the horizontal scroller
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !active) return;
    const tab = nav.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (!tab) return;
    const { left, right } = tab.getBoundingClientRect();
    const { left: nl, right: nr } = nav.getBoundingClientRect();
    if (left < nl || right > nr) {
      tab.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  }, [active]);

  const updateScrollState = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    setHasOverflow(nav.scrollWidth > nav.clientWidth + 1);
    setCanScrollLeft(nav.scrollLeft > 4);
    setCanScrollRight(nav.scrollLeft < nav.scrollWidth - nav.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const nav = navRef.current;
    if (!nav) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateScrollState);
    };
    nav.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      nav.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [updateScrollState]);

  const scrollByStep = (dir: 1 | -1) => {
    navRef.current?.scrollBy({ left: dir * 150, behavior: "smooth" });
  };

  return (
    <div className="sticky top-[64px] z-30 border-b-[0.5px] border-emerald-line bg-emerald-deep">
      <nav aria-label="Menu categories" className="mx-auto max-w-content px-[clamp(20px,5vw,56px)]">
        <div className="flex items-center">
          {hasOverflow && (
            <button
              type="button"
              onClick={() => scrollByStep(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll categories left"
              className="grid shrink-0 cursor-pointer place-items-center py-s4 pr-s3 text-sage transition-opacity duration-[var(--dur)] hover:text-ivory disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronIcon direction="left" />
            </button>
          )}

          <div className="relative min-w-0 flex-1">
            {hasOverflow && (
              <div
                aria-hidden="true"
                className={cx(
                  "pointer-events-none absolute inset-y-0 left-0 z-[1] w-s7 bg-[linear-gradient(90deg,var(--emerald-deep)_0%,transparent_100%)] transition-opacity duration-[var(--dur)]",
                  canScrollLeft ? "opacity-100" : "opacity-0",
                )}
              />
            )}

            <div
              ref={navRef}
              className="flex gap-s6 overflow-x-auto [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {cats.map((c) => {
                const isActive = active === c.id;
                return (
                  <a
                    key={c.id}
                    data-cat={c.id}
                    href={`#${c.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cx(
                      "relative whitespace-nowrap py-s4 font-body text-[15px] font-semibold uppercase tracking-[0.05em] no-underline transition-colors duration-[var(--dur)]",
                      isActive ? "text-gold" : "text-sage hover:text-ivory",
                    )}
                  >
                    {c.label}
                    <span
                      aria-hidden="true"
                      className={cx(
                        "absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-[var(--dur)] ease-[var(--ease-out)]",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </a>
                );
              })}
            </div>

            {hasOverflow && (
              <div
                aria-hidden="true"
                className={cx(
                  "pointer-events-none absolute inset-y-0 right-0 z-[1] w-s7 bg-[linear-gradient(270deg,var(--emerald-deep)_0%,transparent_100%)] transition-opacity duration-[var(--dur)]",
                  canScrollRight ? "opacity-100" : "opacity-0",
                )}
              />
            )}
          </div>

          {hasOverflow && (
            <button
              type="button"
              onClick={() => scrollByStep(1)}
              disabled={!canScrollRight}
              aria-label="Scroll categories right"
              className="grid shrink-0 cursor-pointer place-items-center py-s4 pl-s3 text-sage transition-opacity duration-[var(--dur)] hover:text-ivory disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronIcon direction="right" />
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? <path d="M15 6 L9 12 L15 18" /> : <path d="M9 6 L15 12 L9 18" />}
    </svg>
  );
}
