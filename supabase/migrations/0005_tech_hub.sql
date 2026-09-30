-- ============================================
-- NACOS KKU VOM — Tech Hub
-- Curated learning resources
-- ============================================

create table if not exists tech_hub_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  resource_type text,
  url text not null,
  level text,
  tags text[] default '{}',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_tech_hub_category on tech_hub_resources(category);
create index if not exists idx_tech_hub_level on tech_hub_resources(level);