"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ds/Button";
import { Divider } from "@/components/ds/Divider";
import { Field } from "@/components/ds/Field";
import { WhatsAppButton } from "@/components/ds/WhatsAppButton";
import { cateringServiceOptions, quoteOccasions } from "@/data/catering";
import { site } from "@/data/site";
import { submitForm } from "@/lib/forms";
import { cx } from "@/lib/cx";

/**
 * The catering conversion centrepiece: a five-step quote form with the gold
 * progress rail and the emerald "Shukriya" success state.
 * - client-side validation with branded (spice) error states
 * - keyboard/screen-reader complete: step heading receives focus on change,
 *   errors are announced, progress is an ordered list with aria-current
 * - user input is never lost on a failed submit
 *
 * Step 0 (service type: in-house vs. outside/delivery) exists because the
 * page now leads with that choice (see CateringServiceOptions) — every card
 * there points here, so this is the one place that actually records which
 * one the visitor wants, rather than a second, separate contact form.
 */

const STEPS = ["Service", "Event type", "Guest count", "Date", "Your details"] as const;

const MIN_GUESTS = 25;
const MAX_GUESTS = 2500;
const LEAD_DAYS = 2;

/** Earliest bookable event date (today + LEAD_DAYS), as YYYY-MM-DD. */
function minEventDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + LEAD_DAYS);
  return d.toISOString().slice(0, 10);
}

type Values = {
  service: string;
  occasion: string;
  /** free-text detail when occasion === "Other" — optional, never validated */
  occasionOther: string;
  guests: string;
  date: string;
  name: string;
  phone: string;
  company: string; // honeypot — real users never see or fill this
};

const EMPTY: Values = {
  service: "",
  occasion: "",
  occasionOther: "",
  guests: "",
  date: "",
  name: "",
  phone: "",
  company: "",
};

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const set = (key: keyof Values, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateStep = (s: number): boolean => {
    const next: Partial<Record<keyof Values, string>> = {};
    if (s === 0 && !values.service) {
      next.service = "Let us know if this is in-house or a delivery, so we quote the right thing.";
    }
    if (s === 1 && !values.occasion) {
      next.occasion = "Choose an occasion so we can shape the menu.";
    }
    if (s === 2) {
      const n = Number(values.guests);
      if (!values.guests.trim()) next.guests = "A rough guest count helps us quote accurately.";
      else if (!Number.isFinite(n)) next.guests = "Please enter a number of guests.";
      else if (n < MIN_GUESTS)
        next.guests = `We cater from ${MIN_GUESTS} guests up. For anything smaller, give us a call.`;
      else if (n > MAX_GUESTS)
        next.guests = `We cater up to ${MAX_GUESTS.toLocaleString()} guests. For anything larger, please call us directly.`;
    }
    if (s === 3) {
      // Optional — an event date isn't required to request a quote. If one
      // is given, it just needs to clear our minimum catering lead time.
      if (values.date && values.date < minEventDate())
        next.date = `We need at least ${LEAD_DAYS} days' notice for catering orders. Please pick a later date.`;
    }
    if (s === 4) {
      if (!values.name.trim()) next.name = "We need a name to address the quote to.";
      if (!/^[+\d][\d\s().-]{6,}$/.test(values.phone.trim()))
        next.phone = "Enter a phone or WhatsApp number we can reach you on.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goTo = (s: number) => {
    setStep(s);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const onContinue = () => {
    if (validateStep(step)) goTo(step + 1);
  };

  const onSubmit = async () => {
    if (!validateStep(4)) return;
    if (values.company) {
      // honeypot tripped — pretend success, send nothing
      setStatus("success");
      return;
    }
    setStatus("submitting");
    try {
      await submitForm("catering-quote", {
        service: values.service,
        occasion: values.occasion,
        occasionOther: values.occasionOther,
        guests: values.guests,
        date: values.date,
        name: values.name,
        phone: values.phone,
      });
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus("error"); // field values are preserved in state
    }
  };

  if (status === "success") {
    // "Other" reads oddly on its own ("...for your other.") — swap in
    // whatever the visitor typed, if anything, and fall back to "event"
    // rather than the raw category name.
    const occasionLabel =
      values.occasion === "Other"
        ? values.occasionOther.trim() || "event"
        : values.occasion || "event";
    return (
      <div className="rounded-card bg-emerald p-[clamp(28px,5vw,48px)] text-center shadow-card">
        <Divider width={120} className="mb-s4" />
        <h3
          ref={successRef}
          tabIndex={-1}
          className="m-0 font-editorial text-[1.8rem] italic leading-[1.25] text-ivory outline-none"
        >
          Shukriya, we&rsquo;ve got it.
        </h3>
        <p className="mb-s5 mt-s3 text-sage">
          We&rsquo;ll reply within 4 hours with a tailored Lahori menu for your{" "}
          {occasionLabel.toLowerCase()}.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setValues(EMPTY);
            setErrors({});
            setStatus("idle");
            goTo(0);
          }}
        >
          Start another request
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step < STEPS.length - 1) onContinue();
        else void onSubmit();
      }}
      className="rounded-card border border-[color-mix(in_srgb,var(--stone)_14%,transparent)] bg-ivory p-[clamp(20px,4vw,40px)] shadow-card"
    >
      {/* Gold progress rail */}
      <ol className="mb-s6 flex gap-s2" aria-label="Quote request steps">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1" aria-current={i === step ? "step" : undefined}>
            <div
              aria-hidden="true"
              className={cx(
                "h-[3px] rounded-[2px] transition-colors duration-[var(--dur)]",
                i <= step ? "bg-gold" : "bg-[color-mix(in_srgb,var(--stone)_22%,transparent)]",
              )}
            />
            <span
              className={cx(
                "mt-s2 block text-[0.6875rem] font-semibold uppercase tracking-[0.1em]",
                i === step ? "text-ink" : "text-stone",
              )}
            >
              {s}
            </span>
          </li>
        ))}
      </ol>

      {status === "error" && (
        <div
          role="alert"
          className="mb-s5 rounded-input border border-spice bg-[color-mix(in_srgb,var(--spice)_8%,transparent)] px-s4 py-s3 text-[0.9rem] text-spice"
        >
          We couldn&rsquo;t send that just now, but nothing you typed was lost. Please try again, or
          reach us on WhatsApp below.
        </div>
      )}

      <div className="min-h-[170px]">
        {step === 0 && (
          <fieldset className="m-0 border-0 p-0">
            <legend
              ref={headingRef as never}
              tabIndex={-1}
              className="mb-s4 p-0 font-display text-[1.4rem] text-ink outline-none"
            >
              Which service works for you?
            </legend>
            <div className="flex flex-wrap gap-[10px]">
              {cateringServiceOptions.map((o) => {
                const picked = values.service === o.name;
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={picked}
                    onClick={() => set("service", o.name)}
                    className={cx(
                      "cursor-pointer rounded-pill border px-s5 py-s3 font-body text-[0.95rem] font-semibold text-ink transition-[background-color,border-color] duration-[var(--dur)] ease-[var(--ease-soft)]",
                      picked
                        ? "border-gold bg-[color-mix(in_srgb,var(--saffron)_16%,transparent)]"
                        : "border-[color-mix(in_srgb,var(--stone)_26%,transparent)] bg-transparent hover:border-gold",
                    )}
                  >
                    {o.name === "In-House" ? "In-house at the restaurant" : "Delivery / off-site"}
                  </button>
                );
              })}
            </div>
            {errors.service && (
              <p role="alert" className="mt-s3 text-[0.8125rem] font-medium text-spice">
                {errors.service}
              </p>
            )}
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="m-0 border-0 p-0">
            <legend
              ref={headingRef as never}
              tabIndex={-1}
              className="mb-s4 p-0 font-display text-[1.4rem] text-ink outline-none"
            >
              What are we cooking for?
            </legend>
            <div className="flex flex-wrap gap-[10px]">
              {quoteOccasions.map((o) => {
                const picked = values.occasion === o;
                return (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={picked}
                    onClick={() => set("occasion", o)}
                    className={cx(
                      "cursor-pointer rounded-pill border px-s5 py-s3 font-body text-[0.95rem] font-semibold text-ink transition-[background-color,border-color] duration-[var(--dur)] ease-[var(--ease-soft)]",
                      picked
                        ? "border-gold bg-[color-mix(in_srgb,var(--saffron)_16%,transparent)]"
                        : "border-[color-mix(in_srgb,var(--stone)_26%,transparent)] bg-transparent hover:border-gold",
                    )}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
            {errors.occasion && (
              <p role="alert" className="mt-s3 text-[0.8125rem] font-medium text-spice">
                {errors.occasion}
              </p>
            )}
            {values.occasion === "Other" && (
              <Field
                id="occasionOther"
                label="What kind of event? (optional)"
                placeholder="e.g. graduation, retirement, anniversary…"
                className="mt-s4"
                value={values.occasionOther}
                onChange={(e) => set("occasionOther", e.target.value)}
              />
            )}
          </fieldset>
        )}

        {step === 2 && (
          <div>
            <h3 ref={headingRef} tabIndex={-1} className="sr-only outline-none">
              Guest count
            </h3>
            <Field
              id="guests"
              label="Roughly how many guests?"
              placeholder="e.g. 120"
              inputMode="numeric"
              hint="An estimate is fine — we cater anywhere from 25 to 2,500 guests."
              required
              value={values.guests}
              onChange={(e) => set("guests", e.target.value)}
              error={errors.guests}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 ref={headingRef} tabIndex={-1} className="sr-only outline-none">
              Event date
            </h3>
            <Field
              id="date"
              label="When is your event? (optional)"
              type="date"
              hint={`We need at least ${LEAD_DAYS} days' notice. Don't have a date yet? Leave it blank and continue.`}
              min={minEventDate()}
              value={values.date}
              onChange={(e) => set("date", e.target.value)}
              error={errors.date}
            />
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-s4">
            <h3 ref={headingRef} tabIndex={-1} className="sr-only outline-none">
              Your details
            </h3>
            <Field
              id="name"
              label="Your name"
              placeholder="e.g. Ayesha Khan"
              required
              autoComplete="name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              error={errors.name}
            />
            <Field
              id="phone"
              label="Phone or WhatsApp"
              type="tel"
              inputMode="tel"
              placeholder="+1 780 …"
              required
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              error={errors.phone}
            />
            {/* Honeypot — hidden from real users and assistive tech */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-s6 flex flex-wrap items-center justify-between gap-s4">
        <div>
          {step > 0 && (
            <Button variant="ghost-light" onClick={() => goTo(step - 1)}>
              ← Back
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-s3">
          <WhatsAppButton tone="dark" label="Quick inquiry" />
          {step < STEPS.length - 1 ? (
            <Button variant="primary" type="submit">
              Continue
            </Button>
          ) : (
            <Button variant="primary" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Send request"}
            </Button>
          )}
        </div>
      </div>

      <p className="mb-0 mt-s5 text-center text-[0.8125rem] text-stone">
        {site.replyPromise}, usually much sooner.
      </p>
    </form>
  );
}
