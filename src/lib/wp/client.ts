/**
 * Minimal WPGraphQL client for the headless WordPress backend.
 *
 * The whole integration is OPT-IN: if WP_GRAPHQL_ENDPOINT is unset, every
 * helper returns null and callers fall back to the in-repo content. This lets
 * the site build and run today, and switch to WordPress the moment the CMS at
 * cms.brilllegal.in is live — no code changes, just env vars.
 *
 * Env:
 *   WP_GRAPHQL_ENDPOINT   e.g. https://cms.brilllegal.in/graphql
 *   WP_APP_USERNAME       application-password user (for mutations/preview)
 *   WP_APP_PASSWORD       application password
 *   WP_REVALIDATE_SECRET  shared secret for the /api/revalidate webhook
 */

export const WP_ENDPOINT = process.env.WP_GRAPHQL_ENDPOINT;
export const wpEnabled = Boolean(WP_ENDPOINT);

type WpFetchOptions = {
  variables?: Record<string, unknown>;
  /** ISR revalidate window (seconds). Default 1 hour. */
  revalidate?: number;
  /** Cache tags for on-demand revalidation. */
  tags?: string[];
  /** Send the application-password Authorization header (for mutations). */
  auth?: boolean;
};

function authHeader(): Record<string, string> {
  const user = process.env.WP_APP_USERNAME;
  const pass = process.env.WP_APP_PASSWORD;
  if (!user || !pass) return {};
  const token = Buffer.from(`${user}:${pass}`).toString("base64");
  return { Authorization: `Basic ${token}` };
}

/**
 * Run a GraphQL query/mutation. Returns the typed `data` payload, or `null`
 * when WP is disabled or the request fails (caller falls back to local data).
 */
export async function wpFetch<T>(
  query: string,
  opts: WpFetchOptions = {},
): Promise<T | null> {
  if (!WP_ENDPOINT) return null;
  try {
    const res = await fetch(WP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(opts.auth ? authHeader() : {}),
      },
      body: JSON.stringify({ query, variables: opts.variables ?? {} }),
      next: {
        revalidate: opts.revalidate ?? 3600,
        tags: opts.tags ?? ["wp"],
      },
    });
    if (!res.ok) {
      console.error(`[wp] HTTP ${res.status} from WPGraphQL`);
      return null;
    }
    const json = (await res.json()) as { data?: T; errors?: unknown };
    if (json.errors) {
      console.error("[wp] GraphQL errors:", JSON.stringify(json.errors));
      return null;
    }
    return json.data ?? null;
  } catch (err) {
    console.error("[wp] fetch failed:", err);
    return null;
  }
}
