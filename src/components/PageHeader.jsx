/**
 * PageHeader — clean, minimal dark banner for all inner pages.
 *
 * Props:
 *   label       — small uppercase eyebrow (yellow)
 *   titleBold   — first part of h1, weight 700
 *   titleLight  — second part of h1, weight 300
 *   description — optional subtitle
 *   cta         — optional { label, href } yellow pill
 *
 * LAYERING (bottom → top)
 *   1. Navy base
 *   2. Blue glow (top-right) + green glow (bottom-right)
 *   3. Logo — monochrome, 20% opacity, right side
 *   4. Left→right overlay
 *   5. Text content
 */
export default function PageHeader({ label, titleBold, titleLight, description, cta }) {
  return (
    <header className="ph-wrap" aria-label={`${titleBold}${titleLight ? " " + titleLight : ""} page header`}>

      {/* 2 ── Glows ── */}
      <div className="ph-glow ph-glow--blue"  aria-hidden="true" />
      <div className="ph-glow ph-glow--green" aria-hidden="true" />

      {/* 3 ── Logo ── */}
      <div className="ph-logo" aria-hidden="true">
        <img src="/kku_logo.png" alt="" />
      </div>

      {/* 4 ── Overlay ── */}
      <div className="ph-overlay" aria-hidden="true" />

      {/* 5 ── Content ── */}
      <div className="ph-inner">
        <div className="ph-container">
          {label && <p className="ph-label">{label}</p>}

          <h1 className="ph-title">
            <span className="ph-bold">{titleBold}</span>
            {titleLight && <span className="ph-light"> {titleLight}</span>}
          </h1>

          {description && <p className="ph-desc">{description}</p>}

          {cta && <a href={cta.href} className="ph-cta">{cta.label}</a>}
        </div>
      </div>

      <style>{`
        /* ── 1. Wrapper / navy base ───────────────────── */
        .ph-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
          background-color: #0F1B4D;

          /* clear fixed pill: safe-area + 10px offset + 52px height + 48px gap */
          padding-top:    calc(env(safe-area-inset-top, 0px) + 10px + 52px + 48px);
          padding-bottom: 72px;
          min-height: 300px;

          display: flex;
          align-items: flex-end;

          /* slide behind fixed navbar pill */
          margin-top: calc(-1 * (env(safe-area-inset-top, 0px) + 10px + 52px + 16px));
        }

        /* ── 2. Glows ─────────────────────────────────── */
        .ph-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        /* Blue — top-right, 25% opacity */
        .ph-glow--blue {
          width: 500px;
          height: 500px;
          top: -200px;
          right: -100px;
          background: radial-gradient(circle, rgba(30,64,175,0.25) 0%, transparent 70%);
          z-index: 1;
        }
        /* Green — bottom-right, 18% opacity */
        .ph-glow--green {
          width: 500px;
          height: 500px;
          bottom: -200px;
          right: 5%;
          background: radial-gradient(circle, rgba(5,150,105,0.18) 0%, transparent 70%);
          z-index: 1;
        }

        /* ── 3. Logo ──────────────────────────────────── */
        .ph-logo {
          position: absolute;
          top: 50%;
          right: 8%;
          transform: translateY(-50%);
          width: 280px;
          height: 280px;
          pointer-events: none;
          z-index: 2;
        }
        .ph-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;

          /* monochrome — no original colors */
          filter: grayscale(1) brightness(1.4) contrast(0.9);

          /* 20% opacity desktop */
          opacity: 0.20;

          /* dissolve only the left edge */
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 25%);
          mask-image:         linear-gradient(to right, transparent 0%, #000 25%);
        }

        /* ── 4. Overlay ───────────────────────────────── */
        .ph-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(10,20,55,0.70)  0%,
            rgba(10,20,55,0.35) 100%
          );
          pointer-events: none;
          z-index: 3;
        }

        /* ── 5. Content ───────────────────────────────── */
        .ph-inner {
          position: relative;
          z-index: 4;
          width: 100%;
        }

        /* Shared container — matches navbar width and left edge */
        .ph-container {
          max-width: 1040px;
          margin: 0 auto;
          padding-inline: 24px;
          /* Constrain text to left 65% so it never touches the logo */
          max-width: min(1040px, 65vw + 24px);
        }

        .ph-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #FDD04A;
          margin: 0 0 12px 0;
        }

        .ph-title {
          font-size: clamp(2.5rem, 5.5vw, 4rem);
          line-height: 1.05;
          text-transform: uppercase;
          color: #ffffff;
          margin: 0 0 14px 0;
        }
        .ph-bold  { font-weight: 700; }
        .ph-light { font-weight: 300; }

        .ph-desc {
          font-size: 15px;
          color: rgba(255,255,255,0.75);
          max-width: 520px;
          line-height: 1.6;
          margin: 0 0 20px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ph-cta {
          display: inline-flex;
          align-items: center;
          padding: 9px 16px;
          border-radius: 999px;
          background: #FDD04A;
          color: #0F1B4D;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 150ms ease-out;
        }
        .ph-cta:hover { background: #EAB913; }

        /* ── Tablet 640–1023px ────────────────────────── */
        @media (max-width: 1023px) {
          .ph-wrap {
            min-height: 240px;
            padding-top:    calc(env(safe-area-inset-top, 0px) + 10px + 48px + 36px);
            padding-bottom: 48px;
            margin-top: calc(-1 * (env(safe-area-inset-top, 0px) + 10px + 48px + 16px));
          }
          .ph-logo {
            width: 180px;
            height: 180px;
          }
          .ph-container {
            max-width: 1040px;
            padding-inline: 16px;
          }
        }

        /* ── Mobile <640px ────────────────────────────── */
        @media (max-width: 639px) {
          .ph-wrap {
            min-height: 180px;
            padding-bottom: 32px;
          }
          .ph-title { font-size: 2rem; }

          .ph-logo {
            width: 110px;
            height: 110px;
            right: 4%;
          }
          .ph-logo img { opacity: 0.14; }

          /* Slightly stronger overlay on mobile to protect text */
          .ph-overlay {
            background: linear-gradient(
              90deg,
              rgba(10,20,55,0.82)  0%,
              rgba(10,20,55,0.50) 100%
            );
          }

          /* Text uses full width on small screens */
          .ph-container { max-width: 100%; }
        }

        /* ── Reduced motion ───────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .ph-cta { transition: none; }
        }
      `}</style>
    </header>
  );
}
