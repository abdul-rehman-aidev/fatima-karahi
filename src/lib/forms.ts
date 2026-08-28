/**
 * Static-export-safe form submission.
 *
 * TODO(client): set NEXT_PUBLIC_FORM_ENDPOINT (e.g. a Formspree form URL,
 * a Resend-backed serverless function, etc.). Pointing at a real endpoint is
 * this one line of configuration — the payload is plain JSON.
 *
 * Until it's set, submissions are simulated locally (with a console warning)
 * so the full success flow is testable.
 */

export const FORM_ENDPOINT: string = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

export type FormKind = "catering-quote" | "contact" | "query";

export type FormResult = { ok: true; simulated: boolean };

export async function submitForm(
  kind: FormKind,
  data: Record<string, string>,
): Promise<FormResult> {
  if (!FORM_ENDPOINT) {
    console.warn(
      `[fatima-karahi] NEXT_PUBLIC_FORM_ENDPOINT is not set — simulating a successful "${kind}" submission. Wire a real endpoint before launch.`,
    );
    await new Promise((r) => setTimeout(r, 650));
    return { ok: true, simulated: true };
  }

  const res = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ kind, ...data }),
  });

  if (!res.ok) {
    throw new Error(`Form endpoint responded ${res.status}`);
  }
  return { ok: true, simulated: false };
}
