/**
 * MemberGate — wraps member-only pages.
 * Logged-in users see the page normally.
 * Guests see a branded "members only" prompt with login/register buttons
 * instead of a hard redirect, so they understand WHY they're blocked.
 *
 * Props:
 *   children  — the protected page content
 *   icon      — lucide icon component (optional)
 *   title     — feature name, e.g. "Tech Hub"
 *   description — one-liner about what's inside
 */
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock } from "lucide-react";

export default function MemberGate({ children, icon: Icon, title = "This page", description }) {
  const { isMember, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "5rem 1rem", textAlign: "center", color: "#64748B" }}>
        Loading…
      </div>
    );
  }

  if (isMember) return children;

  /* ── Guest prompt ── */
  return (
    <div className="mg-wrap">
      <div className="mg-card">
        {/* lock icon */}
        <div className="mg-icon-wrap" aria-hidden="true">
          {Icon ? <Icon size={28} strokeWidth={1.5} /> : <Lock size={28} strokeWidth={1.5} />}
        </div>

        <h1 className="mg-title">{title}</h1>
        <p className="mg-desc">
          {description ||
            `${title} is available to NACOS KKU VOM Chapter members. Create a free account or log in to get access.`}
        </p>

        <div className="mg-actions">
          <Link to="/register" className="mg-btn mg-btn--primary">
            Create free account
          </Link>
          <Link to="/login" className="mg-btn mg-btn--secondary">
            Log in
          </Link>
        </div>

        <p className="mg-note">
          Already a student at KKU VOM?{" "}
          <Link to="/register" className="mg-note-link">
            Registration takes 1 minute.
          </Link>
        </p>
      </div>

      <style>{`
        .mg-wrap {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 16px;
          background: var(--color-bg-alt, #F4F7FB);
        }
        .mg-card {
          background: #ffffff;
          border: 1px solid #D9DEE8;
          border-radius: 20px;
          padding: 40px 32px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 4px 24px rgba(30,64,175,0.08);
        }
        .mg-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #EEF3FB;
          color: #1E40AF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .mg-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1E3A8A;
          margin: 0 0 10px;
        }
        .mg-desc {
          font-size: 0.9375rem;
          color: #64748B;
          line-height: 1.6;
          margin: 0 0 28px;
        }
        .mg-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .mg-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          border-radius: 999px;
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 150ms ease-out, transform 150ms ease-out;
        }
        .mg-btn--primary {
          background: #1E40AF;
          color: #ffffff;
        }
        .mg-btn--primary:hover { background: #1D4ED8; transform: translateY(-1px); }
        .mg-btn--secondary {
          background: transparent;
          color: #1E40AF;
          border: 1.5px solid #1E40AF;
        }
        .mg-btn--secondary:hover { background: #EFF4FF; }
        .mg-note {
          font-size: 0.8125rem;
          color: #94A3B8;
          margin: 0;
        }
        .mg-note-link {
          color: #059669;
          font-weight: 500;
          text-decoration: underline;
        }
        .mg-note-link:hover { color: #047857; }
        @media (prefers-reduced-motion: reduce) {
          .mg-btn { transition: none; }
        }
      `}</style>
    </div>
  );
}
