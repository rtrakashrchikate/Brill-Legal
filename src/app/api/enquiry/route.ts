import { wpEnabled, wpFetch } from "@/lib/wp/client";
import { MUTATION_CREATE_ENQUIRY } from "@/lib/wp/queries";

/**
 * Receives the consultation form and records it as an `enquiry` in WordPress
 * (the firm's private inbox). When WP is not configured it logs server-side and
 * still returns success, so the form works in every environment. The client
 * also fires the GA4 `generate_lead` event.
 */

type EnquiryPayload = {
  fullName?: string;
  phone?: string;
  email?: string;
  matterType?: string;
  message?: string;
  sourcePage?: string;
  /** Honeypot — must be empty. */
  company?: string;
};

export async function POST(request: Request) {
  let data: EnquiryPayload;
  try {
    data = (await request.json()) as EnquiryPayload;
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Basic spam honeypot.
  if (data.company) return Response.json({ ok: true });

  if (!data.fullName || !data.phone) {
    return Response.json(
      { ok: false, error: "Name and phone are required" },
      { status: 422 },
    );
  }

  const submittedAt = new Date().toISOString();

  if (wpEnabled) {
    const result = await wpFetch<{
      createEnquiry?: { success?: boolean; databaseId?: number };
    }>(MUTATION_CREATE_ENQUIRY, {
      auth: true,
      variables: {
        input: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email ?? "",
          matterType: data.matterType ?? "",
          message: data.message ?? "",
          sourcePage: data.sourcePage ?? "",
          submittedAt,
        },
      },
    });
    if (result?.createEnquiry?.success) {
      return Response.json({ ok: true });
    }
    // If WP write failed, don't lose the lead — log it.
    console.error("[enquiry] WP write failed; lead:", JSON.stringify(data));
    return Response.json({ ok: true });
  }

  console.info("[enquiry] received (WP disabled):", JSON.stringify({ ...data, submittedAt }));
  return Response.json({ ok: true });
}
