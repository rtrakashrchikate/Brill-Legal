import type { EngageableType } from "@/types";

export const ENGAGEABLE_TYPES: EngageableType[] = [
  "blog",
  "event",
  "news",
  "member",
  "request",
];

export function targetKey(type: EngageableType, id: string): string {
  return `${type}:${id}`;
}

export function parseTargetKey(key: string): { type: EngageableType; id: string } | null {
  const [type, ...rest] = key.split(":");
  const id = rest.join(":");
  if (!id || !ENGAGEABLE_TYPES.includes(type as EngageableType)) return null;
  return { type: type as EngageableType, id };
}
