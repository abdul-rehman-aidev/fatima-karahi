import { Button } from "@/components/ds/Button";
import { Divider } from "@/components/ds/Divider";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SanityPicture } from "@/components/media/SanityPicture";
import { Reveal } from "@/components/motion/Reveal";
import type { SitePhotoPool } from "@/sanity/types";

/**
 * About page story block — eyebrow + heading + 5 short paragraphs (client-
 * supplied final copy) on the left, a circular photo with a small
 * overlapping food photo on the right.
 *
 * The right column is sized as a fraction of viewport width (min(px, vw)),
 * not a fixed px box — a fixed 320/380px circle plus a negative-offset
 * overlap photo doesn't shrink on narrow phones and pushed real horizontal
 * page overflow at 320px viewports (confirmed via layout measurement: content
 * right edge landed 36px past the viewport). Scaling with vw keeps both the
 * circle and its overlap offset proportional so neither can exceed the
 * section's own padding at any width.
 */
export function AboutStory({ photoPool }: { photoPool: SitePhotoPool }) {
  const bbq = photoPool["food-bbq"]?.image;
  const karahi = photoPool["food-karahi"]?.image;

  return (
    <section className="bg-ivory py-section text-ink">
      <div className="mx-auto grid max-w-content items-center gap-s8 px-[clamp(20px,5vw,56px)] lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <Eyebrow tone="stone">Restaurant Life</Eyebrow>
          <h2 className="mb-s4 mt-s4 font-display text-display-l font-normal text-ink">About us</h2>
          <Divider tone="line" width={100} className="mb-s5" />

          {/* SEO audit High #5: this page previously never named a person,
              never mentioned the Lahore → Calgary → Edmonton family history,
              and read as generic "modern Pakistani kitchen" copy that could
              describe any restaurant — the persona-scoring pass independently
              flagged About as the weakest page on the site (42/100) for
              exactly this reason. The real journey already existed on the
              homepage (StoryBand); it's brought here instead of inventing new
              specifics we can't verify. A named founder bio/photo is still a
              TODO(client) — see AUDIT.md — since no real name is on record
              anywhere in this project's source material. */}
          <p className="max-w-[52ch] text-body text-stone">
            Fatima Karahi began in the kitchens of Lahore, grew up in Calgary, and has now brought
            those same recipes to Edmonton. It&rsquo;s a family-owned, family-run kitchen — that
            ownership shapes the recipes and the hospitality alike, not just the name above the
            door.
          </p>
          <p className="mt-s4 max-w-[52ch] text-body text-stone">
            Inspired by generations of family recipes and the vibrant culinary heritage of
            Pakistan, every dish is prepared with purpose, honoring authentic flavors while
            embracing a contemporary dining experience.
          </p>
          <p className="mt-s4 max-w-[52ch] text-body text-stone">
            We believe great food starts with quality ingredients, thoughtful preparation, and
            the joy of sharing a meal. From our signature halal karahis to every handcrafted dish,
            everything is made to bring people together.
          </p>
          <p className="mt-s4 max-w-[52ch] text-body text-stone">
            At Fatima Karahi, you&rsquo;re not just joining us for dinner, you&rsquo;re becoming
            part of a tradition built around warmth, generosity, and unforgettable flavors.
          </p>
          <p className="mt-s4 max-w-[52ch] text-body text-stone">
            Because the best meals aren&rsquo;t just served, they&rsquo;re shared.
          </p>

          <div className="mt-s6 flex flex-wrap gap-s4">
            <Button variant="secondary" href="/menu">
              View menu
            </Button>
            <Button variant="secondary" href="/catering">
              View catering
            </Button>
          </div>
        </Reveal>

        <Reveal delay={100} className="relative mx-auto w-[min(300px,72vw)] sm:w-[min(380px,42vw)]">
          <div className="relative aspect-square overflow-hidden rounded-full border-[6px] border-cream shadow-lift">
            {bbq?.asset && (
              <SanityPicture
                image={bbq}
                alt="Charcoal-grilled BBQ skewers plated for service"
                sizes="(min-width: 640px) 380px, 72vw"
                className="absolute inset-0"
                imgClassName="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="absolute bottom-[-5%] right-[-5%] aspect-square w-[38%] min-w-[90px] overflow-hidden rounded-card border-[3px] border-ivory shadow-lift">
            {karahi?.asset && (
              <SanityPicture
                image={karahi}
                alt="Chicken karahi finishing in a cast-iron pan over open heat"
                sizes="140px"
                className="absolute inset-0"
                imgClassName="h-full w-full object-cover"
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
