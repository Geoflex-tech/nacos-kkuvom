/**
 * BioDialog — accessible modal / bottom-sheet for a leader's bio.
 *
 * Features:
 *  - aria-modal, aria-labelledby, role="dialog"
 *  - focus trap (Tab / Shift+Tab cycle within dialog)
 *  - Escape key closes
 *  - Outside-click closes
 *  - Body scroll locked while open
 *  - Focus returns to the trigger element on close
 *  - 150ms fade + 8px translate animation (respects prefers-reduced-motion)
 *  - Bottom sheet on mobile (≤ 640px), centred modal on desktop
 *
 * Props:
 *   leader      — object | null  (null = closed)
 *   triggerRef  — React ref to the element that opened the dialog
 *   onClose     — () => void
 */
import { useEffect, useRef, useCallback } from "react";
import { X, Globe, Link, ExternalLink } from "lucide-react";

// ── social-link icon map (only icons available in this lucide-react version) ──
const SOCIAL_ICONS = {
  github:    ExternalLink,
  twitter:   ExternalLink,
  linkedin:  ExternalLink,
  portfolio: Globe,
  website:   Globe,
  link:      Link,
  default:   ExternalLink,
};

const SOCIAL_LABELS = {
  github:    "GitHub",
  twitter:   "Twitter / X",
  linkedin:  "LinkedIn",
  portfolio: "Portfolio",
  website:   "Website",
  default:   "Link",
};

function SocialLinks({ links }) {
  if (!links || Object.keys(links).length === 0) return null;
  return (
    <div className="bd-socials" aria-label="Social links">
      {Object.entries(links).map(([key, url]) => {
        const Icon  = SOCIAL_ICONS[key.toLowerCase()]  || SOCIAL_ICONS.default;
        const label = SOCIAL_LABELS[key.toLowerCase()] || key;
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bd-social-link"
            aria-label={`${label} profile`}
            title={label}
          >
            <Icon size={16} aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}

// ── focus-trap helpers ──────────────────────────────────────────
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export default function BioDialog({ leader, triggerRef, onClose }) {
  const overlayRef  = useRef(null);
  const dialogRef   = useRef(null);
  const closeBtnRef = useRef(null);

  /* ── lock body scroll ── */
  useEffect(() => {
    if (!leader) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [leader]);

  /* ── focus first element when opened ── */
  useEffect(() => {
    if (!leader) return;
    // small timeout so animation has started
    const id = setTimeout(() => closeBtnRef.current?.focus(), 60);
    return () => clearTimeout(id);
  }, [leader]);

  /* ── return focus on close ── */
  const handleClose = useCallback(() => {
    onClose();
    // return focus after the dialog unmounts
    requestAnimationFrame(() => {
      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
    });
  }, [onClose, triggerRef]);

  /* ── keyboard: Escape + Tab trap ── */
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
      return;
    }
    if (e.key !== "Tab") return;

    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll(FOCUSABLE));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [handleClose]);

  /* ── outside click ── */
  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) handleClose();
  }, [handleClose]);

  if (!leader) return null;

  const socials = leader.social_links || {};

  return (
    <>
      {/* backdrop */}
      <div
        ref={overlayRef}
        className="bd-overlay"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bd-title"
        onKeyDown={handleKeyDown}
        className="bd-dialog"
      >
        {/* close button */}
        <button
          ref={closeBtnRef}
          type="button"
          className="bd-close"
          onClick={handleClose}
          aria-label="Close dialog"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {/* photo + name + position */}
        <div className="bd-header">
          {leader.image_url ? (
            <img
              src={leader.image_url}
              alt={`Photo of ${leader.name}`}
              className="bd-photo"
              width="96"
              height="96"
            />
          ) : (
            <div className="bd-photo bd-photo--fallback" aria-hidden="true">
              {leader.name?.[0]?.toUpperCase() || "?"}
            </div>
          )}

          <h2 id="bd-title" className="bd-name">{leader.name}</h2>
          <p className="bd-position">{leader.position}</p>

          {(leader.level || leader.department) && (
            <p className="bd-meta">
              {[leader.level, leader.department].filter(Boolean).join(" · ")}
            </p>
          )}

          <SocialLinks links={socials} />
        </div>

        {/* bio text */}
        <div className="bd-bio-wrap">
          {leader.bio ? (
            <p className="bd-bio">{leader.bio}</p>
          ) : (
            <p className="bd-bio bd-bio--empty">Bio coming soon.</p>
          )}
        </div>
      </div>

      <style>{`
        /* ── Overlay ─────────────────────────────────── */
        .bd-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 20, 55, 0.55);
          z-index: 9990;
          animation: bd-fade-in 150ms ease-out forwards;
        }

        /* ── Dialog (desktop: centred modal) ─────────── */
        .bd-dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, calc(-50% + 8px));
          width: min(520px, calc(100vw - 32px));
          max-height: 90vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 16px;
          padding: 32px 28px 28px;
          z-index: 9991;
          outline: none;
          box-shadow: 0 20px 60px rgba(10,20,55,0.25);
          animation: bd-slide-in 150ms ease-out forwards;
        }

        /* ── Close button ────────────────────────────── */
        .bd-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: #F1F5F9;
          border-radius: 50%;
          cursor: pointer;
          color: #475569;
          transition: background 150ms ease-out, color 150ms ease-out;
        }
        .bd-close:hover { background: #E2E8F0; color: #0F172A; }
        .bd-close:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1E40AF;
          border-radius: 50%;
        }

        /* ── Header ──────────────────────────────────── */
        .bd-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          margin-bottom: 20px;
        }

        /* photo */
        .bd-photo {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 0 0 3px #D97706;
          margin-bottom: 10px;
        }
        .bd-photo--fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1E40AF, #059669);
          color: #ffffff;
          font-size: 2rem;
          font-weight: 700;
        }

        .bd-name {
          font-size: 18px;
          font-weight: 700;
          color: #1E3A8A;
          margin: 0;
          line-height: 1.2;
        }
        .bd-position {
          font-size: 13px;
          font-weight: 500;
          color: #059669;
          margin: 0;
        }
        .bd-meta {
          font-size: 12px;
          color: #64748B;
          margin: 0;
        }

        /* ── Social links ────────────────────────────── */
        .bd-socials {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 4px;
        }
        .bd-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #EEF3FB;
          color: #1E40AF;
          text-decoration: none;
          transition: background 150ms ease-out, color 150ms ease-out;
        }
        .bd-social-link:hover { background: #DBEAFE; color: #1E3A8A; }
        .bd-social-link:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1E40AF;
        }

        /* ── Bio text ────────────────────────────────── */
        .bd-bio-wrap {
          border-top: 1px solid #E2E8F0;
          padding-top: 18px;
        }
        .bd-bio {
          font-size: 14px;
          line-height: 1.7;
          color: #334155;
          margin: 0;
          white-space: pre-wrap;
        }
        .bd-bio--empty {
          color: #94A3B8;
          font-style: italic;
        }

        /* ── Animations ──────────────────────────────── */
        @keyframes bd-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bd-slide-in {
          from {
            opacity: 0;
            transform: translate(-50%, calc(-50% + 8px));
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        /* ── Mobile: bottom sheet (≤ 640px) ──────────── */
        @media (max-width: 640px) {
          .bd-dialog {
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            max-height: 85vh;
            border-radius: 20px 20px 0 0;
            transform: none;
            animation: bd-slide-up 150ms ease-out forwards;
          }
        }
        @keyframes bd-slide-up {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Reduced motion ──────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .bd-overlay,
          .bd-dialog { animation: none; }
        }
      `}</style>
    </>
  );
}
