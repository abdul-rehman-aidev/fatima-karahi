import type { Metadata } from "next";
import { BrandMark } from "@/components/ds/BrandMark";
import { Button } from "@/components/ds/Button";

// SEO audit Low #7 — was inheriting the site default title instead of its
// own distinct "Page not found" title.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-emerald-deep px-s5 py-[calc(84px+var(--s-6))] text-center">
      <div aria-hidden="true" className="jali absolute inset-0" />
      <div className="relative">
        <div className="mb-s5 flex justify-center text-gold">
          <BrandMark width={56} />
        </div>
        <h1 className="m-0 font-display text-display-l font-normal text-ivory">
          This table isn&rsquo;t set yet.
        </h1>
        <p className="mx-auto mb-s6 mt-s4 max-w-[40ch] text-body-l text-sage">
          The page you&rsquo;re looking for doesn&rsquo;t exist, but the dastarkhwan is laid a few
          steps away.
        </p>
        <div className="flex flex-wrap justify-center gap-s4">
          <Button variant="primary" href="/">
            Back to the start
          </Button>
          <Button variant="outline" href="/menu">
            See the menu
          </Button>
        </div>
      </div>
    </section>
  );
}
