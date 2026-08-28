"use client";

import { useState } from "react";
import { site } from "@/data/site";

/**
 * Live Google Maps embed of Fatima Karahi's real Business Profile listing
 * (place ID 0x53a01f3acbdeb499). Sized via a `relative`/`aspect-[4/3]`
 * wrapper + `absolute inset-0` iframe (the same responsive-media pattern
 * `Picture` uses elsewhere) instead of the iframe's own fixed 600×450
 * attributes.
 *
 * The white info card Google renders inside (business name, rating, review
 * count, directions button) is native Maps chrome served cross-origin from
 * live GBP data — it can't be restyled, hidden, or overlaid, so only this
 * wrapper carries the brand treatment (radius, border, shadow); the card
 * itself is left alone.
 *
 * SEO audit Medium #10 ("/contact/ pulls 632KB of scripts / 516KB
 * third-party weight — facade or lazy-load it"): the iframe already had
 * `loading="lazy"`, but on Contact it's above the fold on desktop, so the
 * browser fetches it immediately regardless. This is now a real click-to-load
 * facade — a lightweight static card (no third-party request at all) until
 * the visitor actually asks for the interactive map, matching the
 * "Get directions" link next to it for anyone who just wants directions
 * without loading Maps' JS at all.
 */
export function MapFrame() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-[color-mix(in_srgb,var(--saffron)_50%,transparent)] shadow-card">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2377.4089487032043!2d-113.5031372!3d53.4253959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a01f3acbdeb499%3A0xea952bc0ce5712f9!2sFatima%20Karahi%20Corner%20-%20Edmonton!5e0!3m2!1sen!2sin!4v1741629137566!5m2!1sen!2sin"
          title="Fatima Karahi Edmonton location on Google Maps"
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label="Load the interactive Google Map"
      className="group relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-s3 overflow-hidden rounded-card border border-[color-mix(in_srgb,var(--saffron)_50%,transparent)] bg-cream shadow-card transition-shadow duration-[var(--dur)] hover:shadow-lift"
    >
      <div aria-hidden="true" className="jali absolute inset-0 opacity-40" />
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        className="relative text-gold-deep"
      >
        <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
      <span className="relative font-display text-[1.1rem] text-ink">
        {site.address.street}, {site.address.city}
      </span>
      <span className="relative text-eyebrow font-semibold uppercase tracking-[0.08em] text-gold-deep underline-offset-4 group-hover:underline">
        Tap to load the map
      </span>
    </button>
  );
}
