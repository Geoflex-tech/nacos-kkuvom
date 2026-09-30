-- ============================================
-- NACOS KKU VOM — Row Level Security
-- Apply RLS + policies to all tables
-- ============================================

-- Enable RLS
alter table profiles enable row level security;
alter table news enable row level security;
alter table events enable row level security;
alter table executives enable row level security;
alter table gallery enable row level security;
alter table contact_messages enable row level security;
alter table resources enable row level security;
alter table announcements enable row level security;
alter table payments enable row level security;
alter table rsvps enable row level security;
alter table administrations enable row level security;
alter table permissions enable row level security;
alter table role_permissions enable row level security;
alter table certificates enable row level security;
alter table tech_hub_resources enable row level security;

-- PROFILES
drop policy if exists "read own profile" on profiles;
create policy "read own profile" on profiles for select using (auth.uid() = id);

drop policy if exists "update own profile" on profiles;
create policy "update own profile" on profiles for update using (auth.uid() = id);

drop policy if exists "execs read all profiles" on profiles;
create policy "execs read all profiles" on profiles for select using (is_exec_or_admin());

drop policy if exists "execs update profiles" on profiles;
create policy "execs update profiles" on profiles for update using (is_exec_or_admin());

-- PUBLIC CONTENT (read-only for everyone)
drop policy if exists "public read news" on news;
create policy "public read news" on news for select using (true);

drop policy if exists "public read events" on events;
create policy "public read events" on events for select using (true);

drop policy if exists "public read executives" on executives;
create policy "public read executives" on executives for select using (true);

drop policy if exists "public read gallery" on gallery;
create policy "public read gallery" on gallery for select using (true);

drop policy if exists "public read administrations" on administrations;
create policy "public read administrations" on administrations for select using (true);

drop policy if exists "public read tech hub" on tech_hub_resources;
create policy "public read tech hub" on tech_hub_resources for select using (true);

drop policy if exists "public insert contact" on contact_messages;
create policy "public insert contact" on contact_messages for insert with check (true);

-- EXEC WRITE POLICIES
drop policy if exists "execs write news" on news;
create policy "execs write news" on news for all using (has_permission('news.create'));

drop policy if exists "execs write events" on events;
create policy "execs write events" on events for all using (has_permission('events.create'));

drop policy if exists "execs write executives" on executives;
create policy "execs write executives" on executives for all using (has_permission('executives.manage'));

drop policy if exists "execs write gallery" on gallery;
create policy "execs write gallery" on gallery for all using (has_permission('gallery.manage'));

drop policy if exists "manage administrations" on administrations;
create policy "manage administrations" on administrations for all using (has_permission('administrations.manage'));

drop policy if exists "manage tech hub" on tech_hub_resources;
create policy "manage tech hub" on tech_hub_resources for all using (has_permission('techhub.manage'));

drop policy if exists "execs read messages" on contact_messages;
create policy "execs read messages" on contact_messages for select using (has_permission('messages.view'));

drop policy if exists "execs update messages" on contact_messages;
create policy "execs update messages" on contact_messages for update using (has_permission('messages.manage'));

-- PORTAL CONTENT (auth only)
drop policy if exists "members read resources" on resources;
create policy "members read resources" on resources for select using (auth.role() = 'authenticated');

drop policy if exists "execs write resources" on resources;
create policy "execs write resources" on resources for all using (has_permission('resources.manage'));

drop policy if exists "members read announcements" on announcements;
create policy "members read announcements" on announcements for select using (auth.role() = 'authenticated');

drop policy if exists "execs write announcements" on announcements;
create policy "execs write announcements" on announcements for all using (has_permission('announcements.create'));

-- PAYMENTS
drop policy if exists "read own payments" on payments;
create policy "read own payments" on payments for select using (auth.uid() = member_id);

drop policy if exists "insert own payments" on payments;
create policy "insert own payments" on payments for insert with check (auth.uid() = member_id);

drop policy if exists "execs read payments" on payments;
create policy "execs read payments" on payments for select using (has_permission('payments.view'));

-- RSVPs
drop policy if exists "read own rsvp" on rsvps;
create policy "read own rsvp" on rsvps for select using (auth.uid() = member_id);

drop policy if exists "insert own rsvp" on rsvps;
create policy "insert own rsvp" on rsvps for insert with check (auth.uid() = member_id);

drop policy if exists "update own rsvp" on rsvps;
create policy "update own rsvp" on rsvps for update using (auth.uid() = member_id);

drop policy if exists "execs read rsvps" on rsvps;
create policy "execs read rsvps" on rsvps for select using (is_exec_or_admin());

-- CERTIFICATES
drop policy if exists "member reads own certificates" on certificates;
create policy "member reads own certificates" on certificates for select using (auth.uid() = member_id);

drop policy if exists "issuers read all certificates" on certificates;
create policy "issuers read all certificates" on certificates for select using (has_permission('certificates.issue'));

drop policy if exists "issuers create certificates" on certificates;
create policy "issuers create certificates" on certificates for insert with check (has_permission('certificates.issue'));

drop policy if exists "issuers update certificates" on certificates;
create policy "issuers update certificates" on certificates for update using (has_permission('certificates.issue'));

drop policy if exists "issuers delete certificates" on certificates;
create policy "issuers delete certificates" on certificates for delete using (has_permission('certificates.issue'));

-- PERMISSIONS TABLES (readable to auth)
drop policy if exists "auth read permissions" on permissions;
create policy "auth read permissions" on permissions for select using (auth.role() = 'authenticated');

drop policy if exists "auth read role_permissions" on role_permissions;
create policy "auth read role_permissions" on role_permissions for select using (auth.role() = 'authenticated');