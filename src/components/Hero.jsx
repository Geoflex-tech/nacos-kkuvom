import { Link } from "react-router-dom";
import { ArrowRight, Newspaper, Calendar, BookOpen, Users } from "lucide-react";

const features = [
  { num: "01", label: "Latest News",     icon: Newspaper, to: "/news",     color: "var(--color-blue)"   },
  { num: "02", label: "Upcoming Events", icon: Calendar,  to: "/events",   color: "var(--color-green)"  },
  { num: "03", label: "Resources",       icon: BookOpen,  to: "/tech-hub", color: "var(--color-blue)"   },
  { num: "04", label: "Members",         icon: Users,     to: "/register", color: "var(--color-yellow)" },
];

/*
  SPACING CONSTANTS (desktop)
  ─────────────────────────────
  Navbar offset:          14px
  Navbar height:          52px
  Navbar-to-seal gap:     56px   ← was 40px
  Seal height:            88px
  Seal-to-badge:          28px   ← was 24px
  Badge-to-headline:      24px   ← was 20px
  Headline-to-paragraph:  20px   ← was 16px
  Paragraph-to-buttons:   32px   ← was 28px
  Below buttons:          64px
  Button gap:             16px   ← was 12px (~var(--space-2))

  paddingTop  = 14 + 52 + 56 = 122px
  marginTop   = -(14 + 52 + 16) = -82px  (pulls section behind fixed pill)
  paddingBottom = 64px

  SPACING CONSTANTS (mobile <640px)
  ─────────────────────────────
  Navbar offset:          10px
  Navbar height:          48px
  Navbar-to-seal gap:     40px
  Seal height:            72px
  Seal-to-badge:          20px
  Badge-to-headline:      16px
  Headline-to-paragraph:  16px
  Paragraph-to-buttons:   24px
  Below buttons:          48px

  paddingTop  = 10 + 48 + 40 = 98px
  marginTop   = -(10 + 48 + 16) = -74px
*/

export default function Hero() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        aria-label="Welcome to NACOS KKU VOM"
        className="hero-section"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",   /* top-align so content reads from near top */
          overflow: "hidden",
          /* desktop: pull up behind fixed pill */
          marginTop: "calc(-1 * (14px + 52px + 16px))",
          paddingTop:    "calc(14px + 52px + 56px)",   /* navbar + gap-to-seal */
          paddingBottom: "64px",
          minHeight: "100svh",
        }}
      >
        {/* Background image with blur */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/logo.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3px) brightness(0.35)",
            transform: "scale(1.05)",
            zIndex: 0,
          }}
        />

        {/* Blue gradient overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(30,58,138,0.92) 0%, rgba(30,64,175,0.80) 60%, rgba(5,150,105,0.50) 100%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          className="container hero-content"
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          {/* Seal — 88px desktop */}
          <div
            className="hero-seal"
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.4)",
              marginBottom: "28px",              /* seal → badge: 28px */
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
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

          {/* Badge / eyebrow */}
          <span
            className="hero-badge"
            style={{
              display: "inline-block",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--weight-semibold)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "var(--radius-pill)",
              padding: "0.3rem 1rem",
              marginBottom: "24px",              /* badge → headline: 24px */
            }}
          >
            Official Chapter Portal · 2026/2027
          </span>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(1.875rem, 4.5vw, 3.25rem)",
              fontWeight: "var(--weight-bold)",
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "20px",              /* headline → paragraph: 20px */
              maxWidth: "680px",
            }}
          >
            Empowering{" "}
            <span style={{ color: "#FCD34D" }}>Computing</span>{" "}
            Students at KKU Vom
          </h1>

          {/* Paragraph */}
          <p
            style={{
              fontSize: "var(--text-md)",
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.65,
              maxWidth: "560px",
              marginBottom: "32px",              /* paragraph → buttons: 32px */
            }}
          >
            The official digital home of NACOS KKU Vom Chapter — building
            skills, community, and a legacy of excellence one generation at a
            time.
          </p>

          {/* CTA buttons — 16px gap */}
          <div
            className="hero-btns"
            style={{
              display: "flex",
              gap: "16px",                       /* button gap: 16px */
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              to="/about"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "var(--radius-pill)",
                background: "#ffffff",
                color: "var(--color-blue-dark)",
                fontWeight: "var(--weight-bold)",
                fontSize: "var(--text-base)",
                boxShadow: "var(--shadow-md)",
                transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
            >
              About Us <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "var(--radius-pill)",
                background: "transparent",
                color: "#ffffff",
                border: "1.5px solid rgba(255,255,255,0.55)",
                fontWeight: "var(--weight-semibold)",
                fontSize: "var(--text-base)",
                transition: "background 150ms ease-out",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ─────────────────────────────────── */}
      <div
        className="container"
        style={{
          marginTop: "-3rem",
          position: "relative",
          zIndex: 10,
          paddingBottom: "var(--space-2)",
        }}
      >
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--space-2)",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="feature-grid"
          role="list"
          aria-label="Key sections"
        >
          {features.map(({ num, label, icon: Icon, to, color }) => (
            <li key={num}>
              <Link
                to={to}
                aria-label={label}
                className="feat-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                  padding: "var(--space-3)",
                  background: "#fff",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-md)",
                  textDecoration: "none",
                  transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "50%",
                    background: color === "var(--color-yellow)"
                      ? "var(--color-yellow-light)"
                      : color === "var(--color-green)"
                      ? "var(--color-green-light)"
                      : "var(--color-blue-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={color} strokeWidth={2} />
                </div>
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: "2rem",
                    fontWeight: "var(--weight-bold)",
                    color: "var(--color-border)",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-base)",
                    fontWeight: "var(--weight-semibold)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        /* ── Feature card hover ── */
        .feat-card:hover, .feat-card:focus-visible {
          transform: translateY(-4px) !important;
          box-shadow: var(--shadow-lg) !important;
          outline: none;
        }
        @media (max-width: 768px) {
          .feature-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── Mobile hero spacing (<640px) ── */
        @media (max-width: 639px) {
          .hero-section {
            margin-top:    calc(-1 * (10px + 48px + 16px)) !important;  /* -74px */
            padding-top:   calc(10px + 48px + 40px) !important;          /* 98px  */
            padding-bottom: 48px !important;
          }
          .hero-seal {
            width: 72px !important;
            height: 72px !important;
            margin-bottom: 20px !important;   /* seal → badge: 20px */
          }
          .hero-badge {
            margin-bottom: 16px !important;   /* badge → headline: 16px */
          }
          h1 { margin-bottom: 16px !important; }   /* headline → paragraph: 16px */
          .hero-content p { margin-bottom: 24px !important; }  /* paragraph → buttons: 24px */
          .hero-btns {
            flex-direction: column !important;
            width: 100% !important;
            gap: 12px !important;
          }
          .hero-btns a {
            width: 100% !important;
            justify-content: center !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .feat-card:hover { transform: none !important; }
        }
      `}</style>
    </>
  );
}
