/**
 * LeadershipCard — renders one leadership position as either:
 *   status="filled"  → white card, photo, name, position, "Read bio" button
 *   status="vacant"  → transparent dashed card, icon placeholder, "Coming soon" pill
 *
 * Props:
 *   leader        — object from useLeadership()
 *   onReadBio     — callback(leader) — opens bio dialog (filled only)
 *   triggerRef    — optional ref to attach to the "Read bio" button (for focus return)
 */
import { useRef } from "react";
import { User, ArrowRight } from "lucide-react";

export default function LeadershipCard({ leader, onReadBio, triggerRef }) {
  const btnRef = useRef(null);

  // expose button ref upward if requested
  if (triggerRef) triggerRef.current = btnRef.current;

  if (leader.status === "vacant") {
    return (
      <article
        className="lc-vacant"
        aria-label={`${leader.position}, coming soon`}
      >
        {/* placeholder icon */}
        <div className="lc-vacant__icon" aria-hidden="true">
          <User size={22} strokeWidth={1.5} />
        </div>

        {/* position title */}
        <p className="lc-vacant__title">{leader.position}</p>

        {/* "Coming soon" pill */}
        <span className="lc-coming-soon" aria-hidden="true">
          Coming soon
        </span>
      </article>
    );
  }

  /* ── filled card ── */
  const handleClick = () => onReadBio && onReadBio(leader, btnRef);

  return (
    <article
      className="lc-filled"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${leader.name}, ${leader.position} — read bio`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* photo */}
      <div className="lc-photo-wrap" aria-hidden="true">
        {leader.image_url ? (
          <img
            src={leader.image_url}
            alt={`Photo of ${leader.name}`}
            className="lc-photo"
            loading="lazy"
            width="72"
            height="72"
          />
        ) : (
          <div className="lc-photo lc-photo--fallback" aria-hidden="true">
            {leader.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      {/* name + position + level */}
      <div className="lc-meta">
        <p className="lc-name">{leader.name}</p>
        <p className="lc-position">{leader.position}</p>
        {leader.level && <p className="lc-level">{leader.level}</p>}
      </div>

      {/* read bio button */}
      <button
        ref={btnRef}
        type="button"
        className="lc-bio-btn"
        onClick={(e) => {
          e.stopPropagation(); // avoid double-firing from article click
          onReadBio && onReadBio(leader, btnRef);
        }}
        tabIndex={-1} /* article is already focusable */
        aria-hidden="true"
      >
        Read bio <ArrowRight size={12} aria-hidden="true" />
      </button>

      <style>{`
        /* ── Shared grid row alignment ──────────────────────── */
        .lc-filled,
        .lc-vacant {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border-radius: 12px;
          padding: 20px 14px;
          /* equal height inside each row */
          height: 100%;
          box-sizing: border-box;
        }

        /* ── Filled card ─────────────────────────────────────── */
        .lc-filled {
          background: #ffffff;
          border: 1px solid #D9DEE8;
          cursor: pointer;
          transition: transform 150ms ease-out, border-color 150ms ease-out,
                      box-shadow 150ms ease-out;
          outline: none;
        }
        @media (hover: hover) {
          .lc-filled:hover {
            transform: translateY(-2px);
            border-color: #B0BCDB;
            box-shadow: 0 6px 18px rgba(30,64,175,0.10);
          }
        }
        .lc-filled:focus-visible {
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1E40AF;
        }

        /* ── Photo ───────────────────────────────────────────── */
        .lc-photo-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          /* 3px amber ring */
          box-shadow: 0 0 0 3px #D97706;
          overflow: hidden;
          flex-shrink: 0;
          margin-bottom: 12px;
        }
        .lc-photo {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }
        .lc-photo--fallback {
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1E40AF, #059669);
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 700;
          border-radius: 50%;
        }

        /* ── Text ────────────────────────────────────────────── */
        .lc-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .lc-name {
          font-size: 14px;
          font-weight: 500;
          color: #1E3A8A;
          line-height: 1.3;
          margin: 0;
          word-break: break-word;
        }
        .lc-position {
          font-size: 12px;
          font-weight: 500;
          color: #059669;
          line-height: 1.3;
          margin: 0;
          word-break: break-word;
        }
        .lc-level {
          font-size: 12px;
          color: #64748B;
          margin: 0;
        }

        /* ── Read bio button ─────────────────────────────────── */
        .lc-bio-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 10px;
          font-size: 12px;
          font-weight: 500;
          color: #1E40AF;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
          transition: color 150ms ease-out;
          white-space: nowrap;
        }
        .lc-bio-btn:hover { color: #1D4ED8; }

        /* ── Vacant card ─────────────────────────────────────── */
        .lc-vacant {
          background: transparent;
          border: 1px dashed #C3CCE0;
          /* NOT clickable */
          pointer-events: none;
          user-select: none;
        }

        .lc-vacant__icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #EEF3FB;
          color: #94A3B8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 12px;
        }
        .lc-vacant__title {
          font-size: 12px;
          font-weight: 500;
          color: #94A3B8;
          line-height: 1.4;
          margin: 0 0 10px 0;
          word-break: break-word;
          flex: 1;
        }

        /* ── "Coming soon" pill ──────────────────────────────── */
        .lc-coming-soon {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 999px;
          background: #FEF3C7;
          color: #B45309;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
          white-space: nowrap;
          margin-top: auto;
        }

        /* ── Reduced motion ──────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .lc-filled { transition: none; }
        }
      `}</style>
    </article>
  );
}
