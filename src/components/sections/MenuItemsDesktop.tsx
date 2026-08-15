import { Picture } from "@/components/media/Picture";
import { SpiceDots } from "@/components/ds/MenuRow";
import { cx } from "@/lib/cx";
import type { Dish } from "@/data/menu";

/**
 * Desktop layout: one static section photo sticky on the left (client-
 * supplied per menu section, not per dish — see data/menu.ts), a plain row
 * list on the right. Sections with no photo (Kids Menu, Breakfast Specials)
 * render the list full-width instead of leaving an empty column.
 */
export function MenuItemsDesktop({ dishes, image }: { dishes: Dish[]; image?: string }) {
  return (
    <div className={cx("mt-s6 grid items-start gap-s7", image ? "grid-cols-2" : "grid-cols-1")}>
      {image && (
        <div className="sticky top-[100px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card shadow-card">
            <Picture
              name={image}
              alt=""
              widths={[480, 828, 1200]}
              sizes="(min-width: 1024px) 38vw, 45vw"
              width={1200}
              height={1500}
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="divide-y divide-[color-mix(in_srgb,var(--stone)_18%,transparent)]">
        {dishes.map((dish) => (
          <DesktopRow key={dish.name} dish={dish} />
        ))}
      </div>
    </div>
  );
}

function DesktopRow({ dish }: { dish: Dish }) {
  return (
    <div className="py-[18px] pl-s4 pr-s3">
      <div className="flex items-start justify-between gap-s4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-[10px] gap-y-[4px]">
            <span className="font-display text-[1.15rem] font-semibold leading-[var(--lh-title)] text-ink">
              {dish.name}
            </span>
            {dish.urdu && (
              <span lang="ur" dir="rtl" className="text-[1.05rem] leading-[1.5] text-stone">
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
          {dish.desc && (
            <p className="mt-[4px] max-w-[48ch] font-body text-[0.875rem] leading-[1.6] text-stone">{dish.desc}</p>
          )}
        </div>
        <DishPrice dish={dish} />
      </div>
    </div>
  );
}

/** Single price, or a stacked ½ kg / 1 kg (etc.) tier list for karahi-style dishes. */
function DishPrice({ dish }: { dish: Dish }) {
  if (dish.priceTiers) {
    return (
      <div className="shrink-0 text-right font-display text-[0.9rem] font-semibold text-gold-deep">
        {dish.priceTiers.map((tier) => (
          <div key={tier.label} className="whitespace-nowrap">
            <span className="mr-[6px] font-body text-[0.75rem] font-normal text-stone">{tier.label}</span>
            {tier.price}
          </div>
        ))}
      </div>
    );
  }
  return <span className="shrink-0 font-display text-[1.05rem] font-semibold text-gold-deep">{dish.price}</span>;
}
