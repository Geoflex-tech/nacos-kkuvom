import { Link } from "react-router-dom";
import { ArrowRight, Newspaper, Calendar, BookOpen, Users } from "lucide-react";

/*
  SPACING CONSTANTS
  ─────────────────────────────────────────────────────
  Desktop (≥640px)
    Navbar offset + height:   10px + 52px = 62px (ends at 62px from top)
    Hero top padding:         62px + 40px = 102px  (+env(safe-area-inset-top))
    Hero bottom padding:      120px  (cards overlap by 56px, need ≥64px gap)
    marginTop:               -(env(safe-area-inset-top) + 10px + 52px + 16px)
    Seal:                     64px
    Seal → badge:             16px
    Badge → headline:         20px
    Headline:                 52px / weight 700 / line-height 1.1
    Headline → paragraph:     16px
    Paragraph:                16px / line-height 1.6 / max-width 520px
    Paragraph → buttons:      28px
    Buttons:                  44px tall, 12px gap

  Mobile (<640px)
    Hero top padding:         env(safe-area-inset-top) + 10px + 52px + 32px
    Hero bottom padding:      80px  (cards overlap by 32px, need ≥48px gap)
    marginTop:               -(env(safe-area-inset-top) + 10px + 52px + 16px)
    Seal:                     56px
    Seal → badge:             16px
    Badge → headline:         16px
    Headline:                 30px / line-height 1.15
    Headline → paragraph:     14px
    Paragraph:                15px / line-height 1.55
    Paragraph → buttons:      24px
    Buttons:                  full-width, 48px tall, stacked, 12px gap
  ─────────────────────────────────────────────────────
*/

/* ── Feature card config ─────────────────────────────────── */
const FEATURES = [
  { key: "news",      label: "Latest News",     subLabel: (s) => s.news      != null ? `${s.news} article${s.news !== 1 ? "s" : ""}` : null,      icon: Newspaper, to: "/news",         bg: "var(--color-blue-light)",   color: "var(--color-blue)"   },
  { key: "events",    label: "Upcoming Events", subLabel: (s) => s.events    != null ? `${s.events} event${s.events !== 1 ? "s" : ""}` : null,      icon: Calendar,  to: "/events",        bg: "var(--color-green-light)",  color: "var(--color-green)"  },
  { key: "resources", label: "Resources",       subLabel: (s) => s.resources != null ? `${s.resources} resource${s.resources !== 1 ? "s" : ""}` : null, icon: BookOpen,  to: "/dashboard/resources", bg: "var(--color-blue-light)", color: "var(--color-blue)"   },
  { key: "members",   label: "Members",         subLabel: (s) => s.members   != null ? `${s.members} member${s.members !== 1 ? "s" : ""}` : null,   icon: Users,     to: "/register",      bg: "var(--color-yellow-light)", color: "var(--color-yellow)" },
];

/* ── Hero ─────────────────────────────────────────────────── */
export default function Hero({ stats = {} }) {
  return (
    <>
      {/* ══════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════ */}
      <section
        aria-label="Welcome to NACOS KKU VOM"
        className="hero-section"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          overflow: "hidden",
          /* Pull section up behind the fixed pill */
          marginTop: "calc(-1 * (env(safe-area-inset-top, 0px) + 10px + 52px + 16px))",
          /* Desktop: safe-area + navbar (62px) + 40px gap = 102px */
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px + 52px + 40px)",
          paddingBottom: "120px",
          minHeight: "100svh",
          /* Flat navy base — glows are layered on top */
          backgroundColor: "#12245F",
        }}
      >
        {/* ── Glow 1: blue top-right ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(30,64,175,0.50) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Glow 2: green bottom-left ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-60px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(5,150,105,0.20) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Content ── */}
        <div
          className="container hero-content"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          {/* Seal — 64px desktop */}
          <div
            className="hero-seal"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.35)",
              marginBottom: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.jpeg"
              alt="NACOS KKU VOM logo"
              loading="eager"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Badge */}
          <span
            className="hero-badge"
            style={{
              display: "inline-block",
              fontSize: "0.6875rem",           /* 11px */
              fontWeight: 600,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: "9999px",
              padding: "0.3rem 0.875rem",
              marginBottom: "20px",
              whiteSpace: "nowrap",
            }}
          >
            Official Chapter Portal · 2026/2027
          </span>

          {/* Headline */}
          <h1
            className="hero-headline"
            style={{
              fontSize: "52px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "16px",
              maxWidth: "620px",
            }}
          >
            Empowering{" "}
            <span style={{ color: "#FCD34D" }}>Computing</span>{" "}
            Students at KKU Vom
          </h1>

          {/* Paragraph */}
          <p
            className="hero-para"
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.80)",
              lineHeight: 1.6,
              maxWidth: "520px",
              marginBottom: "28px",
            }}
          >
            The official digital home of NACOS KKU Vom Chapter — building
            skills, community, and a legacy of excellence one generation at a
            time.
          </p>

          {/* CTA buttons */}
          <div
            className="hero-btns"
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              to="/about"
              className="hero-btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                height: "44px",
                padding: "0 1.5rem",
                borderRadius: "9999px",
                background: "#ffffff",
                color: "#1E3A8A",
                fontWeight: 700,
                fontSize: "0.8125rem",
                boxShadow: "0 4px 14px rgba(0,0,0,0.20)",
                textDecoration: "none",
                transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.28)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.20)"; }}
            >
              About Us <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              to="/events"
              className="hero-btn-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "44px",
                padding: "0 1.5rem",
                borderRadius: "9999px",
                background: "transparent",
                color: "#ffffff",
                border: "1.5px solid rgba(255,255,255,0.45)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                textDecoration: "none",
                transition: "background 150ms ease-out, border-color 150ms ease-out",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.70)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)"; }}
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURE CARDS
          overlap hero bottom by 56px desktop / 32px mobile
          ══════════════════════════════════════════════════ */}
      <div
        className="container hero-cards-wrap"
        style={{
          marginTop: "-56px",
          position: "relative",
          zIndex: 10,
          paddingBottom: "var(--space-2)",
        }}
      >
        <ul
          className="feature-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          role="list"
          aria-label="Key sections"
        >
          {FEATURES.map(({ key, label, subLabel, icon: Icon, to, bg, color }) => {
            const sub = subLabel(stats);
            return (
              <li key={key}>
                <Link
                  to={to}
                  aria-label={label}
                  className="feat-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "20px",
                    background: "#fff",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-md)",
                    textDecoration: "none",
                    transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
                    height: "100%",
                  }}
                >
                  {/* Icon badge — 36px */}
                  <div
                    aria-hidden="true"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} color={color} strokeWidth={2} aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      lineHeight: 1.3,
                    }}
                  >
                    {label}
                  </span>

                  {/* Live count — only shown when data is available */}
                  {sub && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                        lineHeight: 1.4,
                      }}
                    >
                      {sub}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        /* ── Card hover / focus ──────────────────────────── */
        .feat-card:hover,
        .feat-card:focus-visible {
          transform: translateY(-3px) !important;
          box-shadow: var(--shadow-lg) !important;
          outline: none;
        }
        .feat-card:focus-visible {
          outline: 2px solid var(--color-blue);
          outline-offset: 2px;
        }

        /* ── Cards: 2 columns below 768px ───────────────── */
        @media (max-width: 767px) {
          .feature-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .hero-cards-wrap { margin-top: -32px !important; }
        }

        /* ── Mobile hero (<640px) ────────────────────────── */
        @media (max-width: 639px) {
          .hero-section {
            margin-top:     calc(-1 * (env(safe-area-inset-top, 0px) + 10px + 52px + 16px)) !important;
            padding-top:    calc(env(safe-area-inset-top, 0px) + 10px + 52px + 32px) !important;
            padding-bottom: 80px !important;
          }
          .hero-seal {
            width: 56px !important;
            height: 56px !important;
            margin-bottom: 16px !important;
          }
          .hero-badge {
            font-size: 0.625rem !important;    /* 10px */
            letter-spacing: 0.075em !important;
            padding: 0.275rem 0.75rem !important;
            margin-bottom: 16px !important;
          }
          .hero-headline {
            font-size: 30px !important;
            line-height: 1.15 !important;
            margin-bottom: 14px !important;
          }
          .hero-para {
            font-size: 15px !important;
            line-height: 1.55 !important;
            margin-bottom: 24px !important;
            /* 4 line clamp on very small screens */
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .hero-btns {
            flex-direction: column !important;
            width: 100% !important;
            gap: 12px !important;
          }
          .hero-btn-primary,
          .hero-btn-ghost {
            width: 100% !important;
            height: 48px !important;
          }
        }

        /* ── Short landscape / small desktop (≤800px height) ── */
        @media (max-height: 800px) and (min-width: 640px) {
          .hero-headline { font-size: 44px !important; }
          .hero-section  { padding-top: calc(env(safe-area-inset-top, 0px) + 10px + 52px + 32px) !important; }
        }

        /* ── Very short landscape phones (≤400px height) ── */
        @media (max-height: 400px) {
          .hero-section  { min-height: unset !important; padding-bottom: 80px !important; }
          .hero-headline { font-size: 26px !important; }
          .hero-seal     { width: 44px !important; height: 44px !important; }
        }

        /* ── Reduced motion ──────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .feat-card:hover { transform: none !important; }
          .hero-btn-primary,
          .hero-btn-ghost  { transition: none !important; }
        }
      `}</style>
    </>
  );
}
