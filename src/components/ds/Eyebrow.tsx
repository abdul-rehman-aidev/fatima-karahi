import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Eyebrow — the tracked-caps section kicker ("From Lahore to Edmonton").
 * Gold by default; sage over busy imagery; stone on light zones.
 */
const tones = {
  gold: "text-gold",
  sage: "text-sage",
  stone: "text-stone",
};

export function Eyebrow({
  children,
  tone = "gold",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-[10px] font-body text-eyebrow font-semibold uppercase",
        tones[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-s5 bg-current opacity-70" />
      {children}
    </span>
  );
}
