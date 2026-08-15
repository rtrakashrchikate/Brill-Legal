import "server-only";

import requestsSeed from "@/data/requests.json";
import { mutateStore, readStore } from "@/lib/backend/local-store";
import { sbInsert, sbSelect, supabaseEnabled } from "@/lib/backend/supabase";
import { clampText, isEmail, isPhone } from "@/lib/utils";
import type {
  NewRequestInput,
  RequestCategory,
  RequestUrgency,
  ResourceRequest,
  SessionUser,
} from "@/types";

const STORE = "requests";
const seed = requestsSeed as ResourceRequest[];

export const REQUEST_CATEGORIES: RequestCategory[] = [
  "blood",
  "funding",
  "collaboration",
  "volunteers",
  "materials",
  "mentorship",
];

export const REQUEST_URGENCIES: RequestUrgency[] = ["critical", "high", "normal"];

export async function getRequests(): Promise<ResourceRequest[]> {
  const remote = await sbSelect<ResourceRequest>(
    "resource_requests",
    "select=*&order=createdAt.desc",
  );
  const rows = remote?.length ? remote : readStore<ResourceRequest[]>(STORE, seed);
  return [...rows].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  value?: NewRequestInput;
}

/** Server-side validation — the client form mirrors these rules for UX only. */
export function validateRequest(payload: unknown): ValidationResult {
  const errors: Record<string, string> = {};
  const raw = (payload ?? {}) as Record<string, unknown>;

  const title = clampText(raw.title, 120);
  const description = clampText(raw.description, 1200);
  const city = clampText(raw.city, 60);
  const district = clampText(raw.district, 20);
  const needBy = clampText(raw.needBy, 24);
  const contactWhatsapp = clampText(raw.contactWhatsapp, 24);
  const contactEmail = clampText(raw.contactEmail, 120);
  const category = clampText(raw.category, 20) as RequestCategory;
  const urgency = (clampText(raw.urgency, 12) || "normal") as RequestUrgency;

  if (title.length < 8) errors.title = "Give the request a clear title (8 characters or more).";
  if (description.length < 40)
    errors.description = "Describe what you need in at least 40 characters.";
  if (!REQUEST_CATEGORIES.includes(category)) errors.category = "Pick a category.";
  if (!REQUEST_URGENCIES.includes(urgency)) errors.urgency = "Pick an urgency level.";
  if (city.length < 2) errors.city = "Add the city this request applies to.";
  if (district.length < 3) errors.district = "Add your district.";
  if (!needBy || Number.isNaN(new Date(needBy).getTime()))
    errors.needBy = "Add the date you need this by.";
  if (!isPhone(contactWhatsapp)) errors.contactWhatsapp = "Add a reachable WhatsApp number.";
  if (!isEmail(contactEmail)) errors.contactEmail = "Add a valid email address.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    errors,
    value: {
      title,
      description,
      category,
      urgency,
      city,
      district,
      needBy,
      contactWhatsapp,
      contactEmail,
    },
  };
}

export async function createRequest(
  input: NewRequestInput,
  author: SessionUser,
): Promise<ResourceRequest> {
  const record: ResourceRequest = {
    id: `r-${Date.now().toString(36)}`,
    ...input,
    status: "open",
    createdAt: new Date().toISOString(),
    contactName: author.name,
    postedByClub: author.club,
    // Snapshot of the author's verification state at posting time.
    isVerified: author.is_verified_rotaractor,
  };

  if (supabaseEnabled()) {
    const saved = await sbInsert<ResourceRequest>("resource_requests", record);
    if (saved) return saved;
  }

  mutateStore<ResourceRequest[]>(STORE, seed, (current) => [record, ...current]);
  return record;
}
