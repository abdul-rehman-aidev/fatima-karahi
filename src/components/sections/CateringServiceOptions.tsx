import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Picture } from "@/components/media/Picture";
import { Reveal } from "@/components/motion/Reveal";
import type { CateringServiceOption } from "@/data/catering";

/**
 * The two ways to cater with us, up top before anything else — packages,
 * pricing, and the quote form downstream all assume the visitor already
 * knows whether they mean "host it here" or "deliver it there," so this
 * establishes that split first. Each card's CTA scrolls to the same #quote
 * form the rest of the page uses — QuoteForm's own new first step ("Which
 * service works for you?") is what actually records the choice, so this
 * section doesn't need its own separate form.
 */
export function CateringServiceOptions({ options }: { options: CateringServiceOption[] }) {
  return (
    <section className="bg-ivory py-section text-ink">
      <div className="mx-auto max-w-content px-[clamp(20px,5vw,56px)]">
        <Reveal className="mx-auto mb-s7 max-w-[600px] text-center">
          <Eyebrow tone="stone" className="justify-center">
            How we cater
          </Eyebrow>
          <h2 className="mb-s4 mt-s4 font-display text-display-l font-normal text-ink">
            Two ways to bring Fatima Karahi to your event
          </h2>
          <p className="text-body-l text-stone">
            Host it with us, or have us come to you — either way, it&rsquo;s the same kitchen.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-s6 sm:grid-cols-2">
          {options.map((option, i) => (
            <Reveal key={option.id} delay={i * 80}>
              <ServiceCard option={option} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ option }: { option: CateringServiceOption }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card border border-[color-mix(in_srgb,var(--stone)_14%,transparent)] bg-cream shadow-card">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Picture
          name={option.image}
          alt={option.heading}
          widths={[480, 828, 1200]}
          sizes="(min-width: 640px) 50vw, 100vw"
          width={1200}
          height={1500}
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-s6">
        <h3 className="m-0 font-display text-[1.4rem] leading-[1.15] text-ink">{option.heading}</h3>
        <p className="mt-s3 flex-1 max-w-[42ch] text-[0.9375rem] leading-[1.6] text-stone">
          {option.body}
        </p>
        <div className="mt-s5">
          <Button variant="secondary" href="/catering#quote">
            {option.ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
