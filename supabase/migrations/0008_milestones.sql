-- ================================================================
-- NACOS KKU VOM — Milestones / History Table
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- 1. Create table
create table if not exists public.milestones (
  id          uuid primary key default gen_random_uuid(),
  year        text        not null,           -- e.g. "2026" or "March 2026"
  title       text        not null,
  description text        not null,
  image_url   text,
  sort_date   date,                           -- for proper chronological ordering
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists milestones_updated_at on public.milestones;
create trigger milestones_updated_at
  before update on public.milestones
  for each row execute function public.set_updated_at();

-- 3. RLS — public can read, only admins can write
alter table public.milestones enable row level security;

drop policy if exists "milestones_public_read"  on public.milestones;
drop policy if exists "milestones_admin_insert" on public.milestones;
drop policy if exists "milestones_admin_update" on public.milestones;
drop policy if exists "milestones_admin_delete" on public.milestones;

create policy "milestones_public_read"
  on public.milestones for select
  to anon, authenticated
  using (true);

create policy "milestones_admin_insert"
  on public.milestones for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super_admin', 'president')
    )
  );

create policy "milestones_admin_update"
  on public.milestones for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super_admin', 'president')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super_admin', 'president')
    )
  );

create policy "milestones_admin_delete"
  on public.milestones for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super_admin', 'president')
    )
  );

-- 4. Verify
select id, year, title, sort_date from public.milestones order by sort_date;
