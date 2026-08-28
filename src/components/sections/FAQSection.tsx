"use client";

import { useState } from "react";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { cx } from "@/lib/cx";
import { faqCategories as defaultCategories, type FaqCategory, type FaqQuestion } from "@/data/faq";

/**
 * Reusable FAQ section — three category blocks, each a ~30/70 two-column
 * layout (label block left, question list right). Rows expand independently
 * (a Set of open indices per category, not a single "which one is open"
 * value like MenuItemsAccordion uses) since the brief calls for every row
 * to toggle on its own rather than closing its siblings.
 *
 * `variant` picks the whole section's colour treatment (background, text,
 * divider tint) from the site's existing tokens — no colours are introduced
 * here beyond what's already in the palette — so this can be dropped into
 * either a light or dark zone later without new styling work.
 */
export function FAQSection({
  variant = "light",
  categories = defaultCategories,
  className,
}: {
  variant?: "light" | "dark";
  categories?: FaqCategory[];
  className?: string;
}) {
  const dark = variant === "dark";

  return (
    <section
      className={cx(
        "py-section",
        dark ? "bg-emerald-deep text-ivory" : "bg-ivory text-ink",
        className,
      )}
    >
      <div className="mx-auto flex max-w-content flex-col gap-s10 px-[clamp(20px,5vw,56px)]">
        {categories.map((category) => (
          <FAQCategoryBlock key={category.heading} category={category} dark={dark} />
        ))}
      </div>
    </section>
  );
}

function FAQCategoryBlock({ category, dark }: { category: FaqCategory; dark: boolean }) {
  return (
    <Reveal className="grid grid-cols-1 gap-s6 lg:grid-cols-[3fr_7fr] lg:gap-s9">
      <div>
        <Eyebrow tone={dark ? "gold" : "stone"}>{category.eyebrow}</Eyebrow>
        <h2
          className={cx(
            "mb-s3 mt-s4 font-display text-display-l font-normal",
            dark ? "text-ivory" : "text-ink",
          )}
        >
          {category.heading}
        </h2>
        <p className={cx("max-w-[38ch] text-body", dark ? "text-sage" : "text-stone")}>
          {category.description}
        </p>
      </div>

      <div
        className={cx(
          "divide-y",
          dark
            ? "divide-[color-mix(in_srgb,var(--emerald-line)_70%,transparent)]"
            : "divide-[color-mix(in_srgb,var(--stone)_18%,transparent)]",
        )}
      >
        {category.questions.map((q, i) => (
          <FAQRow key={q.question} q={q} dark={dark} index={i} categoryId={category.heading} />
        ))}
      </div>
    </Reveal>
  );
}

function FAQRow({
  q,
  dark,
  index,
  categoryId,
}: {
  q: FaqQuestion;
  dark: boolean;
  index: number;
  categoryId: string;
}) {
  const { question, answer, cta } = q;
  const [open, setOpen] = useState(false);
  const slug = categoryId.toLowerCase().replace(/\s+/g, "-");
  const triggerId = `faq-${slug}-trigger-${index}`;
  const panelId = `faq-${slug}-panel-${index}`;

  return (
    <div>
      {/* SEO audit High #1: this was a <span> inside the button — not a
          real heading anywhere in the DOM despite being genuine Q&A content.
          The <h3> wraps the trigger button itself (the standard accessible
          accordion pattern) rather than sitting beside it, so the question
          text is both the heading and the interactive control. (FAQPage
          JSON-LD is intentionally not added here — Google retired FAQ rich
          results for all sites on 2026-05-07, so there's no SERP benefit to
          claim; this fix is for real content structure, not schema.) */}
      <h3 className="m-0">
        <button
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between gap-s4 py-[20px] text-left outline-none focus-visible:[outline:1.5px_solid_var(--focus-ring)] focus-visible:[outline-offset:-2px]"
        >
          <span
            className={cx(
              "font-body text-[1.0625rem] font-medium leading-[1.4]",
              dark ? "text-ivory" : "text-ink",
            )}
          >
            {question}
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            className={cx(
              "shrink-0 text-gold transition-transform duration-[var(--dur)] ease-[var(--ease-soft)]",
              open && "rotate-45",
            )}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="grid transition-[grid-template-rows,opacity] duration-[380ms] ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="min-h-0 overflow-hidden pb-[20px]">
          <p
            className={cx(
              "max-w-[62ch] text-[0.9rem] leading-[1.7]",
              dark ? "text-sage" : "text-stone",
            )}
          >
            {answer}
          </p>
          {cta && (
            <div className="mt-s4">
              <Button
                variant={dark ? "outline" : "secondary"}
                size="sm"
                href={cta.href}
                external={cta.external}
              >
                {cta.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
