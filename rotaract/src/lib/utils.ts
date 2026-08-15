type ClassValue = string | number | null | undefined | false | ClassValue[];

/** Minimal class-name joiner — keeps the bundle free of a clsx dependency. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const value of values) {
    if (!value && value !== 0) continue;
    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) out.push(nested);
    } else {
      out.push(String(value));
    }
  }
  return out.join(" ");
}

export function formatDate(
  input: string | Date,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { ...opts, timeZone: "Asia/Kolkata" }).format(date);
}

export function formatTime(input: string | Date): string {
  return formatDate(input, { hour: "numeric", minute: "2-digit", hour12: true });
}

/**
 * "Sun, 23 August".
 *
 * Built from two single-field Intl calls rather than one multi-field call:
 * Node and browser ICU builds disagree on the separator they insert between
 * `weekday` and `day` ("Sun 23 August" vs "Sun, 23 August"), which shows up as
 * a hydration mismatch. Composing it ourselves keeps both sides identical.
 */
export function formatDayDate(input: string | Date): string {
  const weekday = formatDate(input, { weekday: "short" });
  const rest = formatDate(input, { day: "numeric", month: "long" });
  return weekday && rest ? `${weekday}, ${rest}` : rest;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function initials(name: string): string {
  return name
    .replace(/[^\p{L}\s'-]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Stable small integer from a string — used to pick deterministic cover art. */
export function seedFrom(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

export function relativeFromNow(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const diff = date.getTime() - Date.now();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000_000],
    ["month", 2_592_000_000],
    ["week", 604_800_000],
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ];

  for (const [unit, ms] of units) {
    if (abs >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return "just now";
}

export function pluralise(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}

/** Drops accidental whitespace and clamps user-supplied strings. */
export function clampText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/** Accepts +91 98765 43210, 9876543210, +919876543210 … */
export function isPhone(value: string): boolean {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length >= 10 && digits.length <= 15;
}
