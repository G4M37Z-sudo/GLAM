// ============================================================================
// src/app/api/inquiries/route.ts
//
// POST /api/inquiries
//   Body: { name, email, company?, phone?, message, product_id? }
//
// Public endpoint — anyone can submit an inquiry. RLS on `public.inquiries`
// allows anon + authenticated INSERTs (with a basic name/email/message
// presence check), so we use `createBrowserClient` with the anon key.
//
// Response shape:
//   200 { ok: true,  id: <uuid> }            // success
//   400 { error: "<validation message>" }    // bad input
//   500 { error: "<message>" }               // db / server failure
//
// Dynamic by default (POST is non-cacheable in Next.js). We don't export
// `dynamic = 'force-static'` — POST handlers cannot be statically rendered.
// ============================================================================

import { NextResponse } from "next/server";
import { createBrowserClient } from "@supabase/ssr";

// --- Validation helpers ---------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface InquiryBody {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  phone?: unknown;
  message?: unknown;
  product_id?: unknown;
}

interface ValidationResult {
  ok: boolean;
  value?: {
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    message: string;
    product_id: string | null;
  };
  error?: string;
}

function asTrimmedString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function asOptionalString(v: unknown): string | null {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asOptionalUuid(v: unknown): string | null {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  // Loose UUID shape check — Supabase will validate the cast server-side.
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    trimmed
  )
    ? trimmed
    : null;
}

function validateInquiry(body: InquiryBody | null): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const name = asTrimmedString(body.name);
  if (name.length === 0) {
    return { ok: false, error: "Name is required." };
  }

  const email = asTrimmedString(body.email);
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "A valid email is required." };
  }

  const message = asTrimmedString(body.message);
  if (message.length < 5) {
    return { ok: false, error: "Message must be at least 5 characters." };
  }

  const company = asOptionalString(body.company);
  const phone = asOptionalString(body.phone);
  const product_id = asOptionalUuid(body.product_id);

  return {
    ok: true,
    value: { name, email, company, phone, message, product_id },
  };
}

// --- Route handler --------------------------------------------------------

export async function POST(request: Request) {
  // 1. Parse JSON — guard against malformed bodies.
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // 2. Validate.
  const result = validateInquiry(raw as InquiryBody);
  if (!result.ok || !result.value) {
    return NextResponse.json(
      { error: result.error ?? "Invalid input." },
      { status: 400 }
    );
  }

  // 3. Build the Supabase browser client (anon key — RLS allows public insert).
  //    If env vars are missing (e.g. before Supabase is wired up in
  //    .env.local), surface a clear 500 instead of crashing the worker.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json(
      {
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
      },
      { status: 500 }
    );
  }

  const supabase = createBrowserClient(url, anonKey);

  // 4. Insert. RLS will enforce basic non-empty checks; we still rely on
  //    our own validation above so we can return specific messages.
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      name: result.value.name,
      email: result.value.email,
      company: result.value.company,
      phone: result.value.phone,
      message: result.value.message,
      product_id: result.value.product_id,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[/api/inquiries] insert failed:", error.message);
    return NextResponse.json(
      { error: "Could not save inquiry. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: data?.id }, { status: 200 });
}
