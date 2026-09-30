-- ============================================
-- NACOS KKU VOM — Permissions System
-- Role-based permission matrix
-- ============================================

-- 1. Permissions catalog
create table if not exists permissions (
  code text primary key,
  description text,
  category text
);

-- 2. Role → permission mapping
create table if not exists role_permissions (
  role text not null,
  permission_code text not null references permissions(code) on delete cascade,
  primary key (role, permission_code)
);

-- 3. Seed permissions
insert into permissions (code, description, category) values
  ('members.view',           'View member list',                    'members'),
  ('members.approve',        'Approve or reject members',            'members'),
  ('members.manage',         'Change roles, manage member accounts', 'members'),
  ('events.view',            'View events',                          'events'),
  ('events.create',          'Create events',                        'events'),
  ('events.update',          'Update events',                        'events'),
  ('events.delete',          'Delete events',                        'events'),
  ('announcements.create',   'Create announcements',                 'announcements'),
  ('announcements.update',   'Update announcements',                 'announcements'),
  ('announcements.delete',   'Delete announcements',                 'announcements'),
  ('news.create',            'Create news posts',                    'news'),
  ('news.update',            'Update news posts',                    'news'),
  ('news.delete',            'Delete news posts',                    'news'),
  ('gallery.manage',         'Manage gallery images',                'gallery'),
  ('resources.manage',       'Manage resources',                     'resources'),
  ('techhub.manage',         'Manage Tech Hub resources',            'techhub'),
  ('executives.manage',      'Manage executives',                    'executives'),
  ('administrations.manage', 'Manage administrations & history',     'administrations'),
  ('certificates.issue',     'Issue certificates',                   'certificates'),
  ('payments.view',          'View payment records',                 'payments'),
  ('messages.view',          'View contact messages',                'messages'),
  ('messages.manage',        'Manage contact messages',              'messages'),
  ('history.manage',         'Manage chapter history',               'history')
on conflict (code) do nothing;

-- 4. Helper function: does the current user have a permission?
create or replace function has_permission(perm text)
returns boolean as $$
  select exists (
    select 1
    from profiles p
    join role_permissions rp on rp.role = p.role
    where p.id = auth.uid()
      and rp.permission_code = perm
  );
$$ language sql security definer;

-- 5. Helper function: any exec-level role
create or replace function is_exec_or_admin()
returns boolean as $$
  select exists (
    select 1
    from profiles p
    join role_permissions rp on rp.role = p.role
    where p.id = auth.uid()
  );
$$ language sql security definer;

-- 6. Role → permission mappings
-- Secretary
insert into role_permissions (role, permission_code) values
  ('secretary', 'members.view'),
  ('secretary', 'events.view'),
  ('secretary', 'events.create'),
  ('secretary', 'events.update'),
  ('secretary', 'announcements.create'),
  ('secretary', 'announcements.update'),
  ('secretary', 'announcements.delete'),
  ('secretary', 'news.create'),
  ('secretary', 'news.update'),
  ('secretary', 'news.delete'),
  ('secretary', 'gallery.manage'),
  ('secretary', 'resources.manage'),
  ('secretary', 'techhub.manage'),
  ('secretary', 'certificates.issue'),
  ('secretary', 'messages.view'),
  ('secretary', 'messages.manage')
on conflict do nothing;

-- Treasurer
insert into role_permissions (role, permission_code) values
  ('treasurer', 'members.view'),
  ('treasurer', 'events.view'),
  ('treasurer', 'payments.view'),
  ('treasurer', 'messages.view')
on conflict do nothing;

-- ICT
insert into role_permissions (role, permission_code) values
  ('ict', 'members.view'),
  ('ict', 'events.view'),
  ('ict', 'events.create'),
  ('ict', 'events.update'),
  ('ict', 'news.create'),
  ('ict', 'news.update'),
  ('ict', 'gallery.manage'),
  ('ict', 'resources.manage'),
  ('ict', 'techhub.manage'),
  ('ict', 'messages.view')
on conflict do nothing;

-- President — full access
insert into role_permissions (role, permission_code)
  select 'president', code from permissions
on conflict do nothing;

-- Super admin — full access
insert into role_permissions (role, permission_code)
  select 'super_admin', code from permissions
on conflict do nothing;