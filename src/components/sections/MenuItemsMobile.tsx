import { Picture } from "@/components/media/Picture";
import { SpiceDots } from "@/components/ds/MenuRow";
import type { Dish } from "@/data/menu";

/**
 * Mobile layout: one static section photo (if the section has one) above a
 * plain row list. This used to be an expand-to-reveal accordion because each
 * row had its own photo to show; now there's one photo per section instead
 * of per dish, so there's nothing left to reveal per row — every dish's name,
 * price, and description are already shown up front.
 */
export function MenuItemsMobile({ dishes, image }: { dishes: Dish[]; image?: string }) {
  return (
    <div className="mt-s6">
      {image && (
        <div className="mb-s6 overflow-hidden rounded-card shadow-card">
          <Picture
            name={image}
            alt=""
            widths={[480, 828]}
            sizes="100vw"
            width={1200}
            height={1500}
            imgClassName="h-[220px] w-full object-cover sm:h-[280px]"
          />
        </div>
      )}

      <div className="divide-y divide-[color-mix(in_srgb,var(--stone)_18%,transparent)]">
        {dishes.map((dish) => (
          <MobileRow key={dish.name} dish={dish} />
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
          <span className="font-display text-[1.1rem] font-semibold leading-[var(--lh-title)] text-ink">
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
        {dish.desc && <p className="mt-[4px] font-body text-[0.875rem] leading-[1.6] text-stone">{dish.desc}</p>}
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
          <div key={tier.label} className="whitespace-nowrap">
            <span className="mr-[4px] font-body text-[0.7rem] font-normal text-stone">{tier.label}</span>
            {tier.price}
          </div>
        ))}
      </div>
    );
  }
  return <span className="shrink-0 font-display text-[1rem] font-semibold text-gold-deep">{dish.price}</span>;
}
