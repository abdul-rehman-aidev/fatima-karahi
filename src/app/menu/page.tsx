import type { Metadata } from "next";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Picture } from "@/components/media/Picture";
import { Reveal } from "@/components/motion/Reveal";
import { MenuCategoryNav } from "@/components/sections/MenuCategoryNav";
import { MenuSection } from "@/components/sections/MenuSection";
import { BreadcrumbJsonLd, MenuJsonLd } from "@/components/chrome/JsonLd";
import { menu } from "@/data/menu";
import { hasOrderUrl, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Menu: Pakistani karahi, charcoal BBQ, nihari",
  description:
    "The full Fatima Karahi menu: cast-iron karahi, charcoal BBQ, nihari, fresh tandoor breads and Pakistani desserts. Halal, cooked slow, served generous in Edmonton.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  const orderHref = hasOrderUrl() ? site.orderUrl : "/order";
  const orderExternal = hasOrderUrl();

  return (
    <>
      {/* Compact emerald hero */}
      <section className="relative overflow-hidden bg-emerald pb-[clamp(3rem,6vw,4.5rem)] pt-[calc(84px+clamp(2.5rem,6vw,4rem))]">
        <Picture
          name="food-nihari"
          alt=""
          widths={[480, 828, 1200]}
          sizes="100vw"
          width={1200}
          height={1500}
          priority
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover"
        />

        {/* Overlay stack — identical treatment to the homepage hero
            (HomeHero.tsx): bottom-weighted darkening + centred spotlight +
            4-corner vignette, layered above the image, below the content. */}
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

        <div className="relative z-[5] mx-auto max-w-content px-[clamp(20px,5vw,56px)] text-center">
          <Eyebrow size="lg">The menu</Eyebrow>
          <p lang="ur" dir="rtl" className="mb-s1 mt-s4 text-[2.4rem] leading-[1.5] text-gold-bright">
            کھانا
          </p>
          <h1 className="m-0 font-display text-display-l font-normal text-ivory">
            Cooked slow, served generous
          </h1>
        </div>
      </section>

      <MenuCategoryNav cats={menu.map((c) => ({ id: c.id, label: c.label }))} />

      {/* Editorial lists — ivory conversion zone */}
      <div className="bg-ivory pb-section pt-[clamp(2rem,4vw,3rem)] text-ink">
        <div className="mx-auto max-w-content px-[clamp(20px,5vw,56px)]">
          {menu.map((cat) => (
            <MenuSection key={cat.id} category={cat} />
          ))}

          {/* Tail CTAs */}
          <Reveal className="mt-s9 flex flex-wrap items-center gap-s4 border-t-[0.5px] border-[color-mix(in_srgb,var(--stone)_30%,transparent)] pt-s7">
            <Button variant="primary" href={orderHref} external={orderExternal}>
              Order online
            </Button>
            <Button variant="secondary" href="/catering">
              Cater this menu
            </Button>
            <span className="text-[0.9rem] text-stone">
              Everything halal · {site.replyPromise.toLowerCase()} on catering requests
            </span>
          </Reveal>
        </div>
      </div>

      <MenuJsonLd />
      <BreadcrumbJsonLd name="Menu" path="/menu/" />
    </>
  );
}
