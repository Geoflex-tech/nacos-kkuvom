-- ============================================
-- NACOS KKU VOM — Certificates
-- ============================================

create sequence if not exists certificates_seq start 1;

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_number text unique not null,
  member_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  issued_date date default current_date,
  signed_by text default 'NACOS KKU VOM Chapter',
  status text default 'valid' check (status in ('valid','revoked')),
  issued_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- Auto-generate certificate number
create or replace function generate_certificate_number()
returns trigger as $$
begin
  if new.certificate_number is null or new.certificate_number = '' then
    new.certificate_number :=
      'NACOS-KKU-' ||
      to_char(now(), 'YYYY') ||
      '-' ||
      lpad(nextval('certificates_seq')::text, 6, '0');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_generate_cert_number on certificates;
create trigger trg_generate_cert_number
  before insert on certificates
  for each row execute function generate_certificate_number();

-- Public verification function
create or replace function verify_certificate(code text)
returns table (
  certificate_number text,
  recipient_name text,
  title text,
  issued_date date,
  signed_by text,
  status text
) as $$
  select
    c.certificate_number,
    coalesce(p.full_name, 'Unknown') as recipient_name,
    c.title,
    c.issued_date,
    c.signed_by,
    c.status
  from certificates c
  left join profiles p on p.id = c.member_id
  where c.certificate_number = code
  limit 1;
$$ language sql security definer;

grant execute on function verify_certificate(text) to anon;
grant execute on function verify_certificate(text) to authenticated;