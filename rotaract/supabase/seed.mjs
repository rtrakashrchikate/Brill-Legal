#!/usr/bin/env node
/**
 * Loads the in-repo seed data into Supabase.
 *
 * Zero dependencies — plain fetch against PostgREST. Rows are upserted on the
 * primary key, so re-running is safe and idempotent.
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node supabase/seed.mjs
 *
 * Flags:
 *   --dry-run   print what would be sent, send nothing
 *   --only=x,y  restrict to named tables
 */

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? onlyArg.slice("--only=".length).split(",") : null;

if (!dryRun && (!url || !key)) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Set both, or pass --dry-run to preview the payloads.",
  );
  process.exit(1);
}

/** Seed file → table, with any shaping the schema needs. */
const TABLES = [
  { file: "members.json", table: "members", conflict: "id" },
  { file: "blogs.json", table: "blogs", conflict: "id" },
  { file: "events.json", table: "events", conflict: "id" },
  { file: "news.json", table: "news", conflict: "id" },
  { file: "requests.json", table: "resource_requests", conflict: "id" },
  {
    file: "users.json",
    table: "profiles",
    conflict: "email",
    // users.json carries a demo password hash; the column is nullable so a real
    // Supabase Auth deployment can simply stop sending it.
    shape: (row) => ({
      email: row.email,
      name: row.name,
      club: row.club,
      district: row.district,
      role: row.role,
      is_verified_rotaractor: row.is_verified_rotaractor,
      passwordHash: row.passwordHash ?? null,
    }),
  },
];

async function load(file) {
  return JSON.parse(await readFile(join(dataDir, file), "utf8"));
}

async function upsert(table, rows, conflict) {
  const res = await fetch(`${url}/rest/v1/${table}?on_conflict=${conflict}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    throw new Error(`${table}: ${res.status} ${res.statusText}\n${await res.text()}`);
  }
}

let failed = false;

for (const { file, table, conflict, shape } of TABLES) {
  if (only && !only.includes(table)) continue;

  const raw = await load(file);
  const rows = shape ? raw.map(shape) : raw;

  if (dryRun) {
    console.log(`[dry-run] ${table}: ${rows.length} rows`);
    console.log(`          keys: ${Object.keys(rows[0] ?? {}).join(", ")}`);
    continue;
  }

  try {
    await upsert(table, rows, conflict);
    console.log(`✓ ${table}: ${rows.length} rows`);
  } catch (error) {
    failed = true;
    console.error(`✗ ${error.message}`);
  }
}

if (failed) process.exit(1);
if (!dryRun) console.log("\nSeed complete.");
