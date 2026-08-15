import Link from "next/link";
import { Picture } from "@/components/media/Picture";
import { cx } from "@/lib/cx";

/**
 * OccasionCard — editorial occasion vignette for catering, never a
 * pricing-tier card. Full-bleed image under a bottom emerald scrim,
 * Urdu + Fraunces name, gold "from $X/person". Image zooms 1.04 on hover.
 */
export function OccasionCard({
  name,
  urdu,
  from,
  image,
  alt,
  height = "md",
  className,
}: {
  name: string;
  urdu?: string;
  from?: string;
  image: string;
  alt: string;
  height?: "md" | "lg";
  className?: string;
}) {
  return (
    <Link
      href="/catering#quote"
      className={cx(
        "group relative block overflow-hidden rounded-card no-underline shadow-card transition-shadow duration-[var(--dur)] ease-[var(--ease-soft)] hover:shadow-lift",
        height === "lg" ? "h-[300px] sm:h-[340px]" : "h-[260px] sm:h-[300px]",
        className,
      )}
    >
      <Picture
        name={image}
        alt={alt}
        widths={[480, 828, 1200]}
        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
        width={1200}
        height={1500}
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--emerald-deep)_5%,transparent)_0%,color-mix(in_srgb,var(--emerald-deep)_82%,transparent)_100%)]"
      />
      <div className="absolute inset-x-0 bottom-0 p-s5">
        {urdu && (
          <div lang="ur" dir="rtl" className="mb-s1 text-[1.4rem] leading-[1.5] text-gold-bright">
            {urdu}
          </div>
        )}
        <div className="font-display text-[1.6rem] leading-[1.05] text-ivory">{name}</div>
        {from && (
          <div className="mt-s2 inline-flex items-center gap-s2 font-body text-eyebrow font-semibold uppercase tracking-[0.08em] text-gold">
            <span aria-hidden="true" className="h-px w-[18px] bg-gold" />
            from {from}
          </div>
        )}
      </div>
    </Link>
  );
}
