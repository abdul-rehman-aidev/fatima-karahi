"use client";

import { Divider } from "@/components/ds/Divider";
import { Picture } from "@/components/media/Picture";
import { ReservationForm } from "@/components/sections/ReservationForm";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useReviewCarousel } from "@/lib/useReviewCarousel";
import { cx } from "@/lib/cx";
import { site } from "@/data/site";

/**
 * Replaces TrustBand's old single testimonial block. Two genuinely different
 * structures per breakpoint — desktop overlaps the reservation/contact card
 * over the photo's bottom edge (negative margin pulling a later sibling up
 * into the preceding section), mobile ends the photo cleanly after the
 * carousel and stacks the card content below on the page's normal
 * background — so, same as MenuSection/CateringGallery elsewhere in this
 * codebase, one subtree is conditionally mounted rather than CSS-toggled.
 */
export function ReviewsReservation() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
}

function BackgroundPhoto() {
  return (
    <>
      <Picture
        name="hero-carousel-1"
        alt=""
        widths={[480, 640, 828, 1200, 1920]}
        sizes="100vw"
        width={1920}
        height={1280}
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover"
      />
      {/* Same flat emerald-deep scrim value used everywhere else in this
          codebase for type-over-photo (ParallaxStatement, the catering
          gallery's mobile cards) — the brief's "emerald-charcoal, not pure
          black" tone, reused rather than re-derived. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--emerald-deep)_68%,transparent)]"
      />
    </>
  );
}

function DesktopLayout() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <BackgroundPhoto />
        {/* Fixed padding, not min-height + vertical centering: centering
            let the carousel's now-constant (but still substantial) height
            eat into the reserved overlap space below it, so the card's
            fixed -mt pull-up was still cropping the avatar row — just
            consistently now instead of varying by review. A fixed, generous
            bottom padding that's comfortably larger than the card's pull-up
            distance guarantees real clearance regardless of content height. */}
        <div className="relative z-[1] pt-[clamp(3rem,6vw,5rem)] pb-[260px]">
          <TestimonialCarousel />
        </div>
      </section>
      <div className="relative z-[2] mx-auto -mt-[180px] max-w-content px-[clamp(20px,5vw,56px)] pb-[clamp(3rem,6vw,4rem)]">
        <div className="grid overflow-hidden rounded-card bg-sage-tag shadow-lift lg:grid-cols-2">
          <ReservationForm variant="dark" bare className="p-[clamp(28px,4vw,48px)]" />
          <ContactColumn className="border-t border-[color-mix(in_srgb,var(--ivory)_14%,transparent)] p-[clamp(28px,4vw,48px)] lg:border-l lg:border-t-0" />
        </div>
      </div>
    </>
  );
}

function MobileLayout() {
  return (
    <>
      <section className="relative overflow-hidden">
        <BackgroundPhoto />
        <div className="relative z-[1] px-[clamp(20px,5vw,56px)] py-[clamp(3rem,8vw,4rem)]">
          <TestimonialCarousel />
        </div>
      </section>
      <div className="bg-ivory py-section">
        <div className="mx-auto flex max-w-content flex-col gap-s5 px-[clamp(20px,5vw,56px)]">
          <ReservationForm variant="dark" />
          <div className="rounded-card bg-sage-tag p-[clamp(20px,5vw,36px)] shadow-card">
            <ContactColumn />
          </div>
        </div>
      </div>
    </>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCarousel() {
  const reviews = site.reviews;
  // The three reviews are noticeably different lengths (review 1 wraps to
  // 4 lines, the others to ~3), so swapping the quote in place instantly
  // both reflows the section's height (the reported "vibration") and, on
  // desktop, shifts where the avatar row lands relative to the reservation
  // card's fixed -mt overlap offset below — sometimes clipping the avatars
  // under the card's top edge. Fixed by (1) reserving a fixed-height box
  // for the quote sized for the longest one, so the section's height never
  // changes between reviews, and (2) crossfading the text instead of
  // swapping it instantly (useReviewCarousel), so a review that does wrap
  // differently doesn't pop.
  const { active, fading, setPaused, goTo } = useReviewCarousel(reviews.length);
  const review = reviews[active];

  return (
    <div
      className="mx-auto max-w-[720px] px-[clamp(20px,5vw,56px)] text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex min-h-[clamp(140px,20vw,215px)] flex-col justify-center">
        <blockquote
          className={cx(
            "m-0 transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-soft)]",
            fading ? "opacity-0" : "opacity-100",
          )}
        >
          <p className="font-editorial text-[clamp(1.5rem,3vw,2.25rem)] italic leading-[1.4] text-ivory">
            &ldquo;{review.quote}&rdquo;
          </p>
        </blockquote>
      </div>

      <Divider width={90} className="mx-auto mt-s6" />

      <div className="mt-s6 flex items-center justify-center gap-s4">
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
                "grid place-items-center rounded-pill font-display font-semibold transition-all duration-[var(--dur)] ease-[var(--ease-soft)]",
                isActive
                  ? "h-[64px] w-[64px] border-[2.5px] border-gold bg-emerald-deep text-[1.1rem] text-gold-bright shadow-glow-gold"
                  : "h-[46px] w-[46px] border border-emerald-line bg-[color-mix(in_srgb,var(--emerald-deep)_60%,transparent)] text-[0.85rem] text-sage opacity-70 hover:opacity-100",
              )}
            >
              {initials(r.name)}
            </button>
          );
        })}
      </div>

      <div
        className={cx(
          "mt-s4 text-eyebrow font-semibold uppercase tracking-[0.1em] text-sage transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-soft)]",
          fading ? "opacity-0" : "opacity-100",
        )}
      >
        {review.name}, {review.city}
      </div>
    </div>
  );
}

function ContactColumn({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="m-0 font-display text-[1.4rem] font-normal text-ivory">Contact Us</h3>

      {/* Gold (both gold-bright and gold-deep) measures under 3:1 against
          the card's sage-tag (#67765B) background — too close in luminance
          to read as an accent here — so this reuses ivory (the one
          approved-palette colour that actually holds up: ~4.1:1) instead of
          the gold treatment used for this same link elsewhere, and leans on
          underline-on-hover rather than a colour shift for affordance. */}
      <a
        href={site.phoneHref}
        className="mt-s4 block font-display text-[1.6rem] text-ivory no-underline hover:underline"
      >
        {site.phone}
      </a>

      <p className="m-0 mt-s3 text-[0.95rem] leading-[1.7] text-ivory">
        {site.address.street}
        <br />
        {site.address.city}, {site.address.region}
      </p>

      {/* The reference layout calls for separate "Lunch Time" / "Dinner
          Time" blocks, but this site only has one continuous service
          window in its data (site.hours) — no split lunch/dinner hours
          exist anywhere to pull from. Showing one real block rather than
          inventing a second, fabricated one. */}
      <div className="mt-s5">
        <div className="text-eyebrow font-semibold uppercase tracking-[0.1em] text-ivory">
          Hours
        </div>
        <p className="m-0 mt-[6px] text-[0.95rem] text-ivory">{site.hours.display}</p>
      </div>
    </div>
  );
}
