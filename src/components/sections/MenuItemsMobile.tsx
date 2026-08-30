import { SanityPicture } from "@/components/media/SanityPicture";
import { SpiceDots } from "@/components/ds/MenuRow";
import { formatPrice } from "@/lib/format";
import type { Dish, MenuSectionImage } from "@/sanity/types";

/**
 * Mobile layout: one static section photo (if the section has one) above a
 * plain row list. This used to be an expand-to-reveal accordion because each
 * row had its own photo to show; now there's one photo per section instead
 * of per dish, so there's nothing left to reveal per row — every dish's name,
 * price, and description are already shown up front.
 */
export function MenuItemsMobile({ dishes, image }: { dishes: Dish[]; image?: MenuSectionImage | null }) {
  return (
    <div className="mt-s6">
      {image && (
        <div className="relative mb-s6 h-[220px] w-full overflow-hidden rounded-card shadow-card sm:h-[280px]">
          <SanityPicture image={image} alt="" sizes="100vw" className="absolute inset-0" />
        </div>
      )}

      <div className="divide-y divide-[color-mix(in_srgb,var(--stone)_18%,transparent)]">
        {dishes.map((dish) => (
          <MobileRow key={dish._key} dish={dish} />
        ))}
      </div>
    </div>
  );
}

function MobileRow({ dish }: { dish: Dish }) {
  return (
    <div className="flex items-start justify-between gap-s3 py-[16px]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-[10px] gap-y-[4px]">
          {/* Owner feedback (2026-08-26): see MenuItemsDesktop.tsx's matching comment. */}
          <span className="font-display text-[1.2rem] font-bold leading-[var(--lh-title)] text-ink">
            {dish.name}
          </span>
          {dish.urdu && (
            <span lang="ur" dir="rtl" className="text-[1rem] leading-[1.5] text-stone">
              {dish.urdu}
            </span>
          )}
          {dish.signature && (
            <span className="rounded-pill border border-[color-mix(in_srgb,var(--sage-tag)_45%,transparent)] bg-[color-mix(in_srgb,var(--sage-tag)_16%,transparent)] px-s2 py-[2px] font-body text-[0.6rem] font-semibold uppercase leading-none tracking-[0.12em] text-ink">
              Signature
            </span>
          )}
          {dish.spice ? <SpiceDots level={dish.spice} /> : null}
        </div>
        {dish.desc && <p className="mt-[4px] font-body text-[0.8125rem] leading-[1.6] text-stone">{dish.desc}</p>}
      </div>

      <DishPrice dish={dish} />
    </div>
  );
}

/** Single price, or a stacked ½ kg / 1 kg (etc.) tier list for karahi-style dishes. */
function DishPrice({ dish }: { dish: Dish }) {
  if (dish.priceTiers) {
    return (
      <div className="shrink-0 text-right font-display text-[0.85rem] font-semibold text-gold-deep">
        {dish.priceTiers.map((tier) => (
          <div key={tier._key} className="whitespace-nowrap">
            <span className="mr-[4px] font-body text-[0.7rem] font-normal text-stone">{tier.label}</span>
            {formatPrice(tier.price)}
          </div>
        ))}
      </div>
    );
  }
  return (
    <span className="shrink-0 font-display text-[1rem] font-semibold text-gold-deep">
      {dish.price != null ? formatPrice(dish.price) : null}
    </span>
  );
}
