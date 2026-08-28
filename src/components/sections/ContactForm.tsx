"use client";

import { useState } from "react";
import { Button } from "@/components/ds/Button";
import { Field } from "@/components/ds/Field";
import { submitForm } from "@/lib/forms";

/**
 * General contact / query form — name, phone, and message, same pluggable
 * endpoint as the quote form. This is the site's one catch-all "reach out
 * for anything" form (the restaurant doesn't run an online table-reservation
 * system, so there's deliberately no date/time/party-size booking flow
 * anywhere on the site).
 */
export function ContactForm() {
  const [values, setValues] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!/^[+\d][\d\s().-]{6,}$/.test(values.phone.trim()))
      next.phone = "Enter a phone number we can reach you on.";
    if (!values.message.trim()) next.message = "Add a short message so we know how to help.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    try {
      await submitForm("query", values);
      setStatus("success");
    } catch {
      setStatus("error"); // values stay in state — nothing is lost
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-card bg-emerald px-s5 py-s6 text-center shadow-card">
        <h3 className="m-0 font-editorial text-[1.5rem] italic text-ivory">Shukriya, we&rsquo;ve got it.</h3>
        <p className="mb-0 mt-s2 text-[0.95rem] text-sage">We&rsquo;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-s4">
      {status === "error" && (
        <div
          role="alert"
          className="rounded-input border border-spice bg-[color-mix(in_srgb,var(--spice)_8%,transparent)] px-s4 py-s3 text-[0.9rem] text-spice"
        >
          We couldn&rsquo;t send that just now, but your message is still here. Please try again.
        </div>
      )}
      <Field
        id="contact-name"
        label="Your name"
        placeholder="e.g. Bilal"
        required
        autoComplete="name"
        value={values.name}
        onChange={(e) => {
          setValues((v) => ({ ...v, name: e.target.value }));
          setErrors((er) => ({ ...er, name: undefined }));
        }}
        error={errors.name}
      />
      <Field
        id="contact-phone"
        label="Phone number"
        type="tel"
        inputMode="tel"
        placeholder="+1 780 …"
        required
        autoComplete="tel"
        value={values.phone}
        onChange={(e) => {
          setValues((v) => ({ ...v, phone: e.target.value }));
          setErrors((er) => ({ ...er, phone: undefined }));
        }}
        error={errors.phone}
      />
      <Field
        id="contact-message"
        label="Message"
        textarea
        placeholder="How can we help?"
        required
        value={values.message}
        onChange={(e) => {
          setValues((v) => ({ ...v, message: e.target.value }));
          setErrors((er) => ({ ...er, message: undefined }));
        }}
        error={errors.message}
      />
      <div>
        <Button variant="primary" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
