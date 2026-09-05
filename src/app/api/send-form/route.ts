import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/data/site";

export const runtime = "nodejs";

type FormKind = "catering-quote" | "contact" | "query";
const FORM_KINDS: readonly FormKind[] = ["catering-quote", "contact", "query"];

const KIND_LABEL: Record<FormKind, string> = {
  "catering-quote": "Catering quote request",
  contact: "Contact form",
  query: "General query",
};

// fatimakarahiyeg.com is verified in Resend (resend.com/domains) — override
// with RESEND_FROM_EMAIL only if that ever changes. Sending from an
// unverified address (e.g. Resend's onboarding@resend.dev sandbox) 403s.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Fatima Karahi <forms@fatimakarahiyeg.com>";

// Testing-only override — see .env.local.example. Not needed now that
// FROM_EMAIL is on a verified domain: Resend can deliver to any recipient
// in that case, so this defaults straight to `site.email`.
const TO_EMAIL = process.env.RESEND_TO_EMAIL || site.email;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Every field is free-text from a public form — cap length, strip control chars. */
function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").trim().slice(0, 2000);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { kind, submissionId, ...rest } = body as Record<string, unknown>;

  if (typeof kind !== "string" || !FORM_KINDS.includes(kind as FormKind)) {
    return NextResponse.json({ ok: false, error: "Unknown form kind." }, { status: 400 });
  }

  // Honeypot: QuoteForm/QueryForm submit an empty "company" field for real
  // visitors. If it's filled in, it was a bot — accept silently, send nothing.
  if (sanitize(rest.company)) {
    return NextResponse.json({ ok: true });
  }

  const fields = Object.entries(rest)
    .filter(([key]) => key !== "company")
    .map(([key, value]) => [key, sanitize(value)] as const)
    .filter(([, value]) => value.length > 0);

  if (fields.length === 0) {
    return NextResponse.json({ ok: false, error: "Empty submission." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      `[send-form] RESEND_API_KEY is not set — simulating a successful "${kind}" submission instead of emailing ${TO_EMAIL}.`,
    );
    return NextResponse.json({ ok: true, simulated: true });
  }

  const label = KIND_LABEL[kind as FormKind];
  const rows = fields
    .map(([key, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top;white-space:nowrap">${escapeHtml(key)}</td><td style="padding:4px 0">${escapeHtml(value).replace(/\n/g, "<br/>")}</td></tr>`)
    .join("");

  const resend = new Resend(apiKey);
  const idempotencyKey =
    typeof submissionId === "string" && submissionId
      ? `${kind}/${submissionId.slice(0, 200)}`
      : undefined;

  const { error } = await resend.emails.send(
    {
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `${label} — fatimakarahi.ca`,
      html: `<table>${rows}</table>`,
    },
    idempotencyKey ? { idempotencyKey } : undefined,
  );

  if (error) {
    console.error(`[send-form] Resend error sending "${kind}" (${error.name}):`, error.message);
    return NextResponse.json({ ok: false, error: "Failed to send." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
