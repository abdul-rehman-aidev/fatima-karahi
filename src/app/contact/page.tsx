import type { Metadata } from "next";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { WhatsAppButton } from "@/components/ds/WhatsAppButton";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { MapFrame } from "@/components/sections/MapFrame";
import { site } from "@/data/site";
import { BreadcrumbJsonLd } from "@/components/chrome/JsonLd";

export const metadata: Metadata = {
  title: "Contact: find us in Edmonton",
  description:
    "Visit Fatima Karahi in Edmonton. Address, hours, phone, WhatsApp and directions. We'd love to host you.",
  alternates: { canonical: "/contact" },
};

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
              <p className="m-0">
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-[0.9rem] font-semibold uppercase tracking-[0.05em] text-gold-deep no-underline"
                >
                  Get directions →
                </a>
              </p>
              <p className="m-0 mt-s3 text-stone">{site.hours.display}</p>
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
      </section>
      <BreadcrumbJsonLd name="Contact" path="/contact/" />
    </>
  );
}
