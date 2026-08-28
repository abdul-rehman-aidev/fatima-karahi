import { Eyebrow } from "@/components/ds/Eyebrow";
import { StatCounter } from "@/components/ds/StatCounter";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Kitchen team credibility section — closes out the About page. No
 * individual chef names or photos exist to work with (unlike the founder),
 * so this stays a collective description backed by two real numbers rather
 * than inventing bios or stock "chef" photography for people who don't
 * exist here. Same count-up StatCounter used in the homepage's TrustBand,
 * reused for a different pair of numbers.
 */
export function TeamSection() {
  return (
    <section className="border-t-[0.5px] border-[color-mix(in_srgb,var(--stone)_14%,transparent)] bg-cream py-section text-ink">
      <div className="mx-auto max-w-[720px] px-[clamp(20px,5vw,56px)] text-center">
        <Reveal>
          <Eyebrow tone="stone" className="justify-center">
            Our team
          </Eyebrow>
          <h2 className="mb-s4 mt-s4 font-display text-display-l font-normal text-ink">
            A kitchen built on real experience
          </h2>
          <p className="mx-auto max-w-[56ch] text-body text-stone">
            Every dish at Fatima Karahi comes from chefs with real, hands-on experience cooking
            authentic Pakistani cuisine, several of whom trained and worked inside some of
            Pakistan&rsquo;s most well-known restaurants before joining our kitchen here in
            Canada. It&rsquo;s a dedicated team, and that experience is exactly why every karahi,
            kebab, and biryani tastes the way it should.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-s7 grid grid-cols-2 gap-s7">
          <StatCounter variant="light" value={10} suffix="+" label="Years, minimum chef experience" />
          <StatCounter variant="light" value={20} suffix="+" label="Years for our senior chefs" />
        </Reveal>
      </div>
    </section>
  );
}
