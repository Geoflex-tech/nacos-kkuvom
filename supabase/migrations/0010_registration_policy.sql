-- ============================================
-- NACOS KKU VOM — Registration Policy
-- Restrict to Karl Kumm University + Computing departments
-- ============================================

-- 1. Add university column (defaults to Karl Kumm University)
alter table profiles
  add column if not exists university text default 'Karl Kumm University';

-- 2. Backfill existing rows
update profiles
  set university = 'Karl Kumm University'
  where university is null;

-- 3. Force existing department values to be valid
update profiles
  set department = 'Computer Science'
  where department is null
     or department not in ('Computer Science', 'Cyber Security', 'Information Technology');

-- 4. Add CHECK constraints
alter table profiles
  drop constraint if exists profiles_university_check;
alter table profiles
  add constraint profiles_university_check
  check (university = 'Karl Kumm University');

alter table profiles
  drop constraint if exists profiles_department_check;
alter table profiles
  add constraint profiles_department_check
  check (department in ('Computer Science', 'Cyber Security', 'Information Technology'));

-- 5. Update the auto-create trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, university, department)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'Karl Kumm University',
    coalesce(new.raw_user_meta_data->>'department', 'Computer Science')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- 6. Comments
comment on column profiles.university is 'Must be Karl Kumm University (enforced by CHECK constraint)';
comment on column profiles.department is 'Must be Computer Science, Cyber Security, or Information Technology';