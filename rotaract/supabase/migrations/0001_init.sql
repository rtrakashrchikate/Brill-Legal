-- ---------------------------------------------------------------------------
-- Rotaract club platform — initial schema
--
-- Column names are camelCase, quoted, on purpose. PostgREST returns column
-- names verbatim, and the application maps rows straight onto the TypeScript
-- interfaces in src/types/index.ts. Matching the names here means the Supabase
-- path and the local JSON fallback return byte-identical shapes, with no
-- mapping layer to drift.
--
-- Apply with:  supabase db push        (or paste into the SQL editor)
-- Seed with:   node supabase/seed.mjs
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enumerations
-- ---------------------------------------------------------------------------

create type member_category as enum ('bod', 'member', 'alumni');
create type request_category as enum (
  'blood', 'funding', 'collaboration', 'volunteers', 'materials', 'mentorship'
);
create type request_urgency as enum ('critical', 'high', 'normal');
create type request_status as enum ('open', 'fulfilled', 'expired');
create type engageable_type as enum ('blog', 'event', 'news', 'member', 'request');
create type news_weight as enum ('tall', 'regular', 'wide');

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------

create table members (
  id           text primary key,
  slug         text not null unique,
  name         text not null,
  role         text not null,
  category     member_category not null default 'member',
  year         text not null,
  rank         integer not null default 50,
  avenue       text,
  bio          text not null default '',
  since        integer,
  email        text not null,
  whatsapp     text not null,
  linkedin     text,
  instagram    text,
  photo        text,
  highlights   text[] not null default '{}',
  "createdAt"  timestamptz not null default now()
);

create index members_category_year_idx on members (category, year);
create index members_rank_idx on members (rank);

-- ---------------------------------------------------------------------------
-- Publications
-- ---------------------------------------------------------------------------

create table blogs (
  id            text primary key,
  slug          text not null unique,
  title         text not null,
  excerpt       text not null,
  body          text[] not null default '{}',
  category      text not null,
  tags          text[] not null default '{}',
  "authorSlug"  text references members (slug) on delete set null,
  "authorName"  text not null,
  "authorRole"  text not null,
  "publishedAt" date not null,
  "readMinutes" integer not null default 5,
  featured      boolean not null default false
);

create index blogs_published_idx on blogs ("publishedAt" desc);
create index blogs_category_idx on blogs (category);

-- ---------------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------------

create table events (
  id                 text primary key,
  slug               text not null unique,
  title              text not null,
  summary            text not null,
  description        text not null default '',
  avenue             text not null,
  "startsAt"         timestamptz not null,
  "endsAt"           timestamptz not null,
  venue              text not null,
  city               text not null,
  "registerUrl"      text,
  "contactName"      text not null,
  "contactWhatsapp"  text not null,
  seats              integer,
  highlights         text[] not null default '{}',
  constraint events_time_order check ("endsAt" >= "startsAt")
);

create index events_starts_idx on events ("startsAt");

-- ---------------------------------------------------------------------------
-- District news
-- ---------------------------------------------------------------------------

create table news (
  id              text primary key,
  slug            text not null unique,
  title           text not null,
  club            text not null,
  district        text not null,
  "impactArea"    text not null,
  summary         text not null,
  "publishedAt"   date not null,
  "impactMetric"  text not null,
  beneficiaries   integer not null default 0,
  body            text[] not null default '{}',
  replicate       text[] not null default '{}',
  "sourceUrl"     text,
  weight          news_weight not null default 'regular'
);

create index news_published_idx on news ("publishedAt" desc);
create index news_district_idx on news (district, "impactArea");

-- ---------------------------------------------------------------------------
-- Accounts
--
-- `id` matches auth.users.id when Supabase Auth is in use. The demo build ships
-- its own password hash column; drop it once real auth is wired up.
-- ---------------------------------------------------------------------------

create table profiles (
  id                        uuid primary key default gen_random_uuid(),
  email                     text not null unique,
  name                      text not null,
  club                      text not null,
  district                  text not null,
  role                      text not null default 'Member',
  is_verified_rotaractor    boolean not null default false,
  "passwordHash"            text,
  "verifiedAt"              timestamptz,
  "verifiedBy"              uuid references profiles (id) on delete set null,
  "createdAt"               timestamptz not null default now()
);

create index profiles_email_idx on profiles (lower(email));

-- Keep the audit trail honest: stamp the moment verification is granted.
-- Fires on INSERT too, so a row created already-verified is stamped rather
-- than silently carrying a null timestamp.
create or replace function touch_verified_at() returns trigger
language plpgsql as $$
begin
  if new.is_verified_rotaractor
     and not coalesce(old.is_verified_rotaractor, false)
     and new."verifiedAt" is null then
    new."verifiedAt" := now();
  elsif not new.is_verified_rotaractor then
    new."verifiedAt" := null;
  end if;
  return new;
end;
$$;

create trigger profiles_touch_verified_at
  before insert or update on profiles
  for each row execute function touch_verified_at();

-- ---------------------------------------------------------------------------
-- Requirement hub
-- ---------------------------------------------------------------------------

create table resource_requests (
  id                 text primary key,
  title              text not null check (char_length(title) between 8 and 120),
  category           request_category not null,
  urgency            request_urgency not null default 'normal',
  status             request_status not null default 'open',
  description        text not null check (char_length(description) between 40 and 1200),
  city               text not null,
  district           text not null,
  "needBy"           date not null,
  "createdAt"        timestamptz not null default now(),
  "contactName"      text not null,
  "contactWhatsapp"  text not null,
  "contactEmail"     text not null,
  "postedByClub"     text not null,
  "postedBy"         uuid references profiles (id) on delete set null,
  -- Snapshot of the author's verification state at posting time, so a later
  -- change to the profile cannot retroactively add or remove the badge.
  "isVerified"       boolean not null default false
);

create index requests_created_idx on resource_requests ("createdAt" desc);
create index requests_open_idx on resource_requests (status, category, district);

-- ---------------------------------------------------------------------------
-- Engagement
-- ---------------------------------------------------------------------------

create table engagement_counts (
  "targetType"  engageable_type not null,
  "targetId"    text not null,
  views         integer not null default 0 check (views >= 0),
  likes         integer not null default 0 check (likes >= 0),
  clap          integer not null default 0 check (clap >= 0),
  heart         integer not null default 0 check (heart >= 0),
  fire          integer not null default 0 check (fire >= 0),
  "updatedAt"   timestamptz not null default now(),
  primary key ("targetType", "targetId")
);

-- ---------------------------------------------------------------------------
-- Row-level security
--
-- The application server talks to Supabase with the service-role key, which
-- bypasses RLS. These policies are the second line: they define what is safe if
-- the anon key is ever used directly from a browser.
-- ---------------------------------------------------------------------------

alter table members            enable row level security;
alter table blogs              enable row level security;
alter table events             enable row level security;
alter table news               enable row level security;
alter table resource_requests  enable row level security;
alter table engagement_counts  enable row level security;
alter table profiles           enable row level security;

-- Everything the site renders is public to read. This is the product decision,
-- not an oversight: a blood requirement behind a login is one that fails.
create policy "public read members"  on members           for select using (true);
create policy "public read blogs"    on blogs             for select using (true);
create policy "public read events"   on events            for select using (true);
create policy "public read news"     on news              for select using (true);
create policy "public read requests" on resource_requests for select using (true);
create policy "public read counts"   on engagement_counts for select using (true);

-- Reading the caller's own flag has to happen outside RLS: a policy on
-- `profiles` that itself selects from `profiles` recurses. SECURITY DEFINER
-- with a pinned search_path is the standard way out.
create or replace function is_verified_rotaractor()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public
as $$
  select coalesce(
    (select p.is_verified_rotaractor from profiles p where p.id = auth.uid()),
    false
  );
$$;

revoke execute on function is_verified_rotaractor() from public;
grant execute on function is_verified_rotaractor() to authenticated;

-- The verification wall, expressed in SQL — mirroring the check in
-- POST /api/requests so neither path can be bypassed by going around the other.
create policy "verified rotaractors insert requests"
  on resource_requests for insert
  to authenticated
  with check (is_verified_rotaractor() and "postedBy" = auth.uid());

-- Authors may close or amend their own listing.
create policy "authors update own requests"
  on resource_requests for update
  to authenticated
  using ("postedBy" = auth.uid())
  with check ("postedBy" = auth.uid());

-- Profiles are private. A signed-in user sees only their own row, and the
-- password hash should be dropped entirely once Supabase Auth is in use.
create policy "read own profile"
  on profiles for select
  to authenticated
  using (id = auth.uid());

create policy "update own profile"
  on profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- Immutability guards
--
-- WITH CHECK cannot see the previous row, so "you may edit this, but not that
-- column" is enforced with triggers rather than policy expressions.
-- ---------------------------------------------------------------------------

-- Nobody grants themselves the badge. Only a privileged path (service role, or
-- a club secretary tool running as one) may move this flag.
create or replace function freeze_verification() returns trigger
language plpgsql as $$
begin
  if auth.uid() is not null
     and new.is_verified_rotaractor is distinct from old.is_verified_rotaractor then
    raise exception 'is_verified_rotaractor is not self-serviceable';
  end if;
  return new;
end;
$$;

create trigger profiles_freeze_verification
  before update on profiles
  for each row execute function freeze_verification();

-- A listing's badge is a snapshot taken at insert time; editing the listing
-- later must not change what the badge claimed.
create or replace function freeze_request_badge() returns trigger
language plpgsql as $$
begin
  if new."isVerified" is distinct from old."isVerified" then
    raise exception 'isVerified is fixed at posting time';
  end if;
  return new;
end;
$$;

create trigger requests_freeze_badge
  before update on resource_requests
  for each row execute function freeze_request_badge();

-- Engagement writes go through the server, which owns the rate limiting and the
-- per-visitor ledger. No anon insert/update policy is defined, so a browser
-- holding the anon key can read counts but cannot inflate them.

-- ---------------------------------------------------------------------------
-- Grants
--
-- RLS decides which rows; grants decide which verbs. Both are needed — a table
-- with a permissive policy and no grant is still unreadable.
--
-- `usage on schema auth` is already granted on a hosted Supabase project; it is
-- repeated here so the migration also applies cleanly to a bare Postgres with
-- the auth schema stubbed, which is how it was tested.
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant usage on schema auth to anon, authenticated;

grant select on members, blogs, events, news, resource_requests, engagement_counts
  to anon, authenticated;

grant select, update on profiles to authenticated;
grant insert, update on resource_requests to authenticated;

-- Deliberately no grant of insert/update on engagement_counts to either role.
