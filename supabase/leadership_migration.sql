-- ================================================================
-- NACOS KKU VOM — Leadership Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- 1. Add new columns to executives table
alter table executives
  add column if not exists rank         smallint,
  add column if not exists tier         text check (tier in ('executive','directors','discipline')),
  add column if not exists status       text not null default 'filled'
                                        check (status in ('filled','vacant')),
  add column if not exists slug         text unique,
  add column if not exists bio          text,
  add column if not exists department   text,
  add column if not exists social_links jsonb;

-- 2. Fix typos on existing rows
update executives
  set position = 'Treasurer'
  where id = '95e0dadf-bbab-403f-bd70-ec76598c6b23';

update executives
  set position = 'Director of Software'
  where id = '6ff215bd-bb29-40d9-bdea-01ba6da7f331';

-- 3. Set rank/tier/slug/status on the 3 filled leaders
update executives
  set rank = 1, tier = 'executive', slug = 'president', status = 'filled'
  where id = '8921eb1c-1816-4786-b848-876c18928e9f';

update executives
  set rank = 6, tier = 'executive', slug = 'treasurer', status = 'filled'
  where id = '95e0dadf-bbab-403f-bd70-ec76598c6b23';

update executives
  set rank = 8, tier = 'directors', slug = 'director-of-software', status = 'filled'
  where id = '6ff215bd-bb29-40d9-bdea-01ba6da7f331';

-- 4. Insert the 10 vacant positions
insert into executives
  (name, position, rank, tier, slug, status, administration_id, order_index)
values
  (null,'Vice President',               2, 'executive', 'vice-president',         'vacant','c7cdd427-6f94-4aa0-8ace-89a33da52a03', 2),
  (null,'Secretary-General',            3, 'executive', 'secretary-general',      'vacant','c7cdd427-6f94-4aa0-8ace-89a33da52a03', 3),
  (null,'Assistant Secretary-General',  4, 'executive', 'asst-secretary-general', 'vacant','c7cdd427-6f94-4aa0-8ace-89a33da52a03', 4),
  (null,'Financial Secretary',          5, 'executive', 'financial-secretary',    'vacant','c7cdd427-6f94-4aa0-8ace-89a33da52a03', 5),
  (null,'Public Relations Officer (PRO)',7,'executive', 'pro',                    'vacant','c7cdd427-6f94-4aa0-8ace-89a33da52a03', 7),
  (null,'Director of Hardware',         9, 'directors', 'director-of-hardware',   'vacant','c7cdd427-6f94-4aa0-8ace-89a33da52a03', 9),
  (null,'Director of Welfare',         10, 'directors', 'director-of-welfare',    'vacant','c7cdd427-6f94-4aa0-8ace-89a33da52a03',10),
  (null,'Director of Socials',         11, 'directors', 'director-of-socials',    'vacant','c7cdd427-6f94-4aa0-8ace-89a33da52a03',11),
  (null,'Director of Sports',          12, 'directors', 'director-of-sports',     'vacant','c7cdd427-6f94-4aa0-8ace-89a33da52a03',12),
  (null,'Provost',                     13, 'discipline','provost',                'vacant','c7cdd427-6f94-4aa0-8ace-89a33da52a03',13);

-- 5. RLS policies (public read, authenticated admin write)
alter table executives enable row level security;

-- Drop old policies if any exist
drop policy if exists "public_read_executives"   on executives;
drop policy if exists "admin_write_executives"   on executives;
drop policy if exists "Enable read access for all users" on executives;

-- Public can read all executives
create policy "public_read_executives"
  on executives for select
  to anon, authenticated
  using (true);

-- Only authenticated admins/presidents can insert/update/delete
create policy "admin_insert_executives"
  on executives for insert
  to authenticated
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin','super_admin','president')
    )
  );

create policy "admin_update_executives"
  on executives for update
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin','super_admin','president')
    )
  )
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin','super_admin','president')
    )
  );

create policy "admin_delete_executives"
  on executives for delete
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin','super_admin','president')
    )
  );

-- 6. Verify — should return 13 rows
select rank, tier, slug, position, status, name, level
from executives
where administration_id = 'c7cdd427-6f94-4aa0-8ace-89a33da52a03'
order by rank;
