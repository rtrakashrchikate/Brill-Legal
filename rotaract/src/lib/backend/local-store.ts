import fs from "node:fs";
import path from "node:path";

/**
 * Write-through JSON store used when Supabase is not configured.
 *
 * Values live in memory for the lifetime of the server process and are mirrored
 * to `.data/<name>.json` so a `next dev` restart keeps hub postings and
 * engagement counts. On a read-only filesystem (most serverless targets) the
 * mirror silently degrades to memory-only rather than throwing.
 */

const DATA_DIR = path.join(process.cwd(), ".data");

const memory = new Map<string, unknown>();
let diskWritable: boolean | null = null;

function ensureDir(): boolean {
  if (diskWritable !== null) return diskWritable;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    diskWritable = true;
  } catch {
    diskWritable = false;
  }
  return diskWritable;
}

function fileFor(name: string): string {
  return path.join(DATA_DIR, `${name}.json`);
}

export function readStore<T>(name: string, fallback: T): T {
  if (memory.has(name)) return memory.get(name) as T;

  if (ensureDir()) {
    try {
      const raw = fs.readFileSync(fileFor(name), "utf8");
      const parsed = JSON.parse(raw) as T;
      memory.set(name, parsed);
      return parsed;
    } catch {
      /* no mirror yet — seed below */
    }
  }

  memory.set(name, fallback);
  return fallback;
}

export function writeStore<T>(name: string, value: T): T {
  memory.set(name, value);
  if (ensureDir()) {
    try {
      fs.writeFileSync(fileFor(name), JSON.stringify(value, null, 2), "utf8");
    } catch {
      diskWritable = false;
    }
  }
  return value;
}

export function mutateStore<T>(name: string, fallback: T, mutate: (current: T) => T): T {
  return writeStore(name, mutate(readStore(name, fallback)));
}
