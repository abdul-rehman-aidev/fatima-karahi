import { Divider } from "@/components/ds/Divider";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Picture } from "@/components/media/Picture";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Founder bio + personal vision statement — the About page's closing note.
 * Circular portrait (same treatment as AboutStory's photo) sits beside the
 * name/title, sticky on desktop so it stays in view alongside the longer
 * vision list as the visitor scrolls; stacks above the text on mobile.
 *
 * "MY VISION IS SIMPLE:" is kept as normal-case text with `uppercase` doing
 * the visual all-caps — same approach Eyebrow already uses elsewhere on
 * this site — rather than shouting literal caps into the markup, which
 * reads worse to screen readers for no visual difference.
 *
 * Vision copy is verbatim, client-supplied — do not reword.
 */
const VISION_POINTS = [
  "To bring the authentic taste, warmth, and hospitality of Pakistan to our customers.",
  "We strive every day to serve delicious, traditional Pakistani cuisine prepared with care, quality ingredients, and rich flavours.",
  "For us, it is not only about food — it is about creating an experience where every guest feels welcomed like family.",
  "Our goal is to proudly represent Pakistani cuisine and hospitality and to become one of Canada's leading destinations for authentic Pakistani food.",
];

export function FounderSection() {
  return (
    <section className="bg-ivory py-section text-ink">
      <div className="mx-auto grid max-w-content items-start gap-s8 px-[clamp(20px,5vw,56px)] lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="mx-auto w-[min(300px,72vw)] text-center sm:w-[min(300px,42vw)] lg:sticky lg:top-[132px] lg:w-full lg:max-w-[300px] lg:text-left">
          <div className="relative mx-auto aspect-square w-[min(300px,72vw)] overflow-hidden rounded-full border-[6px] border-cream shadow-lift sm:w-[min(300px,42vw)] lg:mx-0 lg:w-full">
            <Picture
              name="founder"
              alt="Hamza Butt, founder of Fatima Karahi"
              widths={[300, 480, 828]}
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 42vw, 72vw"
              width={1024}
              height={1024}
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover"
            />
          </div>
          <h3 className="m-0 mt-s5 font-display text-[1.6rem] leading-[1.1] text-ink">Hamza Butt</h3>
          <p className="mt-[6px] font-body text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-gold-deep">
            Founder, Fatima Karahi
          </p>
          <p className="mt-[4px] font-body text-[0.85rem] text-stone">
            Franchise owner — Calgary &amp; Edmonton
          </p>
        </Reveal>

        <Reveal delay={80}>
          <Eyebrow tone="stone">From the founder</Eyebrow>
          <h2 className="mb-s5 mt-s4 font-display text-[clamp(1.5rem,2.5vw,2rem)] font-semibold uppercase tracking-[0.03em] text-ink">
            My vision is simple:
          </h2>

          <ol className="m-0 flex list-none flex-col gap-s6 p-0">
            {VISION_POINTS.map((text, i) => (
              <li key={text} className="flex gap-s4">
                <span
                  aria-hidden="true"
                  className="shrink-0 font-display text-[1.75rem] leading-none text-gold-deep"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="m-0 max-w-[56ch] text-body text-stone">{text}</p>
              </li>
            ))}
          </ol>

          <Divider tone="line" width={56} className="my-s7" />

          <p className="m-0 font-editorial text-[1.2rem] italic leading-[1.5] text-ink">
            Thank you to every one of our customers — for the visits, the trust, and the warmth
            you&rsquo;ve shown us. Fatima Karahi exists because you keep coming back to the
            table, and that means everything to our family.
          </p>
          <p className="mt-s3 font-body text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-gold-deep">
            — Hamza Butt
          </p>
        </Reveal>
      </div>
    </section>
  );
}
