"use client";

import { useState } from "react";
import { Button } from "@/components/ds/Button";
import { Field } from "@/components/ds/Field";
import { site } from "@/data/site";
import { submitForm } from "@/lib/forms";
import { cx } from "@/lib/cx";

const PARTY_SIZES = [
  "1 person",
  "2 people",
  "3 people",
  "4 people",
  "5 people",
  "6 people",
  "7 people",
  "8+ people",
];

type Values = {
  name: string;
  phone: string;
  party: string;
  date: string;
  time: string;
  message: string;
  company: string; // honeypot
};

const EMPTY: Values = {
  name: "",
  phone: "",
  party: PARTY_SIZES[1],
  date: "",
  time: "",
  message: "",
  company: "",
};

/**
 * Table reservation request. Same shared-endpoint pattern as QuoteForm and
 * ContactForm (submitForm() from lib/forms.ts — simulated locally with a
 * console warning until NEXT_PUBLIC_FORM_ENDPOINT is set).
 *
 * `variant` follows Field's light/dark split: "dark" for the homepage's
 * espresso reservation card, "light" for the contact page's cream card.
 * `bare` drops this component's own card chrome (rounded corners, shadow,
 * background, padding) for the homepage placement, where it sits as the
 * left half of a shared two-column card the *parent* owns — the contact
 * page placement keeps `bare=false` (the default) for a fully self-contained
 * card, the same way ContactForm's card is built one level up in
 * contact/page.tsx today.
 */
export function ReservationForm({
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
    if (!values.name.trim()) next.name = "We need a name for the reservation.";
    if (!/^[+\d][\d\s().-]{6,}$/.test(values.phone.trim()))
      next.phone = "Enter a phone number we can reach you on.";
    if (!values.date) next.date = "Pick a date.";
    else if (values.date < new Date().toISOString().slice(0, 10))
      next.date = "That date has passed; pick an upcoming one.";
    if (!values.time) next.time = "Pick a time.";
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
      await submitForm("reservation", {
        name: values.name,
        phone: values.phone,
        party: values.party,
        date: values.date,
        time: values.time,
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
          We&rsquo;ll confirm your table within 4 hours.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className={cx(cardCls, className)}>
      <h3 className={cx("m-0 font-display text-[1.4rem] font-normal", heading)}>
        Online Reservation
      </h3>
      <p className={cx("mb-s5 mt-s2 text-[0.9rem]", sub)}>
        Booking request {site.phone} or fill out the form below.
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
            id="reservation-name"
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
            id="reservation-phone"
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

        <div className="grid grid-cols-1 gap-s4 sm:grid-cols-3">
          <Field
            id="reservation-party"
            label="Party size"
            select
            variant={variant}
            options={PARTY_SIZES.map((p) => ({ value: p, label: p }))}
            value={values.party}
            onChange={(e) => set("party", e.target.value)}
          />
          <Field
            id="reservation-date"
            label="Date"
            type="date"
            variant={variant}
            required
            min={new Date().toISOString().slice(0, 10)}
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
            error={errors.date}
          />
          <Field
            id="reservation-time"
            label="Time"
            type="time"
            variant={variant}
            required
            value={values.time}
            onChange={(e) => set("time", e.target.value)}
            error={errors.time}
          />
        </div>

        <Field
          id="reservation-message"
          label="Message"
          textarea
          variant={variant}
          placeholder="Anything we should know? (optional)"
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />

        {/* Honeypot — hidden from real users and assistive tech */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="reservation-company">Company</label>
          <input
            id="reservation-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>

        <Button variant="primary" type="submit" size="lg" disabled={status === "submitting"} className="w-full">
          {status === "submitting" ? "Sending…" : "Reserve a Table"}
        </Button>
      </div>
    </form>
  );
}
