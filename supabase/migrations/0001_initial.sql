-- ============================================
-- NACOS KKU VOM — Initial Schema
-- Creates: profiles + auth trigger + core content tables
-- ============================================

-- 1. Profiles (linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  matric_no text unique,
  level text,
  department text default 'Computer Science',
  phone text,
  avatar_url text,
  role text default 'member' check (role in ('member','exec','secretary','treasurer','ict','president','super_admin','admin')),
  status text default 'pending' check (status in ('pending','approved','rejected')),
  dues_paid boolean default false,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. News
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  body text,
  cover_image text,
  author text,
  published_at timestamptz default now()
);

-- 3. Events
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  event_date timestamptz,
  cover_image text,
  created_at timestamptz default now()
);

-- 4. Executives
create table if not exists executives (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  level text,
  image_url text,
  email text,
  phone text,
  order_index int default 0,
  created_at timestamptz default now()
);

-- 5. Gallery
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  uploaded_at timestamptz default now()
);

-- 6. Contact messages
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  subject text,
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

-- 7. Resources (past questions, materials)
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  course_code text,
  level text,
  file_url text not null,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 8. Announcements
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  audience text default 'all' check (audience in ('all','members','execs')),
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 9. Payments
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references profiles(id) on delete cascade,
  amount numeric not null,
  reference text unique not null,
  status text default 'pending' check (status in ('pending','success','failed')),
  purpose text default 'dues',
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- 10. RSVPs
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  member_id uuid references profiles(id) on delete cascade,
  status text default 'going' check (status in ('going','maybe','not_going')),
  created_at timestamptz default now(),
  unique(event_id, member_id)
);