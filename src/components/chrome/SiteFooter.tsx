import Link from "next/link";
import { Logotype } from "@/components/ds/Logotype";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Divider } from "@/components/ds/Divider";
import { Button } from "@/components/ds/Button";
import { WhatsAppButton } from "@/components/ds/WhatsAppButton";
import { HalalBadge } from "@/components/ds/HalalBadge";
import { site } from "@/data/site";

/** Rich emerald footer — jali whisper, calligraphic divider, NAP, gold CTAs. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const socials = [
    { label: "Instagram", href: site.socials.instagram },
    { label: "Facebook", href: site.socials.facebook },
    { label: "TikTok", href: site.socials.tiktok },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden bg-emerald-deep px-[clamp(20px,5vw,56px)] pb-s7 pt-[clamp(4rem,8vw,7rem)] text-ivory">
      <div aria-hidden="true" className="jali absolute inset-0" />
      <div className="relative mx-auto max-w-content">
        <div className="mb-s7 flex justify-center">
          <Divider width={180} />
        </div>

        <div className="grid grid-cols-1 items-start gap-s7 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logotype />
            <p className="mt-[18px] max-w-[34ch] text-[0.95rem] leading-[1.6] text-sage">
              The taste of Lahore, now in Edmonton: slow-cooked karahi, charcoal BBQ, and the
              warmth of a Lahori <i lang="ur-Latn">dastarkhwan</i>.
            </p>
            {socials.length > 0 && (
              <ul className="mt-s5 flex gap-s5">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline font-body text-[15px] font-semibold uppercase tracking-[0.05em] text-sage no-underline hover:text-gold"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <Eyebrow>Visit</Eyebrow>
            <p className="mt-s4 text-[0.95rem] leading-[1.7] text-ivory">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region}
              <br />
              <span className="text-sage">{site.hours.display}</span>
            </p>
            <ul className="mt-s4 flex flex-col gap-s2">
              <li>
                <Link href="/menu" className="link-underline text-[0.95rem] text-sage no-underline hover:text-gold">
                  The menu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="link-underline text-[0.95rem] text-sage no-underline hover:text-gold">
                  Find us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <Eyebrow>Reach us</Eyebrow>
            <div className="mt-s4 flex flex-col items-start gap-s3">
              <a href={site.phoneHref} className="text-[0.95rem] text-ivory no-underline hover:text-gold-bright">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="text-[0.95rem] text-ivory no-underline hover:text-gold-bright">
                {site.email}
              </a>
              <WhatsAppButton label="WhatsApp us" />
              <Button variant="primary" size="sm" href="/catering#quote">
                Request a catering quote
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-s7 flex flex-wrap justify-between gap-s3 border-t-[0.5px] border-emerald-line pt-s5 text-eyebrow text-sage">
          <span className="flex items-center gap-s2">
            <HalalBadge size={35} /> · Family-owned · Authentic Lahori recipes
          </span>
          <span>
            © {year} {site.name} · <span lang="ur" dir="rtl">{site.nameUrdu}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
