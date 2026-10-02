-- ============================================
-- NACOS KKU VOM — Project Showcase
-- ============================================

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tech_stack text[] default '{}',
  category text default 'web' check (category in (
    'web', 'mobile', 'ai-ml', 'cybersecurity', 'data',
    'ui-ux', 'game', 'iot', 'blockchain', 'other'
  )),
  developer_id uuid not null references profiles(id) on delete cascade,
  team_members text[] default '{}',
  github_url text,
  demo_url text,
  image_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_featured boolean default false,
  admin_notes text,
  created_at timestamptz default now()
);

create index if not exists idx_projects_status on projects(status);
create index if not exists idx_projects_category on projects(category);
create index if not exists idx_projects_featured on projects(is_featured);
create index if not exists idx_projects_developer on projects(developer_id);

alter table projects enable row level security;

-- Public can read approved projects
drop policy if exists "public read approved projects" on projects;
create policy "public read approved projects"
  on projects for select
  using (status = 'approved');

-- Owner reads their own (any status)
drop policy if exists "owner reads own projects" on projects;
create policy "owner reads own projects"
  on projects for select
  using (auth.uid() = developer_id);

-- Admins read all
drop policy if exists "admins read all projects" on projects;
create policy "admins read all projects"
  on projects for select
  using (has_permission('projects.manage'));

-- Members insert their own projects (status defaults to pending)
drop policy if exists "members submit projects" on projects;
create policy "members submit projects"
  on projects for insert
  with check (auth.uid() = developer_id);

-- Owner can update their own pending projects
drop policy if exists "owner updates own pending" on projects;
create policy "owner updates own pending"
  on projects for update
  using (auth.uid() = developer_id and status = 'pending');

-- Owner can delete their own pending projects
drop policy if exists "owner deletes own pending" on projects;
create policy "owner deletes own pending"
  on projects for delete
  using (auth.uid() = developer_id and status = 'pending');

-- Admins can do anything
drop policy if exists "admins manage projects" on projects;
create policy "admins manage projects"
  on projects for all
  using (has_permission('projects.manage'));

-- Add permission
insert into permissions (code, description, category) values
  ('projects.manage', 'Moderate and manage project showcase', 'projects')
on conflict (code) do nothing;

-- Grant to roles
insert into role_permissions (role, permission_code) values
  ('secretary',   'projects.manage'),
  ('ict',         'projects.manage'),
  ('president',   'projects.manage'),
  ('super_admin', 'projects.manage')
on conflict do nothing;