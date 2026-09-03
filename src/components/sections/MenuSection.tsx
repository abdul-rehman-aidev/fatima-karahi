"use client";

import { Reveal } from "@/components/motion/Reveal";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { MenuCategory } from "@/sanity/types";
import { MenuItemsDesktop } from "@/components/sections/MenuItemsDesktop";
import { MenuItemsMobile } from "@/components/sections/MenuItemsMobile";

/**
 * One category: centred heading, then either the desktop two-column
 * sticky-image layout or the mobile stacked layout — swapped at the 768px
 * breakpoint (Tailwind's `md`) via a conditionally-mounted subtree. One
 * photo per section (category.image, client-supplied) rather than per dish;
 * sections without a photo (Kids Menu, Breakfast Specials) render the plain
 * list full-width — see MenuItemsDesktop/MenuItemsAccordion.
 */
export function MenuSection({ category }: { category: MenuCategory }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <section
      id={category.categoryId ?? undefined}
      aria-labelledby={`${category.categoryId}-h`}
      className="scroll-mt-[132px] pt-[clamp(2.5rem,5vw,4rem)]"
    >
      <Reveal className="text-center">
        <h2 id={`${category.categoryId}-h`} className="m-0 font-display text-display-m text-ink">
          {category.label}
        </h2>
        <span lang="ur" dir="rtl" className="mt-[6px] block text-[1.3rem] leading-[1.5] text-stone">
          {category.urdu}
        </span>
        {category.note && (
          <p className="mt-s2 font-body text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-gold-deep">
            {category.note}
          </p>
        )}
        <div
          aria-hidden="true"
          className="mx-auto mb-0 mt-s3 h-px w-[64px] bg-[color-mix(in_srgb,var(--saffron)_45%,transparent)]"
        />
      </Reveal>

      <Reveal delay={80}>
        {isDesktop ? (
          <MenuItemsDesktop dishes={category.dishes ?? []} image={category.sectionImage} />
        ) : (
          <MenuItemsMobile dishes={category.dishes ?? []} image={category.sectionImage} />
        )}
      </Reveal>
    </section>
  );
}
