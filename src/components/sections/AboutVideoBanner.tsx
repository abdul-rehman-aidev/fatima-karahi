import { Picture } from "@/components/media/Picture";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Full-width signature-dish banner with a centred play button. No video
 * exists yet, so the button is intentionally non-functional (disabled, no
 * href/onClick) rather than wired to a placeholder — flagged in the
 * implementation summary. Swap in a real embed/URL once one is provided.
 */
export function AboutVideoBanner() {
  return (
    <section className="relative h-[42vh] min-h-[320px] overflow-hidden bg-emerald-deep">
      <Picture
        name="food-karahi"
        alt="Chicken karahi finishing in a cast-iron pan over open heat"
        widths={[480, 828, 1200, 1600]}
        sizes="100vw"
        width={1600}
        height={1200}
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--emerald-deep)_45%,transparent)]"
      />
      <div className="relative z-[1] flex h-full items-center justify-center">
        <Reveal>
          <button
            type="button"
            disabled
            aria-label="Video coming soon"
            className="grid h-[72px] w-[72px] cursor-not-allowed place-items-center rounded-pill border-[1.5px] border-[color-mix(in_srgb,var(--ivory)_60%,transparent)] bg-[color-mix(in_srgb,var(--emerald-deep)_40%,transparent)] text-ivory backdrop-blur-[2px]"
          >
            <svg width="22" height="24" viewBox="0 0 22 24" fill="currentColor" aria-hidden="true">
              <path d="M0 0 L22 12 L0 24 Z" />
            </svg>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
