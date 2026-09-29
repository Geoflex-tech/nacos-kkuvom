-- ============================================
-- NACOS KKU VOM — Strict Matric Number Validation
-- Format: KKU/YYYY/SC/NNN
-- ============================================

-- Add CHECK constraint (NOT VALID means existing rows are skipped,
-- only new inserts/updates are checked — safe for existing bad data)
alter table profiles
  drop constraint if exists profiles_matric_format_check;

alter table profiles
  add constraint profiles_matric_format_check
  check (
    matric_no is null
    or matric_no ~ '^KKU/[0-9]{4}/SC/[0-9]{3}$'
  ) not valid;

-- Optional: clean up existing matric that doesn't match
-- (uncomment to run — this NULLs out invalid matric)
-- update profiles
--   set matric_no = null
--   where matric_no is not null
--     and matric_no !~ '^KKU/[0-9]{4}/SC/[0-9]{3}$';

comment on constraint profiles_matric_format_check on profiles is
  'Enforces KKU/YYYY/SC/NNN matric format';