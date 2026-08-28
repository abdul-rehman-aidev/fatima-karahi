import type { Metadata } from "next";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { HalalBadge } from "@/components/ds/HalalBadge";
import { Picture } from "@/components/media/Picture";
import { Reveal } from "@/components/motion/Reveal";
import { CateringGallery } from "@/components/sections/CateringGallery";
import { CateringPackages } from "@/components/sections/CateringPackages";
import { CateringServiceOptions } from "@/components/sections/CateringServiceOptions";
import { OccasionsCarousel } from "@/components/sections/OccasionsCarousel";
import { QuoteForm } from "@/components/sections/QuoteForm";
import {
  cateringPackages,
  cateringServiceOptions,
  galleryTiles,
  howItWorks,
  occasions,
} from "@/data/catering";
import { site } from "@/data/site";
import { BreadcrumbJsonLd } from "@/components/chrome/JsonLd";

export const metadata: Metadata = {
  // SEO audit High #7 — this title also omitted "Edmonton" (flagged
  // alongside the homepage's).
  title: "Catering: Pakistani daawats & events in Edmonton",
  description:
    "Pakistani catering in Edmonton: corporate lunches, walima, mehndi, daawats and community events. Slow-cooked karahi and charcoal BBQ, delivered and set up. Request a quote in two minutes.",
  alternates: { canonical: "/catering" },
};

export default function CateringPage() {
  return (
    <>
      {/* HERO — dramatic emerald, with the one allowed truck-art stripe */}
      <section className="relative grid min-h-[62svh] items-center overflow-hidden bg-emerald pt-[84px]">
        <Picture
          name="catering"
          alt="A catering spread laid for a daawat"
          widths={[480, 828, 1200, 1600]}
          sizes="100vw"
          width={1600}
          height={1200}
          priority
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover"
        />
        {/* Overlay stack — identical treatment to the homepage and menu
            heroes (HomeHero.tsx / menu/page.tsx): bottom-weighted darkening +
            centred spotlight + 4-corner vignette, layered above the image,
            below the content. Replaces the old flat emerald wash. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.50) 70%, rgba(0,0,0,0.60) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background:
              "radial-gradient(ellipse 900px 700px at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[4]"
          style={{
            background: `
              radial-gradient(ellipse 65% 65% at 0% 0%, rgba(0,0,0,var(--hero-vignette-opacity)) 0%, transparent 60%),
              radial-gradient(ellipse 65% 65% at 100% 0%, rgba(0,0,0,var(--hero-vignette-opacity)) 0%, transparent 60%),
              radial-gradient(ellipse 65% 65% at 0% 100%, rgba(0,0,0,var(--hero-vignette-opacity)) 0%, transparent 60%),
              radial-gradient(ellipse 65% 65% at 100% 100%, rgba(0,0,0,var(--hero-vignette-opacity)) 0%, transparent 60%),
              radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%)
            `,
          }}
        />

        {/* Truck-art stripe — painted after the vignette so it stays fully
            saturated on top of it, not dimmed by the corner darkening. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 z-[4] w-[10px] bg-[repeating-linear-gradient(180deg,var(--saffron)_0_14px,var(--spice)_14px_28px,var(--emerald-deep)_28px_42px)]"
        />

        <div className="relative z-[5] mx-auto w-full max-w-content px-[clamp(20px,5vw,56px)] py-s8">
          <div className="max-w-[620px]">
            <Eyebrow>Catering</Eyebrow>
            <p lang="ur" dir="rtl" className="mb-s1 mt-s4 text-right text-[2.2rem] leading-[1.5] text-gold-bright sm:text-left">
              دعوت
            </p>
            <h1 className="m-0 font-display text-display-l font-normal text-ivory">
              Bring Pakistan to your event
            </h1>
            <p className="mt-s4 max-w-[44ch] text-body-l text-ivory">
              Slow-cooked karahi and charcoal BBQ, delivered and set up, from boardroom lunches
              to walima feasts.
            </p>
            <div className="mt-s6">
              <Button variant="primary" size="lg" href="#quote">
                Request a catering quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE OPTIONS — in-house vs. delivery/off-site, before anything else */}
      <CateringServiceOptions options={cateringServiceOptions} />

      {/* OCCASIONS — editorial vignettes, staggered heights */}
      <section className="bg-emerald-deep py-section">
        <div className="mx-auto max-w-content px-[clamp(20px,5vw,56px)]">
          <Reveal>
            <Eyebrow>Occasions</Eyebrow>
            <h2 className="mb-s7 mt-s4 font-display text-display-l font-normal text-ivory">
              We cater the way Pakistan gathers
            </h2>
          </Reveal>
          <OccasionsCarousel occasions={occasions} />
        </div>
      </section>

      {/* CATERING PACKAGES — five set menus, client PDF pricing minus $5/head */}
      <CateringPackages packages={cateringPackages} />

      {/* HOW IT WORKS — earned numbered steps, no icon row */}
      <section className="bg-ivory py-section text-ink">
        <div className="mx-auto max-w-content px-[clamp(20px,5vw,56px)]">
          <Reveal>
            <Eyebrow tone="stone">How it works</Eyebrow>
          </Reveal>
          <div className="mt-s6 grid grid-cols-1 gap-s7 sm:grid-cols-3">
            {howItWorks.map((s, i) => (
              <Reveal key={s.n} delay={i * 60}>
                <div className="font-display text-[3rem] leading-none text-gold-deep">{s.n}</div>
                <div
                  aria-hidden="true"
                  className="my-s4 h-px bg-[color-mix(in_srgb,var(--saffron)_45%,transparent)]"
                />
                <h3 className="mb-[10px] mt-0 font-editorial text-[1.5rem] text-ink">{s.title}</h3>
                <p className="m-0 max-w-[32ch] text-[0.95rem] leading-[1.6] text-stone">{s.line}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — asymmetric editorial grid / mobile photo-overlay stack */}
      <section className="relative overflow-hidden bg-emerald-deep py-section">
        <div aria-hidden="true" className="jali absolute inset-0" />
        <div className="relative mx-auto max-w-content px-[clamp(20px,5vw,56px)]">
          <Reveal className="mb-s7 max-w-[560px]">
            <Eyebrow>The gathering</Eyebrow>
            <h2 className="mb-s4 mt-s4 font-display text-display-l font-normal text-ivory">
              A table built for daawats
            </h2>
            <p className="text-body-l text-sage">
              A closer look at how we cook, serve, and lay the table, from the karahi to the last
              plate.
            </p>
          </Reveal>
          <CateringGallery tiles={galleryTiles} />
        </div>
      </section>

      {/* QUOTE — the centrepiece */}
      <section
        id="quote"
        className="scroll-mt-[84px] border-t-[0.5px] border-[color-mix(in_srgb,var(--emerald)_28%,transparent)] bg-cream py-section text-ink"
      >
        <div className="mx-auto max-w-[720px] px-[clamp(20px,5vw,56px)]">
          <Reveal className="mb-s6 text-center">
            <Eyebrow tone="stone">Request a quote</Eyebrow>
            <h2 className="mt-s4 font-display text-display-l font-normal text-ink">
              Two minutes. We do the rest.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <QuoteForm />
          </Reveal>
          <ul className="mt-s6 flex flex-wrap items-center justify-center gap-x-s5 gap-y-s2 text-eyebrow font-semibold uppercase tracking-[0.06em] text-stone">
            <li className="flex items-center gap-s2">
              <HalalBadge size={28} />
              100% Halal-Certified
            </li>
            <li aria-hidden="true">·</li>
            <li>Serving Edmonton &amp; area</li>
            <li aria-hidden="true">·</li>
            <li>{site.replyPromise}</li>
          </ul>
        </div>
      </section>
      <BreadcrumbJsonLd name="Catering" path="/catering/" />
    </>
  );
}
