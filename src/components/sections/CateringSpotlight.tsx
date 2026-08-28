import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { OccasionCard } from "@/components/ds/OccasionCard";
import { Reveal } from "@/components/motion/Reveal";
import { cateringPackages, occasions } from "@/data/catering";
import { site } from "@/data/site";

/**
 * Catering spotlight — the money goal, pulled high on the page.
 * Ivory (conversion) zone; asymmetric occasion vignettes, one gold CTA.
 */
export function CateringSpotlight() {
  const featured = occasions.filter((o) => o.id !== "community");
  // Occasions no longer carry their own placeholder pricing — the real
  // number now comes from the cheapest catering package (Basic, $30/person).
  const startingPrice = cateringPackages[0].pricePerPerson;

  return (
    <section className="bg-ivory py-section text-ink">
      <div className="mx-auto max-w-content px-[clamp(20px,5vw,56px)]">
        <Reveal className="mb-s7 max-w-[560px]">
          <Eyebrow tone="stone">Cater your daawat</Eyebrow>
          <h2 className="mb-s4 mt-s4 font-display text-display-l font-normal text-ink">
            Bring Pakistan to your table
          </h2>
          <p className="text-body-l text-stone">
            From corporate lunches to walima feasts, slow-cooked, delivered and set up.{" "}
            {site.replyPromise}.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-s4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((o, i) => (
            <Reveal key={o.id} delay={i * 60} className={i % 2 === 1 ? "lg:mt-s7" : ""}>
              <OccasionCard name={o.name} urdu={o.urdu} image={o.image} alt={`${o.name} catering`} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-s7 flex flex-wrap items-center gap-s4">
          <Button variant="primary" size="lg" href="/catering#quote">
            Request a catering quote
          </Button>
          <span className="text-[0.9rem] text-stone">
            Packages from ${startingPrice}/person · {site.replyPromise}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
