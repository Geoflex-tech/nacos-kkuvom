-- ============================================
-- NACOS KKU VOM — Extend executives table
-- Adds: department, bio, social_links
-- ============================================

alter table executives
  add column if not exists department text,
  add column if not exists bio text,
  add column if not exists social_links jsonb default '{}'::jsonb;

-- Index on administration for faster filtering
create index if not exists idx_executives_administration
  on executives(administration_id);

-- Comment for documentation
comment on column executives.department is 'Academic department (e.g. Computer Science)';
comment on column executives.bio is 'Short biography';
comment on column executives.social_links is 'JSON object of social links, e.g. {"twitter":"...","linkedin":"..."}';