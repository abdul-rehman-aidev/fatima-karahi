import { Picture } from "@/components/media/Picture";
import { cx } from "@/lib/cx";

/**
 * DishCard — the Signature-rail card: large imagery in a fixed frame,
 * dish name (Fraunces) + Urdu, one evocative line. Image zooms 1.04 on
 * hover inside the frame; caption lifts. Built for emerald zones.
 * Stagger tall/short in a horizontal rail — never a uniform card grid.
 */
export function DishCard({
  name,
  urdu,
  line,
  image,
  alt,
  tall = false,
  className,
}: {
  name: string;
  urdu?: string;
  line?: string;
  image: string;
  alt: string;
  tall?: boolean;
  className?: string;
}) {
  return (
    <figure className={cx("group m-0 w-[280px] flex-none sm:w-[340px]", className)}>
      <div
        className={cx(
          "relative overflow-hidden rounded-card shadow-card transition-shadow duration-[var(--dur)] ease-[var(--ease-soft)] group-hover:shadow-lift",
          tall ? "h-[400px] sm:h-[460px]" : "h-[330px] sm:h-[380px]",
        )}
      >
        <Picture
          name={image}
          alt={alt}
          widths={[480, 828, 1200]}
          sizes="(min-width: 640px) 340px, 280px"
          width={1200}
          height={1500}
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,color-mix(in_srgb,var(--emerald-deep)_70%,transparent)_100%)]"
        />
        {urdu && (
          <div
            lang="ur"
            dir="rtl"
            className="absolute top-[18px] right-[20px] text-[1.5rem] leading-[1.5] text-gold-bright"
          >
            {urdu}
          </div>
        )}
      </div>
      <figcaption className="mt-s4 transition-transform duration-[var(--dur)] ease-[var(--ease-out)] group-hover:-translate-y-[2px]">
        <div className="font-display text-[1.6rem] leading-[1.05] text-ivory">{name}</div>
        {line && (
          <p className="mt-[6px] max-w-[34ch] font-body text-[0.95rem] leading-[1.5] text-sage">
            {line}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
