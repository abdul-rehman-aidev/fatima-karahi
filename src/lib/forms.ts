/**
 * Form submission — posts to the site's own `/api/send-form` route, which
 * emails the payload via Resend (see that route for the Resend integration).
 *
 * `NEXT_PUBLIC_FORM_ENDPOINT` can override this with an external endpoint
 * (e.g. a Formspree URL) instead, if that's ever preferred.
 */

export const FORM_ENDPOINT: string = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "/api/send-form/";

export type FormKind = "catering-quote" | "contact" | "query";

export type FormResult = { ok: true; simulated: boolean };

export async function submitForm(
  kind: FormKind,
  data: Record<string, string>,
): Promise<FormResult> {
  // Distinguishes this attempt for Resend's idempotency check, so a dropped
  // response that's silently retried doesn't double-send the same email.
  const submissionId = crypto.randomUUID();

  const res = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ kind, submissionId, ...data }),
  });

  if (!res.ok) {
    throw new Error(`Form endpoint responded ${res.status}`);
  }

  const body = (await res.json()) as { ok: true; simulated?: boolean };
  return { ok: true, simulated: Boolean(body.simulated) };
}
