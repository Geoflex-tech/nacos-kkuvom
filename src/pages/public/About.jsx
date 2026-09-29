import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, MapPin, Mail, Phone } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { supabase } from "../../lib/supabase";

const CORE_VALUES = [
  { title: "Excellence",  desc: "We pursue the highest standards in academics, projects, and character."         },
  { title: "Community",   desc: "We grow together — no member is left behind in their journey."                  },
  { title: "Innovation",  desc: "We build, we experiment, we solve real problems with technology."               },
  { title: "Integrity",   desc: "We lead with honesty, transparency, and accountability."                        },
  { title: "Service",     desc: "We contribute to our department, university, and society."                      },
  { title: "Legacy",      desc: "We build systems that outlive our tenure and serve future generations."         },
];

const ACTIVITIES = [
  "Organize workshops, seminars, and tech bootcamps",
  "Host coding competitions and hackathons",
  "Facilitate mentorship and career development",
  "Maintain a resource hub for past questions and study materials",
  "Represent student interests to the department and university",
  "Connect members with alumni and industry professionals",
  "Document chapter history and institutional knowledge",
  "Issue verifiable certificates for training and achievements",
];

export default function About() {
  const [milestoneCount, setMilestoneCount] = useState(0);

  useEffect(() => {
    supabase
      .from("milestones")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setMilestoneCount(count || 0));
  }, []);

  return (
    <>
      <PageHeader
        label="NACOS KKU Vom Chapter"
        titleBold="ABOUT"
        titleLight="US"
        description="The Nigeria Association of Computing Students, Karl Kumm University, Vom Chapter — raising the next generation of Nigerian tech leaders."
      />

      <div className="ab-page">

        {/* ── Who We Are ────────────────────────────────── */}
        <section className="ab-section" aria-labelledby="ab-who">
          <h2 id="ab-who" className="ab-h2">Who We Are</h2>
          <p className="ab-body">
            NACOS KKU VOM Chapter is the official student body representing
            Computing students at Karl Kumm University, Vom, Plateau State.
            We are a community of learners, builders, and innovators — united
            by a shared passion for technology and a commitment to excellence.
          </p>
          <p className="ab-body">
            As the <strong>pioneer administration</strong> of this chapter, we
            carry a unique responsibility: to lay the foundation upon which
            every future generation of NACOS KKU students will build. Our work
            today becomes the legacy of tomorrow.
          </p>
        </section>

        {/* ── Mission ────────────────────────────────────── */}
        <section className="ab-accent-card ab-accent-card--blue" aria-labelledby="ab-mission">
          <h2 id="ab-mission" className="ab-accent-heading">Our Mission</h2>
          <p className="ab-accent-body">
            To foster academic excellence, professional development, and
            technological innovation among Computing students — equipping our
            members with the skills, network, and mindset to thrive in the
            ever-evolving tech industry.
          </p>
        </section>

        {/* ── Vision ─────────────────────────────────────── */}
        <section className="ab-accent-card ab-accent-card--green" aria-labelledby="ab-vision">
          <h2 id="ab-vision" className="ab-accent-heading">Our Vision</h2>
          <p className="ab-accent-body">
            To become a leading student tech community in Nigeria — renowned
            for producing world-class talent, driving innovation, and creating
            a lasting impact within Karl Kumm University and the broader
            Nigerian tech ecosystem.
          </p>
        </section>

        {/* ── Core Values ─────────────────────────────────── */}
        <section className="ab-section" aria-labelledby="ab-values">
          <h2 id="ab-values" className="ab-h2">Our Core Values</h2>
          <ul className="ab-values-grid" role="list">
            {CORE_VALUES.map(({ title, desc }) => (
              <li key={title} className="ab-value-card">
                <h3 className="ab-value-title">{title}</h3>
                <p className="ab-value-desc">{desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── What We Do ──────────────────────────────────── */}
        <section className="ab-section" aria-labelledby="ab-what">
          <h2 id="ab-what" className="ab-h2">What We Do</h2>
          <ul className="ab-activities-grid" role="list">
            {ACTIVITIES.map((item) => (
              <li key={item} className="ab-activity-item">
                <CheckCircle2
                  size={16}
                  aria-hidden="true"
                  style={{ color: "var(--color-green)", flexShrink: 0, marginTop: "2px" }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Pioneer Note ─────────────────────────────────── */}
        <section className="ab-pioneer" aria-labelledby="ab-pioneer-heading">
          <p className="ab-pioneer__eyebrow">A Note on Legacy</p>
          <h2 id="ab-pioneer-heading" className="ab-h2" style={{ color: "#fff" }}>The Pioneer Administration</h2>
          <p className="ab-pioneer__body">
            This is the founding administration of NACOS KKU VOM Chapter
            (2026/2027 session). Every system we build — the portal, the
            certificate registry, the resource hub, the chapter history — is
            designed to outlive our tenure.
          </p>
          <p className="ab-pioneer__body">
            When future administrations take over, they will inherit a
            functioning digital institution — not a blank slate. And every
            generation that follows will be able to look back and see exactly
            what we built, what we achieved, and how it all began.
          </p>
          <Link to="/history" className="ab-pioneer__link">
            Explore Chapter History →
          </Link>
        </section>

        {/* ── Where We Are ─────────────────────────────────── */}
        <section className="ab-section" aria-labelledby="ab-where">
          <h2 id="ab-where" className="ab-h2">Where We Are</h2>
          <div className="ab-contact-card">
            <div className="ab-contact-row">
              <MapPin size={16} aria-hidden="true" className="ab-contact-icon" />
              <span>Karl Kumm University, Vom, Plateau State, Nigeria</span>
            </div>
            <div className="ab-contact-row">
              <Mail size={16} aria-hidden="true" className="ab-contact-icon" />
              <a href="mailto:nacoskkuvom@gmail.com" className="ab-contact-link">
                nacoskkuvom@gmail.com
              </a>
            </div>
            <div className="ab-contact-row">
              <Phone size={16} aria-hidden="true" className="ab-contact-icon" />
              <a href="tel:09084850109" className="ab-contact-link">0908 485 0109</a>
            </div>
          </div>
        </section>

        {/* ── Milestones teaser (shown only when data exists) ── */}
        {milestoneCount > 0 && (
          <section className="ab-accent-card ab-accent-card--subtle" aria-labelledby="ab-story">
            <p className="ab-eyebrow-green">Our Story</p>
            <h2 id="ab-story" className="ab-accent-heading">A Chapter with History</h2>
            <p className="ab-accent-body">
              From our founding moments to present-day milestones — the full story of
              NACOS KKU VOM Chapter is documented, milestone by milestone.
            </p>
            <Link to="/history" className="ab-text-link">Read our history →</Link>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="ab-cta" aria-label="Join the chapter">
          <h2 className="ab-cta__heading">Join the Chapter</h2>
          <p className="ab-cta__sub">
            Are you a Computing student at Karl Kumm University? Become a
            registered member today and be part of the foundation.
          </p>
          <div className="ab-cta__btns">
            <Link to="/register" className="btn btn-primary">Register Now</Link>
            <Link to="/leadership" className="ab-cta__ghost-btn">Meet Our Team</Link>
          </div>
        </section>

      </div>

      <style>{`
        /* ── Page wrapper ── */
        .ab-page {
          max-width: 860px;
          margin-inline: auto;
          padding-inline: 24px;
          padding-top: 56px;
          padding-bottom: 80px;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        /* ── Generic section ── */
        .ab-section { display: flex; flex-direction: column; gap: 16px; }

        .ab-h2 {
          font-size: clamp(1.25rem, 3vw, 1.5rem);
          font-weight: 700;
          color: var(--color-blue-dark);
          margin: 0;
        }

        .ab-body {
          font-size: var(--text-base);
          color: var(--color-text-secondary);
          line-height: 1.75;
          margin: 0;
        }

        /* ── Accent cards (mission / vision / subtle) ── */
        .ab-accent-card {
          padding: 28px 24px;
          border-radius: var(--radius-lg);
          border-left: 4px solid transparent;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ab-accent-card--blue {
          background: var(--color-blue-light);
          border-left-color: var(--color-blue);
        }
        .ab-accent-card--green {
          background: var(--color-green-light);
          border-left-color: var(--color-green);
        }
        .ab-accent-card--subtle {
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-left: 4px solid var(--color-blue);
        }

        .ab-accent-heading {
          font-size: clamp(1.125rem, 2.5vw, 1.375rem);
          font-weight: 700;
          color: var(--color-blue-dark);
          margin: 0;
        }

        .ab-accent-body {
          font-size: var(--text-base);
          color: var(--color-text-secondary);
          line-height: 1.75;
          margin: 0;
        }

        /* ── Core values grid ── */
        .ab-values-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .ab-value-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ab-value-title {
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--color-blue-dark);
          margin: 0;
        }
        .ab-value-desc {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Activities grid ── */
        .ab-activities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .ab-activity-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 14px 16px;
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        /* ── Pioneer section ── */
        .ab-pioneer {
          background: linear-gradient(135deg, var(--color-blue-dark) 0%, var(--color-blue) 60%, #0D9488 100%);
          border-radius: var(--radius-xl);
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ab-pioneer__eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #FCD34D;
          margin: 0;
        }
        .ab-pioneer__body {
          font-size: var(--text-base);
          color: rgba(255,255,255,0.85);
          line-height: 1.75;
          margin: 0;
        }
        .ab-pioneer__link {
          display: inline-block;
          color: #FCD34D;
          font-weight: 600;
          font-size: var(--text-sm);
          text-decoration: none;
          transition: opacity 150ms ease-out;
        }
        .ab-pioneer__link:hover { opacity: 0.8; }

        /* ── Contact card ── */
        .ab-contact-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ab-contact-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: var(--text-base);
          color: var(--color-text-secondary);
        }
        .ab-contact-icon { color: var(--color-blue); }
        .ab-contact-link {
          color: var(--color-green);
          text-decoration: none;
        }
        .ab-contact-link:hover { text-decoration: underline; }
        .ab-contact-link:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }

        /* ── Eyebrow (green variant) ── */
        .ab-eyebrow-green {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--color-green);
          margin: 0;
        }

        /* ── Text link ── */
        .ab-text-link {
          display: inline-block;
          color: var(--color-blue);
          font-weight: 600;
          font-size: var(--text-sm);
          text-decoration: none;
          transition: color 150ms ease-out;
        }
        .ab-text-link:hover { color: var(--color-blue-hover); }

        /* ── CTA banner ── */
        .ab-cta {
          background: linear-gradient(135deg, var(--color-blue-dark), var(--color-green));
          border-radius: var(--radius-xl);
          padding: 40px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .ab-cta__heading {
          font-size: clamp(1.25rem, 3vw, 1.75rem);
          font-weight: 700;
          color: #fff;
          margin: 0;
        }
        .ab-cta__sub {
          font-size: var(--text-base);
          color: rgba(255,255,255,0.82);
          max-width: 44ch;
          line-height: 1.65;
          margin: 0;
        }
        .ab-cta__btns {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 8px;
        }
        .ab-cta__ghost-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          padding: 0 24px;
          border-radius: var(--radius-pill);
          border: 1.5px solid rgba(255,255,255,0.50);
          color: #fff;
          font-size: var(--text-base);
          font-weight: var(--weight-semibold);
          text-decoration: none;
          transition: background 150ms ease-out, border-color 150ms ease-out;
          white-space: nowrap;
        }
        .ab-cta__ghost-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.80);
        }
        .ab-cta__ghost-btn:focus-visible {
          outline: 2px solid #FCD34D;
          outline-offset: 2px;
        }

        /* ── Tablet ── */
        @media (max-width: 768px) {
          .ab-page { gap: 40px; padding-top: 40px; padding-bottom: 60px; }
          .ab-pioneer { padding: 28px 24px; }
          .ab-cta { padding: 32px 20px; }
        }

        /* ── Mobile ── */
        @media (max-width: 639px) {
          .ab-page { padding-inline: 16px; gap: 32px; padding-top: 32px; }
          .ab-values-grid { grid-template-columns: 1fr; }
          .ab-activities-grid { grid-template-columns: 1fr; }
          .ab-pioneer { padding: 24px 20px; }
          .ab-cta { padding: 28px 20px; }
          .ab-cta__btns { flex-direction: column; width: 100%; }
          .ab-cta__btns .btn,
          .ab-cta__ghost-btn { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ab-pioneer__link,
          .ab-text-link,
          .ab-cta__ghost-btn,
          .ab-contact-link { transition: none; }
        }
      `}</style>
    </>
  );
}
