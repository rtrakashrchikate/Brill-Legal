import { revalidateTag, revalidatePath } from "next/cache";

/**
 * On-demand revalidation webhook. Point WordPress (e.g. via WPGraphQL Smart
 * Cache / a save_post hook) at:
 *   POST https://brilllegal.in/api/revalidate
 *   { "secret": "...", "tag": "wp:articles", "path": "/insights/<slug>" }
 *
 * Either `tag` or `path` (or both) may be supplied. Without them, the whole
 * "wp" tag is refreshed.
 */
export async function POST(request: Request) {
  const secret = process.env.WP_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json(
      { ok: false, error: "Revalidation not configured" },
      { status: 501 },
    );
  }

  let body: { secret?: string; tag?: string; path?: string } = {};
  try {
    body = await request.json();
  } catch {
    /* allow empty body */
  }

  const provided =
    body.secret ?? new URL(request.url).searchParams.get("secret") ?? "";
  if (provided !== secret) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const refreshed: string[] = [];
  if (body.tag) {
    revalidateTag(body.tag, "max");
    refreshed.push(`tag:${body.tag}`);
  }
  if (body.path) {
    revalidatePath(body.path);
    refreshed.push(`path:${body.path}`);
  }
  if (!body.tag && !body.path) {
    revalidateTag("wp", "max");
    refreshed.push("tag:wp");
  }

  return Response.json({ ok: true, revalidated: refreshed, now: Date.now() });
}
