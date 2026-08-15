import type { Metadata } from "next";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { WhatsAppButton } from "@/components/ds/WhatsAppButton";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { ReservationForm } from "@/components/sections/ReservationForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact: find us in Edmonton",
  description:
    "Visit Fatima Karahi in Edmonton. Address, hours, phone, WhatsApp and directions. We'd love to host you.",
  alternates: { canonical: "/contact" },
};

/**
 * Live Google Maps embed of Fatima Karahi's real Business Profile listing
 * (place ID 0x53a01f3acbdeb499) — replaces the earlier stylized brand-map
 * placeholder (jali texture, street grid, pulsing pin) now that a real
 * embed exists. Sized via a `relative`/`aspect-[4/3]` wrapper + `absolute
 * inset-0` iframe (the same responsive-media pattern `Picture` uses
 * elsewhere) instead of the iframe's own fixed 600×450 attributes.
 *
 * The white info card Google renders inside (business name, rating, review
 * count, directions button) is native Maps chrome served cross-origin from
 * live GBP data — it can't be restyled, hidden, or overlaid, so only this
 * wrapper carries the brand treatment (radius, border, shadow); the card
 * itself is left alone.
 */
function MapFrame() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-[color-mix(in_srgb,var(--saffron)_50%,transparent)] shadow-card transition-shadow duration-[var(--dur)] hover:shadow-lift">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2377.4089487032043!2d-113.5031372!3d53.4253959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a01f3acbdeb499%3A0xea952bc0ce5712f9!2sFatima%20Karahi%20Corner%20-%20Edmonton!5e0!3m2!1sen!2sin!4v1741629137566!5m2!1sen!2sin"
        title="Fatima Karahi Edmonton location on Google Maps"
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default function ContactPage() {
  const socials = [
    { label: "Instagram", href: site.socials.instagram },
    { label: "Facebook", href: site.socials.facebook },
    { label: "TikTok", href: site.socials.tiktok },
  ].filter((s) => s.href);

  return (
    <>
      <section className="bg-emerald pb-[clamp(3rem,6vw,4.5rem)] pt-[calc(84px+clamp(2.5rem,6vw,4rem))] text-center">
        <Eyebrow>Contact</Eyebrow>
        <p lang="ur" dir="rtl" className="mb-s1 mt-s4 text-[2.2rem] leading-[1.5] text-gold-bright">
          رابطہ
        </p>
        <h1 className="m-0 font-display text-display-l font-normal text-ivory">
          We&rsquo;d love to host you
        </h1>
      </section>

      <section className="bg-ivory py-section text-ink">
        <div className="mx-auto grid max-w-content gap-s7 px-[clamp(20px,5vw,56px)] lg:grid-cols-2">
          {/* Not Reveal-wrapped: this is the page's primary above-the-fold
              content (often the LCP candidate) — gating its paint behind an
              IntersectionObserver + CSS transition measurably delayed LCP
              (caught live: 4.4s vs ~1.3s once removed). It's immediately
              visible on load anyway, so a scroll-reveal added cost with no
              UX benefit. */}
          <div>
            <Eyebrow tone="stone">Find us</Eyebrow>
            <div className="mt-s4 leading-[1.9]">
              <p className="m-0 font-display text-[1.4rem] text-ink">
                {site.address.street}, {site.address.city}
              </p>
              <p className="m-0 text-stone">{site.hours.display}</p>
              <p className="m-0 mt-s4">
                <a href={site.phoneHref} className="link-underline font-semibold text-ink no-underline">
                  {site.phone}
                </a>
              </p>
              <p className="m-0">
                <a href={`mailto:${site.email}`} className="link-underline text-ink no-underline">
                  {site.email}
                </a>
              </p>
              <div className="mt-s4">
                <WhatsAppButton tone="dark" label="WhatsApp us" />
              </div>
              {socials.length > 0 && (
                <ul className="mt-s5 flex gap-s5">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-[15px] font-semibold uppercase tracking-[0.05em] text-stone no-underline hover:text-gold-deep"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <Reveal delay={100}>
            <MapFrame />
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-s8 max-w-[720px] px-[clamp(20px,5vw,56px)]">
          <div className="rounded-card bg-cream p-[clamp(20px,4vw,36px)] shadow-card">
            <Eyebrow tone="stone">Reach us</Eyebrow>
            <div className="mt-s4">
              <ContactForm />
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} className="mx-auto mt-s6 max-w-[720px] px-[clamp(20px,5vw,56px)]">
          <ReservationForm variant="light" />
        </Reveal>
      </section>
    </>
  );
}
