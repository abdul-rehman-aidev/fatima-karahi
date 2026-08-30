import type { Metadata } from "next";
import { Divider } from "@/components/ds/Divider";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { sanityFetch } from "@/sanity/live";
import { GALLERY_QUERY } from "@/sanity/queries";
import { BreadcrumbJsonLd } from "@/components/chrome/JsonLd";

export const metadata: Metadata = {
  title: "Gallery: inside Fatima Karahi",
  description:
    "A look inside Fatima Karahi: charcoal BBQ, slow-cooked karahi, daawat spreads, and the Edmonton dining room where it's all served halal, fresh, and made to order.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const { data } = await sanityFetch({ query: GALLERY_QUERY });
  const galleryTiles = data?.tiles ?? [];

  return (
    <>
      <section className="bg-emerald-deep pb-s8 pt-[calc(84px+var(--s-8))] text-ivory">
        <Reveal className="mx-auto max-w-[620px] px-[clamp(20px,5vw,56px)] text-center">
          <Eyebrow tone="gold" className="justify-center">
            Gallery
          </Eyebrow>
          <h1 className="mb-s4 mt-s4 font-display text-display-l font-normal text-ivory">
            Inside Fatima Karahi
          </h1>
          <Divider width={100} className="mb-s5" />
        </Reveal>
        <Reveal delay={80} className="mx-auto mt-s2 max-w-[680px] px-[clamp(20px,5vw,56px)] text-left">
          <p className="text-body text-sage">
            Fatima Karahi is a halal Pakistani restaurant in Edmonton built around the kind of
            cooking you grow up on: karahi simmered slow, charcoal BBQ finished over open flame,
            and biryani layered the way it&rsquo;s done back home. Every dish you see in this
            gallery reflects our commitment to authentic Pakistani cuisine, made with halal meat,
            hand-ground spices, and recipes passed down through generations. It&rsquo;s the kind
            of food that keeps Edmonton coming back.
          </p>
          <p className="mt-s4 text-body text-sage">
            Beyond the kitchen, our dining room has hosted birthdays, walimas, mehndis, and
            community gatherings for families across Edmonton and beyond. As a premium restaurant
            with room for daawats and private events, we&rsquo;ve built our tables around the idea
            that good food is best shared. These photos capture some of those evenings: full
            spreads, warm lighting, and the kind of hospitality that makes a room feel like home.
          </p>
          <p className="mt-s4 text-body text-sage">
            {/* SEO audit Medium #13: this paragraph repeated "halal Pakistani
                restaurant in Edmonton" for a third time in ~230 words —
                reworded to vary the phrasing instead of restating it. */}
            Whether you&rsquo;re after a quiet dinner or planning a larger celebration, Fatima Karahi
            welcomes you in. This gallery is a small window into what a night with us looks like,
            from the karahi hitting the table to the last cup of chai. Come see it, and taste it,
            for yourself.
          </p>
        </Reveal>
      </section>

      <GalleryGrid tiles={galleryTiles} />
      <BreadcrumbJsonLd name="Gallery" path="/gallery/" />
    </>
  );
}
