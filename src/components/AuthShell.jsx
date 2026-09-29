/**
 * AuthShell
 *
 * Shared split-screen chrome for all four auth pages.
 *
 * Desktop (≥900px):
 *   Left panel  — flat navy #12245F, logo, tagline, two soft glows
 *   Right panel — white, form content centred at max-width 380px
 *
 * Mobile (<900px):
 *   Compact navy header strip + form below; back-link under the form
 *
 * Props:
 *   headline  — string in the left panel, e.g. "Welcome back."
 *   subtext   — one supporting sentence in #C9D6F5
 *   children  — the form / card rendered in the right panel
 */
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AuthShell({ headline, subtext, children }) {
  return (
    <div className="as-root">

      {/* ── LEFT BRAND PANEL (desktop only) ───────────────── */}
      <aside className="as-brand" aria-label="NACOS KKU Vom member portal">
        <div className="as-glow as-glow--blue"  aria-hidden="true" />
        <div className="as-glow as-glow--green" aria-hidden="true" />

        {/* Top: logo + name */}
        <div className="as-brand-top">
          <span className="as-logo-ring">
            <img src="/logo.jpeg" alt="" className="as-logo-img" />
          </span>
          <span className="as-brand-name">NACOS KKU Vom</span>
        </div>

        {/* Centre: copy */}
        <div className="as-brand-copy">
          <p className="as-eyebrow">Member Portal</p>
          <p className="as-headline">{headline}</p>
          {subtext && <p className="as-subtext">{subtext}</p>}
        </div>

        {/* Bottom: copyright */}
        <p className="as-brand-foot">
          © {new Date().getFullYear()} NACOS KKU Vom Chapter
        </p>
      </aside>

      {/* ── RIGHT FORM PANEL ───────────────────────────────── */}
      <main className="as-panel" id="main-content">

        {/* Mobile header strip — navy bar with logo */}
        <div className="as-mob-bar" aria-hidden="true">
          <span className="as-logo-ring as-logo-ring--sm">
            <img src="/logo.jpeg" alt="" className="as-logo-img" />
          </span>
          <span className="as-mob-name">NACOS KKU Vom</span>
        </div>

        {/* Back-to-website link — top-right desktop, below form mobile */}
        <Link to="/" className="as-back">
          <ArrowLeft size={13} aria-hidden="true" />
          Back to website
        </Link>

        {/* Actual form content */}
        <div className="as-form-wrap">
          {children}
        </div>

      </main>

      <style>{`
        /* ── Shell ─────────────────────────────────────────── */
        .as-root {
          display: flex;
          min-height: 100vh;
        }

        /* ── Left panel ────────────────────────────────────── */
        .as-brand {
          display: none;          /* hidden on mobile */
          position: relative;
          width: 50%;
          flex-shrink: 0;
          background: #12245F;
          overflow: hidden;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 48px;
        }

        /* Glows */
        .as-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .as-glow--blue {
          width: 500px; height: 500px;
          top: -180px; right: -120px;
          background: radial-gradient(circle, rgba(30,64,175,0.55) 0%, transparent 65%);
          z-index: 0;
        }
        .as-glow--green {
          width: 420px; height: 420px;
          bottom: -150px; left: -80px;
          background: radial-gradient(circle, rgba(5,150,105,0.22) 0%, transparent 65%);
          z-index: 0;
        }

        /* All brand content above glows */
        .as-brand-top,
        .as-brand-copy,
        .as-brand-foot { position: relative; z-index: 1; }

        /* Logo ring */
        .as-logo-ring {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.80);
          overflow: hidden;
          background: #fff;
          flex-shrink: 0;
        }
        .as-logo-ring--sm { width: 28px; height: 28px; }
        .as-logo-img {
          width: 100%; height: 100%;
          object-fit: contain; display: block;
        }

        .as-brand-top {
          display: flex; align-items: center; gap: 12px;
        }
        .as-brand-name {
          font-size: 0.9375rem; font-weight: 700;
          color: #fff; letter-spacing: 0.01em;
        }

        .as-brand-copy { margin-block: auto; }

        .as-eyebrow {
          font-size: 10px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          color: #FDD04A; margin: 0 0 14px;
        }
        .as-headline {
          font-size: clamp(1.75rem, 2.4vw, 2rem);
          font-weight: 700; color: #fff;
          line-height: 1.15; margin: 0 0 14px;
        }
        .as-subtext {
          font-size: 0.875rem; color: #C9D6F5;
          max-width: 320px; line-height: 1.65; margin: 0;
        }
        .as-brand-foot {
          font-size: 11px; color: rgba(255,255,255,0.28); margin: 0;
        }

        /* ── Right panel ───────────────────────────────────── */
        .as-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #fff;
          position: relative;
          min-height: 100vh;
        }

        /* Mobile navy bar */
        .as-mob-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 20px;
          background: #12245F;
        }
        .as-mob-name {
          font-size: 0.875rem; font-weight: 700; color: #fff;
        }

        /* Back link */
        .as-back {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.8125rem; font-weight: 500;
          color: #6B7280; text-decoration: none;
          padding: 14px 20px 0;
          transition: color 150ms ease-out;
          align-self: flex-start;
        }
        .as-back:hover { color: #1E3A8A; }
        .as-back:focus-visible {
          outline: 2px solid #1E40AF; outline-offset: 2px; border-radius: 4px;
        }

        /* Form centring wrap */
        .as-form-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 28px 20px 48px;
          width: 100%;
          max-width: 420px;
          margin-inline: auto;
        }

        /* ── Desktop ≥900px ────────────────────────────────── */
        @media (min-width: 900px) {
          .as-brand     { display: flex; }
          .as-mob-bar   { display: none; }

          .as-back {
            position: absolute;
            top: 20px; right: 24px;
            padding: 0;
          }

          .as-form-wrap {
            padding: 72px 48px 56px;
            max-width: 476px;   /* 380px form + 48px padding each side */
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .as-back { transition: none; }
        }
      `}</style>
    </div>
  );
}
