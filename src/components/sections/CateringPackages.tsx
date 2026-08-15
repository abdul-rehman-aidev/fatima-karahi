import { Button } from "@/components/ds/Button";
import { Divider } from "@/components/ds/Divider";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { cx } from "@/lib/cx";
import type { CateringPackage } from "@/data/catering";
import { site } from "@/data/site";

/**
 * Five set-menu packages (Basic → Ultimate), client-supplied via PDF. No
 * per-package photo — each card is a plain price/item list, so the tiers
 * have to read as distinct through typography and border weight alone:
 * the gold border tint deepens one step per tier (TIER_BORDER below) and
 * the item count itself grows package to package, so the ladder is visible
 * at a glance even before anyone reads a price. Ultimate additionally gets
 * a solid gold border, a glow, and a "Best Value" tag.
 *
 * Light zone (bg-ivory) on purpose: this sits directly under Occasions,
 * which is already bg-emerald-deep — stacking two flat dark sections with
 * nothing between them reads as one undifferentiated block, and it pairs
 * naturally with "How it works" right after, which is light too.
 */
const TIER_BORDER = [
  "border border-[color-mix(in_srgb,var(--saffron)_25%,transparent)]",
  "border border-[color-mix(in_srgb,var(--saffron)_38%,transparent)]",
  "border border-[color-mix(in_srgb,var(--saffron)_50%,transparent)]",
  "border border-[color-mix(in_srgb,var(--saffron)_65%,transparent)]",
  "border-2 border-gold-deep shadow-card",
];

export function CateringPackages({ packages }: { packages: CateringPackage[] }) {
  return (
    <section id="packages" className="scroll-mt-[84px] bg-ivory py-section text-ink">
      <div className="mx-auto max-w-content px-[clamp(20px,5vw,56px)]">
        <Reveal className="mx-auto mb-s7 max-w-[680px] text-center">
          <Eyebrow tone="stone" className="justify-center">
            Catering packages
          </Eyebrow>
          <h2 className="mb-s4 mt-s4 font-display text-display-l font-normal text-ink">
            Set menus for every size of gathering
          </h2>
          <p className="text-body-l text-stone">
            Every package below is priced per person and covers the full spread, appetizers
            through dessert. Want something custom instead? Fatima Karahi also sends its own
            servers and staff to run service at your event, and can host your gathering right
            here in the restaurant for parties and get-togethers of every size. Call us and
            we&rsquo;ll build something around what you need.
          </p>
          <div className="mt-s6">
            <Button variant="secondary" href={site.phoneHref} external>
              Call {site.phone}
            </Button>
          </div>
        </Reveal>

        {/* 3-up at desktop, not items-start, so the grid's default stretch
            equalizes card height within each row (Basic/Silver/Premium
            together, Golden/Ultimate together) instead of every card being
            its own arbitrary height. A single 5-wide row would make every
            card the exact same height, but at this container width that
            squeezed each card down to ~240px — too narrow to read
            comfortably. Two rows, each internally consistent, is the
            better trade: still noticeably more even than before, without
            cards that narrow. The item <ul> already carries flex-1, so any
            extra height within a row lands as breathing room above the
            button, keeping both cards in a row's CTA aligned. */}
        <div className="grid grid-cols-1 gap-s6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 60}>
              <PackageCard pkg={pkg} tier={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackageCard({ pkg, tier }: { pkg: CateringPackage; tier: number }) {
  return (
    <div
      className={cx(
        "flex h-full flex-col rounded-card bg-cream p-s6 shadow-card",
        TIER_BORDER[tier] ?? TIER_BORDER[0],
      )}
    >
      {pkg.featured && (
        <span className="mb-s4 inline-flex w-fit items-center rounded-pill bg-gold px-s3 py-[4px] font-body text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.1em] text-ink">
          Best Value
        </span>
      )}

      <h3 className="m-0 font-display text-[1.4rem] leading-[1.1] text-ink">{pkg.name}</h3>

      <div className="mt-s3 flex items-baseline gap-[6px]">
        <span className="font-display text-[2.25rem] font-semibold leading-none text-gold-deep">
          ${pkg.pricePerPerson}
        </span>
        <span className="font-body text-[0.85rem] text-stone">/ person</span>
      </div>

      <Divider tone="line" width={56} className="my-s5" />

      <ul className="m-0 flex-1 list-none space-y-[10px] p-0">
        {pkg.items.map((item) => (
          <li key={item} className="flex items-start gap-[8px] font-body text-[0.9rem] leading-[1.4] text-stone">
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Button variant="secondary" href="/catering#quote" className="mt-s6 w-full justify-center">
        Request this package
      </Button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-[2px] shrink-0 text-gold-deep"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
