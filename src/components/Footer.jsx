/**
 * Footer — public site footer
 *
 * Design:
 *  - Background: #12245F (deepest navy, matches hero/page banners)
 *  - 3-col grid: 1.4fr 1fr 1fr, 32px gap → collapses to brand + 2-col on tablet,
 *    then single column on mobile
 *  - Social icons rendered ONLY when URL is a non-empty https:// value
 *  - "Get Involved" column is auth-aware (Dashboard when logged in)
 *  - Yellow accent: #FCD34D (matches hero and the rest of the codebase)
 */

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SOCIAL_LINKS, SITE } from "../config/site.js";

/* ── Helpers ─────────────────────────────────────────────────────────── */

/** Returns true only for non-empty, valid https:// URLs */
function isValidUrl(url) {
  if (!url || typeof url !== "string" || url.trim() === "") return false;
  try {
    const u = new URL(url.trim());
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

/* ── SVG icon set ─────────────────────────────────────────────────────
   Using optimised inline SVGs so there is no extra icon-library dependency.
   All paths are the official brand icons (viewBox 0 0 24 24).
────────────────────────────────────────────────────────────────────── */
function TikTokIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

/* Map platform key → { icon, label } */
const SOCIAL_META = {
  tiktok:   { Icon: TikTokIcon,  label: "NACOS KKU Vom on TikTok"   },
  x:        { Icon: XIcon,       label: "NACOS KKU Vom on X"         },
  linkedin: { Icon: LinkedInIcon, label: "NACOS KKU Vom on LinkedIn" },
  facebook: { Icon: FacebookIcon, label: "NACOS KKU Vom on Facebook" },
};

const SOCIAL_ORDER = ["tiktok", "x", "linkedin", "facebook"];

/* ── Nav link data ────────────────────────────────────────────────── */
const EXPLORE_LINKS = [
  { to: "/about",      label: "About"      },
  { to: "/history",    label: "History"    },
  { to: "/leadership", label: "Leadership" },
  { to: "/news",       label: "News"       },
  { to: "/events",     label: "Events"     },
  { to: "/gallery",    label: "Gallery"    },
  { to: "/contact",    label: "Contact"    },
];

/* ── Component ───────────────────────────────────────────────────── */
export default function Footer() {
  const { session } = useAuth();
  const loggedIn = !!session;

  /* Get Involved links — auth-aware */
  const getInvolvedLinks = loggedIn
    ? [
        { to: "/dashboard", label: "Dashboard"          },
        { to: "/verify",    label: "Verify Certificate" },
      ]
    : [
        { to: "/register", label: "Register"           },
        { to: "/login",    label: "Member Login"        },
        { to: "/verify",   label: "Verify Certificate" },
      ];

  /* Filtered social icons — only those with valid https URLs */
  const activeSocials = SOCIAL_ORDER.filter((key) => isValidUrl(SOCIAL_LINKS[key]));
  const hasSocials = activeSocials.length > 0;

  return (
    <footer className="site-footer" aria-label="Site footer">

      {/* ── Main grid ── */}
      <div className="ft-container ft-grid">

        {/* ── Brand block ── */}
        <div className="ft-brand">

          {/* Logo + wordmark */}
          <Link to="/" className="ft-logo" aria-label="NACOS KKU VOM — home">
            <div className="ft-logo__ring" aria-hidden="true">
              <img src="/logo.jpeg" alt="" className="ft-logo__img" />
            </div>
            <span className="ft-logo__text">
              NACOS <span className="ft-logo__accent">KKU VOM</span>
            </span>
          </Link>

          {/* Tagline */}
          <p className="ft-tagline">
            The Nigeria Association of Computing Students, Karl Kumm University,
            Vom Chapter. Building skills, community, and a legacy of excellence.
          </p>

          {/* Social icons — hidden when all URLs are empty */}
          {hasSocials && (
            <div className="ft-socials" role="list" aria-label="Social media links">
              {activeSocials.map((key) => {
                const { Icon, label } = SOCIAL_META[key];
                return (
                  <a
                    key={key}
                    href={SOCIAL_LINKS[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="ft-social-btn"
                    role="listitem"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Link columns ── */}
        <nav aria-label="Footer navigation">
          <p className="ft-col-heading" aria-hidden="false">Explore</p>
          <ul className="ft-link-list" role="list">
            {EXPLORE_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="ft-link">{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Get involved navigation">
          <p className="ft-col-heading">Get Involved</p>
          <ul className="ft-link-list" role="list">
            {getInvolvedLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="ft-link">{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

      </div>

      {/* ── Bottom bar ── */}
      <div className="ft-bar-wrap">
        <div className="ft-container ft-bar">
          <span>© {SITE.year} NACOS KKU Vom Chapter. All rights reserved.</span>
          <span className="ft-bar__right">
            Built with{" "}
            <svg
              width="12" height="12" viewBox="0 0 24 24"
              fill="#F87171" aria-hidden="true" focusable="false"
              style={{ display: "inline", verticalAlign: "-1px", margin: "0 2px" }}
            >
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            by the Pioneer Administration
          </span>
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        /* ═══════════════════════════════════════════════════
           FOOTER — base styles
           ═══════════════════════════════════════════════════ */
        .site-footer {
          background: #12245F;
          margin-top: auto;
        }

        /* Container — matches navbar max-width / padding */
        .ft-container {
          width: 100%;
          max-width: 1120px;
          margin-inline: auto;
          padding-inline: 24px;
          box-sizing: border-box;
        }

        /* 3-column grid */
        .ft-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 32px;
          padding-top: 48px;
          padding-bottom: 32px;
          align-items: start;
        }

        /* ── Brand block ── */
        .ft-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Logo link */
        .ft-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .ft-logo:focus-visible {
          outline: 2px solid #FCD34D;
          outline-offset: 3px;
          border-radius: 4px;
        }

        /* Circular seal */
        .ft-logo__ring {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.80);
          overflow: hidden;
          flex-shrink: 0;
        }
        .ft-logo__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Wordmark */
        .ft-logo__text {
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .ft-logo__accent {
          color: #FCD34D;
        }

        /* Tagline */
        .ft-tagline {
          font-size: 13px;
          color: #AEBBE0;
          line-height: 1.65;
          max-width: 300px;
          margin: 0;
        }

        /* ── Social icons ── */
        .ft-socials {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 4px;
        }

        .ft-social-btn {
          /* Visible circle */
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.25);
          color: #ffffff;
          text-decoration: none;
          transition: background 150ms ease-out, border-color 150ms ease-out;
          /* 44px tap area on mobile via padding trick */
          position: relative;
        }
        .ft-social-btn::before {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 50%;
        }
        .ft-social-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.50);
        }
        .ft-social-btn:focus-visible {
          outline: 2px solid #FCD34D;
          outline-offset: 2px;
        }

        /* ── Column headings ── */
        .ft-col-heading {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #FCD34D;
          margin: 0 0 14px;
        }

        /* ── Nav link lists ── */
        .ft-link-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .ft-link {
          font-size: 13px;
          color: #C4D0EF;
          text-decoration: none;
          transition: color 150ms ease-out;
          display: inline-block;
          /* ensure 44px touch zone on mobile */
          padding-block: 2px;
        }
        .ft-link:hover {
          color: #ffffff;
        }
        .ft-link:focus-visible {
          outline: 2px solid #FCD34D;
          outline-offset: 2px;
          border-radius: 2px;
        }

        /* ── Bottom bar ── */
        .ft-bar-wrap {
          border-top: 1px solid rgba(255,255,255,0.14);
        }
        .ft-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 6px;
          padding-block: 18px;
          font-size: 12px;
          color: #8C9CC9;
        }
        .ft-bar__right {
          display: flex;
          align-items: center;
          gap: 0;
        }

        /* ═══════════════════════════════════════════════════
           TABLET  768–1023px
           — brand full-width on top, two link cols below
           ═══════════════════════════════════════════════════ */
        @media (max-width: 1023px) {
          .ft-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto;
          }
          .ft-brand {
            grid-column: 1 / -1;
          }
          .ft-tagline {
            max-width: 480px;
          }
        }

        /* ═══════════════════════════════════════════════════
           MOBILE  <640px
           — single column, 32px gaps
           ═══════════════════════════════════════════════════ */
        @media (max-width: 639px) {
          .ft-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            padding-top: 40px;
            padding-bottom: 28px;
          }
          .ft-container {
            padding-inline: 16px;
          }
          .ft-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .ft-tagline {
            max-width: 100%;
          }
        }

        /* ═══════════════════════════════════════════════════
           REDUCED MOTION
           ═══════════════════════════════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          .ft-social-btn,
          .ft-link {
            transition: none;
          }
        }
      `}</style>
    </footer>
  );
}
