"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logotype } from "@/components/ds/Logotype";
import { Button } from "@/components/ds/Button";
import { PhoneGlyph } from "@/components/ds/CallNowButton";
import { hasOrderUrl, site } from "@/data/site";
import { cx } from "@/lib/cx";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/catering", label: "Catering" },
  { href: "/contact", label: "Contact" },
];

/**
 * Condensing site nav: transparent over the hero, solid emerald-deep with a
 * gold hairline once scrolled. Bilingual lockup left; gold order pill +
 * call button right; full-screen emerald overlay menu on mobile (focus-trapped,
 * Esc-closable, large Fraunces links).
 */
export function SiteNav() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const orderHref = hasOrderUrl() ? site.orderUrl : "/order";
  const orderExternal = hasOrderUrl();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Overlay behaviour: scroll lock, Esc to close, focus trap
  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      overlay
        ? Array.from(
            overlay.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          )
        : [];
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Close the overlay on route change
  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  return (
    <header>
      <nav
        aria-label="Main"
        className={cx(
          "fixed inset-x-0 top-0 z-40 flex items-center justify-between px-[clamp(20px,5vw,56px)] transition-all duration-[var(--dur)] ease-[var(--ease-soft)]",
          solid
            ? "h-[64px] border-b-[0.5px] border-[color-mix(in_srgb,var(--saffron)_40%,transparent)] bg-emerald-deep/95 backdrop-blur-[2px]"
            : "h-[84px] border-b-[0.5px] border-transparent bg-transparent",
        )}
      >
        <Logotype size="sm" />

        <div className="flex items-center gap-[clamp(14px,2.5vw,34px)]">
          <ul className="hidden items-center gap-[clamp(14px,2vw,28px)] md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  data-active={pathname === l.href || undefined}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className={cx(
                    "link-underline py-[6px] font-body text-[15px] font-semibold uppercase tracking-[0.05em] no-underline",
                    pathname === l.href ? "text-gold" : "text-ivory",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Wrapping div (not Button's own className) owns the responsive
              display toggle — Button's base class already sets `inline-flex`
              unconditionally, so a caller-supplied `hidden` on the same
              element ties in specificity with it and silently loses. */}
          <div className="hidden sm:block">
            <Button variant="primary" size="sm" href={orderHref} external={orderExternal}>
              Order online
            </Button>
          </div>

          <a
            href={site.phoneHref}
            aria-label="Call now"
            className="hidden h-[38px] w-[38px] place-items-center rounded-pill border border-[color-mix(in_srgb,var(--saffron)_40%,transparent)] text-gold transition-colors duration-[var(--dur)] hover:border-gold hover:text-gold-bright md:grid"
          >
            <PhoneGlyph size={18} />
          </a>

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-pill border border-emerald-line text-ivory md:hidden"
          >
            <span aria-hidden="true" className="relative block h-[10px] w-[18px]">
              <span
                className={cx(
                  "absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-[var(--dur)] ease-[var(--ease-out)]",
                  open && "translate-y-[4.5px] rotate-45",
                )}
              />
              <span
                className={cx(
                  "absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-[var(--dur)] ease-[var(--ease-out)]",
                  open && "-translate-y-[4px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Full-screen emerald overlay menu */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cx(
          "fixed inset-0 z-50 flex flex-col bg-emerald-deep transition-opacity duration-[var(--dur)] ease-[var(--ease-soft)] md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div aria-hidden="true" className="jali absolute inset-0" />
        <div className="relative flex h-[84px] items-center justify-between px-[clamp(20px,5vw,56px)]">
          <Logotype size="sm" />
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-pill border border-emerald-line text-ivory"
          >
            <span aria-hidden="true" className="relative block h-[16px] w-[16px]">
              <span className="absolute left-0 top-1/2 h-[1.5px] w-full rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-[1.5px] w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav aria-label="Mobile" className="relative flex flex-1 flex-col justify-center px-[clamp(24px,8vw,56px)]">
          <ul className="flex flex-col gap-s5">
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={close}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className={cx(
                    "font-display text-[2.2rem] leading-[var(--lh-title)] no-underline transition-colors duration-[var(--dur)]",
                    pathname === l.href ? "text-gold" : "text-ivory hover:text-gold-bright",
                  )}
                  style={{ transitionDelay: open ? `${i * 40}ms` : undefined }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div lang="ur" dir="rtl" className="mt-s7 text-[1.6rem] text-gold-bright opacity-80">
            {site.nameUrdu}
          </div>
        </nav>

        <div className="relative flex flex-col gap-s3 px-[clamp(24px,8vw,56px)] pb-s7">
          <Button variant="primary" size="lg" href={orderHref} external={orderExternal}>
            Order online
          </Button>
          <div className="flex items-center justify-between gap-s3">
            <a href={site.phoneHref} className="font-body text-[0.95rem] text-ivory no-underline">
              {site.phone}
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-s2 font-body text-[0.95rem] font-semibold text-gold no-underline"
            >
              <PhoneGlyph size={18} /> Call now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
