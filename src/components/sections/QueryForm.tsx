"use client";

import { useState } from "react";
import { Button } from "@/components/ds/Button";
import { Field } from "@/components/ds/Field";
import { site } from "@/data/site";
import { submitForm } from "@/lib/forms";
import { cx } from "@/lib/cx";

type Values = {
  name: string;
  phone: string;
  message: string;
  company: string; // honeypot
};

const EMPTY: Values = {
  name: "",
  phone: "",
  message: "",
  company: "",
};

/**
 * General query / "reach out for anything" form. Replaces the old
 * ReservationForm — the restaurant doesn't want an online table-booking
 * system, so this collects a name, a phone number, and an open message
 * instead of party size/date/time, and submits under the "query" FormKind.
 * Same shared-endpoint pattern as QuoteForm and ContactForm (submitForm()
 * from lib/forms.ts — simulated locally with a console warning until
 * NEXT_PUBLIC_FORM_ENDPOINT is set).
 *
 * `variant` follows Field's light/dark split: "dark" for the homepage's
 * espresso query card, "light" for the contact page's cream card. `bare`
 * drops this component's own card chrome (rounded corners, shadow,
 * background, padding) for the homepage placement, where it sits as the
 * left half of a shared two-column card the *parent* owns — other
 * placements keep `bare=false` (the default) for a fully self-contained
 * card.
 */
export function QueryForm({
  variant = "dark",
  bare = false,
  className,
}: {
  variant?: "light" | "dark";
  bare?: boolean;
  className?: string;
}) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const set = (key: keyof Values, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof Values, string>> = {};
    if (!values.name.trim()) next.name = "We need a name to get back to you.";
    if (!/^[+\d][\d\s().-]{6,}$/.test(values.phone.trim()))
      next.phone = "Enter a phone number we can reach you on.";
    if (!values.message.trim()) next.message = "Add a short message so we know how to help.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (values.company) {
      setStatus("success"); // honeypot tripped — pretend success, send nothing
      return;
    }
    setStatus("submitting");
    try {
      await submitForm("query", {
        name: values.name,
        phone: values.phone,
        message: values.message,
      });
      setStatus("success");
    } catch {
      setStatus("error"); // field values are preserved in state
    }
  };

  const cardCls = bare
    ? ""
    : cx(
        "rounded-card p-[clamp(20px,4vw,40px)] shadow-card",
        variant === "dark" ? "bg-sage-tag" : "bg-cream",
      );

  const heading = variant === "dark" ? "text-ivory" : "text-ink";
  // text-sage (2.1:1) fails badly against the card's sage-tag background —
  // too close in luminance to its own name-sake token. Ivory is the
  // approved-palette colour that actually holds up here (~4.1:1).
  const sub = variant === "dark" ? "text-ivory" : "text-stone";

  if (status === "success") {
    return (
      <div className={cx(cardCls, "text-center", className)}>
        <h3 className={cx("m-0 font-editorial text-[1.5rem] italic", heading)}>
          Shukriya, we&rsquo;ve got it.
        </h3>
        <p className={cx("mb-0 mt-s2 text-[0.95rem]", sub)}>
          We&rsquo;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className={cx(cardCls, className)}>
      <h3 className={cx("m-0 font-display text-[1.4rem] font-normal", heading)}>
        Get in Touch
      </h3>
      <p className={cx("mb-s5 mt-s2 text-[0.9rem]", sub)}>
        Questions, feedback, or anything else — call {site.phone} or fill out the form below.
      </p>

      {status === "error" && (
        <div
          role="alert"
          className="mb-s4 rounded-input border border-spice bg-[color-mix(in_srgb,var(--spice)_8%,transparent)] px-s4 py-s3 text-[0.9rem] text-spice"
        >
          We couldn&rsquo;t send that just now, but nothing you typed was lost. Please try again, or
          call us directly.
        </div>
      )}

      <div className="grid gap-s4">
        <div className="grid grid-cols-1 gap-s4 sm:grid-cols-2">
          <Field
            id="query-name"
            label="Name"
            variant={variant}
            placeholder="e.g. Ayesha Khan"
            required
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            error={errors.name}
          />
          <Field
            id="query-phone"
            label="Phone number"
            type="tel"
            inputMode="tel"
            variant={variant}
            placeholder="+1 780 …"
            required
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            error={errors.phone}
          />
        </div>

        <Field
          id="query-message"
          label="Message"
          textarea
          variant={variant}
          placeholder="How can we help?"
          required
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          error={errors.message}
        />

        {/* Honeypot — hidden from real users and assistive tech */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="query-company">Company</label>
          <input
            id="query-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>

        <Button variant="primary" type="submit" size="lg" disabled={status === "submitting"} className="w-full">
          {status === "submitting" ? "Sending…" : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
