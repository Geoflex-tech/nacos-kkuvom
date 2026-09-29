-- ================================================================
-- NACOS KKU VOM — Resources & Tech Hub RLS
--
-- Run in: Supabase Dashboard → SQL Editor → New Query
--
-- ACCESS RULE APPLIED:
--   • resources         → only authenticated users with status='approved'
--   • tech_hub_resources → only authenticated users with status='approved'
--   • anon / public role → DENIED (returns empty, not an error)
--   • Admins (admin, super_admin, president) can INSERT/UPDATE/DELETE.
--
-- WHY approved-only (not just authenticated)?
--   The app registration model requires admin approval before an
--   account counts as a "registered student".  Hiding the links is
--   not enough — the DB must enforce the same rule so a logged-in
--   but un-approved user cannot query the data directly.
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- 1.  RESOURCES TABLE
-- ────────────────────────────────────────────────────────────────

-- Enable RLS (idempotent)
alter table public.resources enable row level security;

-- Drop old policies if they exist
drop policy if exists "resources_public_read"   on public.resources;
drop policy if exists "resources_anon_read"     on public.resources;
drop policy if exists "resources_auth_read"     on public.resources;
drop policy if exists "resources_approved_read" on public.resources;
drop policy if exists "resources_admin_insert"  on public.resources;
drop policy if exists "resources_admin_update"  on public.resources;
drop policy if exists "resources_admin_delete"  on public.resources;

-- SELECT: only approved authenticated members
create policy "resources_approved_read"
  on public.resources
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.status = 'approved'
    )
  );

-- INSERT: admin roles only
create policy "resources_admin_insert"
  on public.resources
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'super_admin', 'president')
    )
  );

-- UPDATE: admin roles only
create policy "resources_admin_update"
  on public.resources
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'super_admin', 'president')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'super_admin', 'president')
    )
  );

-- DELETE: admin roles only
create policy "resources_admin_delete"
  on public.resources
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'super_admin', 'president')
    )
  );


-- ────────────────────────────────────────────────────────────────
-- 2.  TECH HUB RESOURCES TABLE
-- ────────────────────────────────────────────────────────────────

alter table public.tech_hub_resources enable row level security;

drop policy if exists "tech_hub_public_read"    on public.tech_hub_resources;
drop policy if exists "tech_hub_anon_read"      on public.tech_hub_resources;
drop policy if exists "tech_hub_auth_read"      on public.tech_hub_resources;
drop policy if exists "tech_hub_approved_read"  on public.tech_hub_resources;
drop policy if exists "tech_hub_admin_insert"   on public.tech_hub_resources;
drop policy if exists "tech_hub_admin_update"   on public.tech_hub_resources;
drop policy if exists "tech_hub_admin_delete"   on public.tech_hub_resources;

-- SELECT: only approved authenticated members
create policy "tech_hub_approved_read"
  on public.tech_hub_resources
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.status = 'approved'
    )
  );

-- INSERT: admin roles only
create policy "tech_hub_admin_insert"
  on public.tech_hub_resources
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'super_admin', 'president')
    )
  );

-- UPDATE: admin roles only
create policy "tech_hub_admin_update"
  on public.tech_hub_resources
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'super_admin', 'president')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'super_admin', 'president')
    )
  );

-- DELETE: admin roles only
create policy "tech_hub_admin_delete"
  on public.tech_hub_resources
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'super_admin', 'president')
    )
  );


-- ────────────────────────────────────────────────────────────────
-- 3.  STORAGE BUCKETS — must be PRIVATE (not public)
--
-- If your bucket is currently public, run these to make it private.
-- Replace 'resources' with your actual bucket name.
-- This prevents anyone with a raw file URL from accessing the file
-- without a signed URL.
-- ────────────────────────────────────────────────────────────────

-- NOTE: Supabase does not expose bucket privacy via SQL.
-- To make a bucket private, go to:
--   Storage → [bucket name] → Settings → uncheck "Public bucket"
--
-- Once private, ALL file access requires a signed URL.
-- The app already generates signed URLs (60-min expiry) in
-- DashboardResources.jsx via supabase.storage.createSignedUrl().
--
-- To add an RLS policy on storage.objects (restricts even signed
-- URL generation to approved members):
update storage.buckets
  set public = false
  where name in ('resources', 'tech-hub', 'tech_hub');

-- Allow approved members to READ objects in the resources bucket
-- (needed so createSignedUrl works for them)
drop policy if exists "resources_storage_approved_read"
  on storage.objects;

create policy "resources_storage_approved_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id in ('resources', 'tech-hub', 'tech_hub')
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.status = 'approved'
    )
  );

-- Allow admins to INSERT/UPDATE/DELETE objects in these buckets
drop policy if exists "resources_storage_admin_write"
  on storage.objects;

create policy "resources_storage_admin_write"
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id in ('resources', 'tech-hub', 'tech_hub')
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'super_admin', 'president')
    )
  )
  with check (
    bucket_id in ('resources', 'tech-hub', 'tech_hub')
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'super_admin', 'president')
    )
  );


-- ────────────────────────────────────────────────────────────────
-- 4.  VERIFY
-- ────────────────────────────────────────────────────────────────

-- Check policies are in place
select
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
from pg_policies
where tablename in ('resources', 'tech_hub_resources')
order by tablename, policyname;

-- Quick anon test: should return 0 rows (RLS blocks anon)
-- set role anon;
-- select count(*) from public.resources;          -- expect 0
-- select count(*) from public.tech_hub_resources; -- expect 0
-- reset role;
