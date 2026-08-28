"use client";

import { Reveal } from "@/components/motion/Reveal";
import { useReviewCarousel } from "@/lib/useReviewCarousel";
import { cx } from "@/lib/cx";
import { site } from "@/data/site";

/**
 * About page testimonial section — same 3 reviews and crossfade timing as
 * the homepage's ReviewsReservation carousel (both read from site.reviews,
 * so they can't drift out of sync), restyled per the brief: large gold
 * quotation mark, arrow nav + numbered dots instead of avatar buttons.
 */
export function AboutTestimonials() {
  const reviews = site.reviews;
  // startIndex=1 (SEO audit Medium #7) — see useReviewCarousel's comment;
  // keeps this page's statically-rendered testimonial different from the
  // homepage's, which starts at 0.
  const { active, fading, setPaused, goTo } = useReviewCarousel(reviews.length, 1);
  const review = reviews[active];
  const prevIndex = (active - 1 + reviews.length) % reviews.length;
  const nextIndex = (active + 1) % reviews.length;

  return (
    <section className="relative overflow-hidden bg-emerald-deep py-section">
      <div aria-hidden="true" className="jali absolute inset-0" />
      <div
        className="relative mx-auto max-w-[720px] px-[clamp(20px,5vw,56px)] text-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Reveal>
          <span aria-hidden="true" className="block font-display text-[clamp(3rem,6vw,4.5rem)] leading-none text-gold">
            &ldquo;
          </span>

          <div className="mt-s2 flex min-h-[clamp(140px,20vw,215px)] flex-col justify-center">
            <blockquote
              className={cx(
                "m-0 transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-soft)]",
                fading ? "opacity-0" : "opacity-100",
              )}
            >
              <p className="font-editorial text-[clamp(1.5rem,3vw,2.25rem)] italic leading-[1.4] text-ivory">
                {review.quote}
              </p>
            </blockquote>
          </div>

          <div
            className={cx(
              "text-eyebrow font-semibold uppercase tracking-[0.1em] text-sage transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-soft)]",
              fading ? "opacity-0" : "opacity-100",
            )}
          >
            {review.name}, {review.city}
          </div>

          <div className="mt-s7 flex items-center justify-center gap-s6">
            <ArrowButton direction="prev" onClick={() => goTo(prevIndex)} />
            <div className="flex items-center gap-s3">
              {reviews.map((r, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show the review from ${r.name}`}
                    aria-pressed={isActive}
                    className={cx(
                      "grid h-[32px] w-[32px] place-items-center rounded-pill font-body text-[0.8rem] font-semibold transition-colors duration-[var(--dur)] ease-[var(--ease-soft)]",
                      isActive
                        ? "border-[1.5px] border-gold bg-gold text-ink"
                        : "border border-emerald-line text-sage hover:border-gold hover:text-gold-bright",
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <ArrowButton direction="next" onClick={() => goTo(nextIndex)} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous review" : "Next review"}
      className="grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-pill border border-[color-mix(in_srgb,var(--saffron)_40%,transparent)] text-gold transition-colors duration-[var(--dur)] hover:border-gold hover:text-gold-bright"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {direction === "prev" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}
