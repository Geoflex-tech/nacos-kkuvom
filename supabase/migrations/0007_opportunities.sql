-- ============================================
-- NACOS KKU VOM — Opportunities Board
-- Scholarships, internships, hackathons, etc.
-- ============================================

-- 1. Table
create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text,
  description text,
  category text not null check (category in (
    'scholarship',
    'internship',
    'siwes',
    'hackathon',
    'competition',
    'fellowship',
    'job',
    'training',
    'event'
  )),
  location text,
  deadline date,
  apply_url text,
  eligibility text,
  benefits text,
  is_featured boolean default false,
  status text default 'open' check (status in ('open', 'closed', 'archived')),
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 2. Indexes for common filters
create index if not exists idx_opportunities_category on opportunities(category);
create index if not exists idx_opportunities_status on opportunities(status);
create index if not exists idx_opportunities_deadline on opportunities(deadline);
create index if not exists idx_opportunities_featured on opportunities(is_featured);

-- 3. Enable RLS
alter table opportunities enable row level security;

-- 4. Public read (anyone can browse)
drop policy if exists "public read opportunities" on opportunities;
create policy "public read opportunities"
  on opportunities for select
  using (true);

-- 5. Execs with permission can write
drop policy if exists "manage opportunities" on opportunities;
create policy "manage opportunities"
  on opportunities for all
  using (has_permission('opportunities.manage'));

-- 6. Add permission code
insert into permissions (code, description, category) values
  ('opportunities.manage', 'Manage opportunities board', 'opportunities')
on conflict (code) do nothing;

-- 7. Grant to roles
insert into role_permissions (role, permission_code) values
  ('secretary',   'opportunities.manage'),
  ('ict',         'opportunities.manage'),
  ('president',   'opportunities.manage'),
  ('super_admin', 'opportunities.manage')
on conflict do nothing;

-- ============================================
-- 8. Seed with real opportunities
-- ============================================

insert into opportunities (
  title, organization, description, category, location, deadline,
  apply_url, eligibility, benefits, is_featured, status
) values

(
  'MTN Foundation Scholarship Scheme',
  'MTN Foundation',
  'Annual scholarship for Nigerian undergraduate students in public tertiary institutions. Covers tuition, book allowance, and monthly stipend for the duration of study.',
  'scholarship',
  'Nigeria',
  '2026-11-30',
  'https://www.mtnonline.com/mtnfoundation/scholarships',
  'Nigerian undergraduate in a public university, polytechnic, or college of education. Minimum CGPA of 3.0 (or equivalent).',
  'Full tuition, book allowance, monthly stipend',
  true,
  'open'
),

(
  'Google Summer of Code',
  'Google',
  'A global program that pays students to contribute to open-source projects over the summer. Work remotely with mentor organizations from around the world.',
  'internship',
  'Remote',
  '2026-04-15',
  'https://summerofcode.withgoogle.com/',
  'Students 18+ enrolled in a post-secondary program. Must be new to GSoC (not participated before).',
  'Stipend of $1,500 – $3,300 USD based on project size',
  true,
  'open'
),

(
  'Andela Fellowship Program',
  'Andela',
  'A 4-year paid apprenticeship program that trains world-class software engineers. Work with global companies while learning in a rigorous environment.',
  'fellowship',
  'Lagos / Remote',
  '2026-12-15',
  'https://andela.com/careers',
  'Strong fundamentals in programming. Proficiency in JavaScript, Python, or similar. Commitment to full-time learning.',
  'Paid apprenticeship, mentorship, global job placement',
  false,
  'open'
),

(
  'Federal Government NELFUND Student Loan',
  'Nigerian Education Loan Fund',
  'Federal government student loan scheme for Nigerian students in tertiary institutions. Covers tuition fees and upkeep allowance.',
  'scholarship',
  'Nigeria',
  '2026-12-31',
  'https://nelf.gov.ng/',
  'Nigerian student in a federal or state-owned tertiary institution. Must have a valid JAMB registration number.',
  'Tuition fees + monthly upkeep allowance',
  false,
  'open'
),

(
  'MTN Pulse Hackathon',
  'MTN Nigeria',
  'Annual hackathon challenging Nigerian students to build innovative solutions in fintech, agritech, health, or education using MTN APIs.',
  'hackathon',
  'Lagos',
  '2026-11-20',
  'https://www.mtn.ng/pulse/hackathon',
  'Undergraduate students in Nigerian universities. Teams of 2–4. Must use at least one MTN API.',
  'Cash prizes up to ₦5,000,000. Internship opportunities for top teams.',
  true,
  'open'
),

(
  'SIWES Placement — Tech Firms',
  'Various (NG Hub, CoLab, IHS Towers)',
  'Curated list of tech companies offering SIWES (Students Industrial Work Experience Scheme) placements for Computer Science students in Nigerian universities.',
  'siwes',
  'Multiple locations',
  '2027-01-31',
  'https://www.itf.gov.ng/siwes',
  '300L or 400L students. Must be registered for SIWES in your department. Usually 6 months commitment.',
  'Industry experience, stipend varies by company, ITF logbook credit',
  false,
  'open'
),

(
  'Microsoft Learn Student Ambassadors',
  'Microsoft',
  'Global program for student leaders passionate about technology. Lead your campus community, host events, and get access to Microsoft resources.',
  'fellowship',
  'Remote / Campus',
  '2026-12-31',
  'https://mvp.microsoft.com/studentambassadors',
  'Active student at a recognized institution. Passion for technology and community leadership.',
  'Azure credits, certifications, Microsoft swag, global network',
  false,
  'open'
),

(
  'Kaggle Competitions',
  'Kaggle',
  'Ongoing data science and machine learning competitions. Win prizes, build your portfolio, and get recognized by recruiters.',
  'competition',
  'Online',
  null,
  'https://www.kaggle.com/competitions',
  'Open to anyone. Skill level varies by competition.',
  'Cash prizes up to $100,000+. Kaggle medals and job opportunities.',
  false,
  'open'
),

(
  'Paystack Developer Program',
  'Paystack',
  'Free training and resources for developers building on Paystack. Includes API access, sandbox environments, and a community of builders.',
  'training',
  'Online',
  null,
  'https://paystack.com/developers',
  'Any developer interested in payments and fintech.',
  'Free API access, documentation, community access',
  false,
  'open'
),

(
  'DevCareer Tech Training',
  'DevCareer',
  'Free tech training program for Nigerians in software development, product design, data science, and more. Includes mentorship and job placement support.',
  'training',
  'Online',
  '2026-11-15',
  'https://devcareer.io/',
  'Nigerian youths aged 18–35. Access to laptop and internet required.',
  'Free training, mentorship, job placement support',
  true,
  'open'
);