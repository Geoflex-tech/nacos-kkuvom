import { Link } from "react-router-dom";
import { ArrowRight, Newspaper, Calendar, BookOpen, Users } from "lucide-react";

/*
  SPACING — pill bottom to seal top (the "gap")
  ─────────────────────────────────────────────
  Desktop  ≥1024px : 72px gap  → paddingTop = safe + 10 + 52 + 72 = 134px
  Tablet   640-1023px: 64px gap → paddingTop = safe + 10 + 52 + 64 = 126px
  Mobile   <640px  : 56px gap  → paddingTop = safe + 10 + 52 + 56 =  118px
  ─────────────────────────────────────────────
  Cards overlap: 56px desktop, 32px mobile
  Hero paddingBottom: 120px desktop, 80px mobile
*/

const FEATURES = [
  { key: "news",      label: "Latest News",     subLabel: (s) => s.news      != null ? `${s.news} article${s.news !== 1 ? "s" : ""}`         : null, icon: Newspaper, to: "/news",                 bg: "var(--color-blue-light)",   color: "var(--color-blue)"   },
  { key: "events",    label: "Upcoming Events", subLabel: (s) => s.events    != null ? `${s.events} event${s.events !== 1 ? "s" : ""}`        : null, icon: Calendar,  to: "/events",                bg: "var(--color-green-light)",  color: "var(--color-green)"  },
  { key: "resources", label: "Resources",       subLabel: (s) => s.resources != null ? `${s.resources} resource${s.resources !== 1 ? "s" : ""}`: null, icon: BookOpen,  to: "/dashboard/resources",   bg: "var(--color-blue-light)",   color: "var(--color-blue)"   },
  { key: "members",   label: "Members",         subLabel: (s) => s.members   != null ? `${s.members} member${s.members !== 1 ? "s" : ""}`     : null, icon: Users,     to: "/register",              bg: "var(--color-yellow-light)", color: "var(--color-yellow)" },
];

export default function Hero({ stats = {} }) {
  return (
    <>
      {/* ─────────────────────────────────────────────────
          HERO
          ───────────────────────────────────────────────── */}
      <section
        aria-label="Welcome to NACOS KKU VOM"
        className="hero-section"
      >
        {/* Glow: blue top-right */}
        <div className="hero-glow hero-glow--blue" aria-hidden="true" />
        {/* Glow: green bottom-left */}
        <div className="hero-glow hero-glow--green" aria-hidden="true" />

        <div className="container hero-content">

          {/* Seal */}
          <div className="hero-seal" aria-hidden="false">
            <img
              src="/logo.jpeg"
              alt="NACOS KKU VOM logo"
              loading="eager"
              className="hero-seal__img"
            />
          </div>

          {/* Badge */}
          <span className="hero-badge">
            Official Chapter Portal · 2026/2027
          </span>

          {/* Headline */}
          <h1 className="hero-headline">
            Empowering{" "}
            <span className="hero-headline__accent">Computing</span>{" "}
            Students at KKU Vom
          </h1>

          {/* Paragraph */}
          <p className="hero-para">
            The official digital home of NACOS KKU Vom Chapter — building
            skills, community, and a legacy of excellence one generation at a
            time.
          </p>

          {/* Buttons */}
          <div className="hero-btns">
            <Link to="/about" className="hero-btn hero-btn--solid">
              About Us <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link to="/events" className="hero-btn hero-btn--ghost">
              View Events
            </Link>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          FEATURE CARDS
          ───────────────────────────────────────────────── */}
      <div className="container hero-cards-wrap">
        <ul className="feature-grid" role="list" aria-label="Key sections">
          {FEATURES.map(({ key, label, subLabel, icon: Icon, to, bg, color }) => {
            const sub = subLabel(stats);
            return (
              <li key={key}>
                <Link to={to} aria-label={label} className="feat-card">
                  <div
                    className="feat-card__icon"
                    aria-hidden="true"
                    style={{ background: bg }}
                  >
                    <Icon size={16} color={color} strokeWidth={2} aria-hidden="true" />
                  </div>
                  <span className="feat-card__title">{label}</span>
                  {sub && <span className="feat-card__sub">{sub}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        /* ════════════════════════════════════════════════
           HERO SECTION
           ════════════════════════════════════════════════ */
        .hero-section {
          position: relative;
          display: flex;
          align-items: flex-start;
          overflow: hidden;
          background-color: #12245F;

          /* Pull section behind the fixed pill */
          margin-top: calc(-1 * (env(safe-area-inset-top, 0px) + 10px + 52px + 16px));

          /* Desktop: safe-area + pill(62px) + 72px gap = 134px */
          padding-top:    calc(env(safe-area-inset-top, 0px) + 10px + 52px + 72px);
          padding-bottom: 120px;
          min-height: 100svh;
          min-height: 100vh; /* fallback */
        }

        /* ── Glows ── */
        .hero-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .hero-glow--blue {
          top: -140px; right: -80px;
          width: 580px; height: 580px;
          background: radial-gradient(circle, rgba(30,64,175,0.52) 0%, transparent 70%);
        }
        .hero-glow--green {
          bottom: -140px; left: -60px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(5,150,105,0.22) 0%, transparent 70%);
        }

        /* ── Content wrapper ── */
        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
        }

        /* ── Seal ── */
        .hero-seal {
          width: 72px; height: 72px;
          border-radius: 50%;
          overflow: hidden;
          border: 2.5px solid rgba(255,255,255,0.35);
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.35);
          flex-shrink: 0;
        }
        .hero-seal__img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── Badge ── */
        .hero-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 9999px;
          padding: 5px 14px;
          margin-bottom: 22px;
          white-space: nowrap;
        }

        /* ── Headline ── */
        .hero-headline {
          font-size: clamp(2rem, 4vw, 3.25rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.1;
          margin: 0 0 18px;
          max-width: 640px;
        }
        .hero-headline__accent { color: #FCD34D; }

        /* ── Paragraph ── */
        .hero-para {
          font-size: clamp(0.9375rem, 1.5vw, 1rem);
          color: rgba(255,255,255,0.80);
          line-height: 1.65;
          max-width: 520px;
          margin: 0 0 32px;
        }

        /* ── Buttons ── */
        .hero-btns {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 46px;
          padding: 0 28px;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: transform 150ms ease-out, box-shadow 150ms ease-out, background 150ms ease-out;
        }
        .hero-btn--solid {
          background: #ffffff;
          color: #1E3A8A;
          box-shadow: 0 4px 14px rgba(0,0,0,0.22);
        }
        .hero-btn--solid:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.28);
        }
        .hero-btn--ghost {
          background: transparent;
          color: #ffffff;
          border: 1.5px solid rgba(255,255,255,0.45);
        }
        .hero-btn--ghost:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.70);
        }

        /* ════════════════════════════════════════════════
           FEATURE CARDS
           ════════════════════════════════════════════════ */
        .hero-cards-wrap {
          margin-top: -56px;
          position: relative;
          z-index: 10;
          padding-bottom: 8px;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .feat-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
          background: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          text-decoration: none;
          height: 100%;
          transition: transform 150ms ease-out, box-shadow 150ms ease-out;
        }
        .feat-card:hover,
        .feat-card:focus-visible {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
          outline: none;
        }
        .feat-card:focus-visible {
          outline: 2px solid var(--color-blue);
          outline-offset: 2px;
        }
        .feat-card__icon {
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .feat-card__title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.3;
        }
        .feat-card__sub {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          line-height: 1.4;
        }

        /* ════════════════════════════════════════════════
           TABLET  640–1023px
           ════════════════════════════════════════════════ */
        @media (min-width: 640px) and (max-width: 1023px) {
          .hero-section {
            padding-top: calc(env(safe-area-inset-top, 0px) + 10px + 52px + 64px);
          }
          .hero-seal { width: 64px; height: 64px; }
          .feature-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .hero-cards-wrap { margin-top: -40px; }
        }

        /* ════════════════════════════════════════════════
           MOBILE  <640px
           ════════════════════════════════════════════════ */
        @media (max-width: 639px) {
          .hero-section {
            margin-top:     calc(-1 * (env(safe-area-inset-top, 0px) + 10px + 52px + 16px));
            padding-top:    calc(env(safe-area-inset-top, 0px) + 10px + 52px + 56px);
            padding-bottom: 80px;
          }
          .hero-seal {
            width: 56px; height: 56px;
            margin-bottom: 16px;
          }
          .hero-badge {
            font-size: 9.5px;
            letter-spacing: 0.09em;
            padding: 5px 12px;
            margin-bottom: 16px;
          }
          .hero-headline {
            font-size: clamp(1.625rem, 7.5vw, 2rem);
            margin-bottom: 14px;
          }
          .hero-para {
            font-size: 0.9375rem;
            line-height: 1.6;
            margin-bottom: 26px;
          }
          .hero-btns {
            flex-direction: column;
            width: 100%;
            gap: 12px;
          }
          .hero-btn {
            width: 100%;
            height: 50px;
            font-size: 0.9375rem;
          }
          .feature-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .hero-cards-wrap { margin-top: -32px; }
          .feat-card { padding: 16px; gap: 8px; }
        }

        /* ════════════════════════════════════════════════
           SHORT VIEWPORT  (landscape phone / small laptop)
           ════════════════════════════════════════════════ */
        @media (max-height: 700px) and (min-width: 640px) {
          .hero-section {
            padding-top: calc(env(safe-area-inset-top, 0px) + 10px + 52px + 48px);
            min-height: unset;
            padding-bottom: 100px;
          }
          .hero-headline { font-size: clamp(1.75rem, 3.5vw, 2.75rem); }
          .hero-seal { width: 60px; height: 60px; }
        }
        @media (max-height: 420px) {
          .hero-section { padding-bottom: 72px; }
          .hero-seal { width: 44px; height: 44px; margin-bottom: 12px; }
          .hero-headline { font-size: 1.5rem; }
          .hero-para { display: none; }
        }

        /* ════════════════════════════════════════════════
           REDUCED MOTION
           ════════════════════════════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          .feat-card:hover,
          .hero-btn--solid:hover,
          .hero-btn--ghost:hover { transform: none; transition: none; }
        }
      `}</style>
    </>
  );
}
