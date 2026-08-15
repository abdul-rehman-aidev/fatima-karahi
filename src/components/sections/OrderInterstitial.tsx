"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "@/components/ds/BrandMark";
import { Button } from "@/components/ds/Button";
import { WhatsAppButton } from "@/components/ds/WhatsAppButton";
import { hasOrderUrl, site } from "@/data/site";

/**
 * The quiet branded interstitial: karahi mark + آرڈر کریں on deep emerald.
 * When the real ordering URL is configured it auto-redirects after a beat
 * (with a visible manual link, and no redirect under reduced motion‑style
 * hesitation for keyboard users mid-navigation). Until then it offers the
 * menu, phone and WhatsApp.
 */
export function OrderInterstitial() {
  const ready = hasOrderUrl();
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    if (!ready) return;
    const tick = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    const go = setTimeout(() => {
      window.location.assign(site.orderUrl);
    }, 3000);
    return () => {
      clearInterval(tick);
      clearTimeout(go);
    };
  }, [ready]);

  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-emerald-deep px-s5 py-[calc(84px+var(--s-6))] text-center">
      <div aria-hidden="true" className="jali absolute inset-0" />
      <div className="relative">
        <div className="mb-s5 flex justify-center text-gold-bright">
          <BrandMark width={64} />
        </div>
        <p lang="ur" dir="rtl" className="mb-s2 text-[2.4rem] leading-[1.5] text-gold-bright">
          آرڈر کریں
        </p>
        <h1 className="m-0 font-display text-display-l font-normal text-ivory">Order online</h1>
        <p className="mx-auto mb-s6 mt-s4 max-w-[40ch] text-body-l text-sage">
          Hot karahi and charcoal BBQ, straight to your door across Edmonton.
        </p>

        {ready ? (
          <>
            <Button variant="primary" size="lg" href={site.orderUrl} external>
              Order on our platform →
            </Button>
            <p aria-live="polite" className="mt-s4 text-[0.9rem] text-sage">
              Taking you to our ordering partner{seconds > 0 ? ` in ${seconds}…` : "…"}
            </p>
          </>
        ) : (
          <>
            {/* TODO(client): set data/site.ts → orderUrl to enable direct online ordering */}
            <p className="mx-auto mb-s5 max-w-[44ch] text-[0.95rem] text-sage">
              Online ordering is almost ready. Until then, call or WhatsApp your order, and
              we&rsquo;ll have it hot when you arrive.
            </p>
            <div className="flex flex-wrap justify-center gap-s4">
              <Button variant="primary" size="lg" href={site.phoneHref} external>
                Call {site.phone}
              </Button>
              <WhatsAppButton label="WhatsApp your order" />
            </div>
          </>
        )}

        <div className="mt-s6">
          <Button variant="ghost" href="/menu">
            Browse the menu first
          </Button>
        </div>
      </div>
    </section>
  );
}
