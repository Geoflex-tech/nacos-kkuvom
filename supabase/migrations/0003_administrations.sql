-- ============================================
-- NACOS KKU VOM — Administrations & Chapter History
-- ============================================

create table if not exists administrations (
  id uuid primary key default gen_random_uuid(),
  session_label text not null unique,
  administration_name text not null,
  start_date date,
  end_date date,
  motto text,
  description text,
  is_current boolean default false,
  cover_image text,
  achievements jsonb default '[]'::jsonb,
  projects jsonb default '[]'::jsonb,
  legacy_note text,
  created_at timestamptz default now()
);

-- Link content tables to administrations
alter table executives add column if not exists administration_id uuid references administrations(id) on delete set null;
alter table events      add column if not exists administration_id uuid references administrations(id) on delete set null;
alter table news        add column if not exists administration_id uuid references administrations(id) on delete set null;
alter table gallery     add column if not exists administration_id uuid references administrations(id) on delete set null;

-- Seed the Pioneer Administration
insert into administrations (session_label, administration_name, start_date, end_date, motto, description, is_current)
values (
  '2026/2027',
  'Pioneer Administration',
  '2026-10-01',
  '2027-09-30',
  'Building the Foundation',
  'The founding administration of NACOS KKU Vom Chapter — establishing the digital and institutional foundation.',
  true
)
on conflict (session_label) do nothing;