-- Seed: NACOS KKU Opens Executive Positions for Contest
-- Run this once in the Supabase SQL Editor or via: supabase db push

INSERT INTO news (title, slug, body, author, created_at)
VALUES (
  'NACOS KKU Opens Executive Positions for Contest',
  'nacos-kku-opens-executive-positions-for-contest',
  'As we prepare to return to campus for a new academic session, the National Association of Computing Students (NACOS), Karl-Kumm University (KKU), welcomes all members back and wishes everyone a productive session ahead.

The tenure of the current NACOS KKU executive team has officially come to an end. In line with the association''s commitment to continuity, service, and inclusive leadership, the following executive positions are now open for interested and eligible members to contest:

**President** — ₦10,000
**Vice President** — ₦7,000
**Secretary-General** — ₦8,000
**Assistant Secretary-General** — ₦7,000
**Financial Secretary** — ₦8,000
**Treasurer** — ₦7,000
**Public Relations Officer (PRO)** — ₦5,000
**Director of Software** — ₦5,000
**Director of Socials** — ₦5,000

### Eligibility

Only 400-level students are eligible to contest for the positions of:

- President
- Secretary-General
- Treasurer

This is an opportunity for passionate and committed NACOS members to step forward, share their ideas, and contribute to the growth and development of the association.

Leadership is an opportunity to serve, take responsibility, and build upon the progress already made. Interested students are encouraged to begin their preparations ahead of the election process.

Welcome back in advance, great NACOSITES!

Together, we continue to build a stronger NACOS KKU.',
  'NACOS KKU Vom Chapter',
  NOW()
)
ON CONFLICT (slug) DO NOTHING;
