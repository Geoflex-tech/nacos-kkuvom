/**
 * Dashboard (Overview) — /dashboard
 *
 * Welcome card: flat navy #12245F, two soft glows, white text.
 * Three stat cards: Matric No., Level, Membership status.
 *   - Empty matric/level → "Add …" link to profile.
 *   - Status pill: green/amber/red tint from real DB value.
 * Quick actions grid (3 col desktop, 2 tablet, 1 mobile).
 *   - Resources + Tech Hub show "Pending approval" note if not approved.
 * Conditional panels: Latest announcements + Upcoming events
 *   only rendered when real data exists.
 * Skeletons during load; honest empty states.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User, BookOpen, Megaphone, Wallet, Award,
  Calendar, Cpu, ArrowRight, Lock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

/* ── helpers ─────────────────────────────────────────────── */
function initials(profile) {
  return (profile?.full_name || profile?.email || "M")
    .split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const STATUS_PILL = {
  approved: { bg: "#D1FAE5", color: "#065F46", label: "Approved" },
  pending:  { bg: "#FEF3C7", color: "#92400E", label: "Pending"  },
  rejected: { bg: "#FEE2E2", color: "#991B1B", label: "Rejected" },
};

/* ── skeleton shapes ─────────────────────────────────────── */
function Skel({ w = "100%", h = 14, r = 6, mb = 0 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: w, height: h, borderRadius: r, marginBottom: mb,
        background: "linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%)",
        backgroundSize: "200% 100%",
        animation: "ov-shimmer 1.4s infinite",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { profile, session } = useAuth();
  const [events, setEvents]   = useState([]);
  const [anns, setAnns]       = useState([]);
  const [loading, setLoading] = useState(true);

  const isApproved = profile?.status === "approved";
  const ini        = initials(profile);

  useEffect(() => {
    (async () => {
      const [evRes, anRes] = await Promise.all([
        supabase
          .from("events")
          .select("id,title,event_date,location")
          .gte("event_date", new Date().toISOString())
          .order("event_date", { ascending: true })
          .limit(3),
        supabase
          .from("announcements")
          .select("id,title,body,created_at")
          .order("created_at", { ascending: false })
          .limit(3),
      ]);
      setEvents(evRes.data || []);
      setAnns(anRes.data || []);
      setLoading(false);
    })();
  }, [session]);

  /* ── Quick actions ─────────────────────────────────────── */
  const actions = [
    {
      to: "/profile", label: "Edit Profile",
      desc: "Update your info", Icon: User,
      bg: "#EFF6FF", color: "#1E40AF",
    },
    {
      to: isApproved ? "/dashboard/resources" : null,
      label: "Resources",
      desc: isApproved ? "Past questions & materials" : "Pending approval",
      Icon: BookOpen,
      bg: "#F0FDF4", color: "#065F46",
      locked: !isApproved,
    },
    {
      to: isApproved ? "/dashboard/tech-hub" : null,
      label: "Tech Hub",
      desc: isApproved ? "Free courses, books & tools" : "Pending approval",
      Icon: Cpu,
      bg: "#ECFDF5", color: "#047857",
      locked: !isApproved,
    },
    {
      to: "/announcements", label: "Announcements",
      desc: "Chapter news & updates", Icon: Megaphone,
      bg: "#FFFBEB", color: "#B45309",
    },
    {
      to: "/certificates", label: "My Certificates",
      desc: "View & print your certificates", Icon: Award,
      bg: "#F5F3FF", color: "#6D28D9",
    },
    {
      to: "/dues", label: "Pay Dues",
      desc: profile?.dues_paid ? "Paid for this session" : "Click to pay",
      Icon: Wallet,
      bg: "#FFF7ED", color: "#C2410C",
    },
  ];

  const pill = STATUS_PILL[profile?.status] || STATUS_PILL.pending;

  return (
    <div className="ov-root">
      {/* ── Welcome card ──────────────────────────────── */}
      <div className="ov-welcome">
        <div className="ov-welcome-glow ov-welcome-glow--blue"  aria-hidden="true" />
        <div className="ov-welcome-glow ov-welcome-glow--green" aria-hidden="true" />

        <div className="ov-welcome-inner">
          {/* Avatar */}
          <div className="ov-avatar">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || "Profile"}
                className="ov-avatar-img"
              />
            ) : (
              <span className="ov-avatar-initials" aria-label={`Initials: ${ini}`}>
                {ini}
              </span>
            )}
          </div>

          {/* Text */}
          <div className="ov-welcome-copy">
            <p className="ov-welcome-sub">Welcome back,</p>
            <h1 className="ov-welcome-name">
              {profile?.full_name || "Member"}
            </h1>
            <p className="ov-welcome-chapter">
              NACOS KKU Vom Chapter · Member Portal
            </p>
          </div>
        </div>
      </div>

      {/* ── Stat cards ────────────────────────────────── */}
      <div className="ov-stats">
        {/* Matric No. */}
        <div className="ov-stat-card">
          <p className="ov-stat-label">Matric No.</p>
          {profile?.matric_no ? (
            <p className="ov-stat-value">{profile.matric_no}</p>
          ) : (
            <Link to="/profile" className="ov-stat-add">
              Add matric number →
            </Link>
          )}
        </div>

        {/* Level */}
        <div className="ov-stat-card">
          <p className="ov-stat-label">Level</p>
          {profile?.level ? (
            <p className="ov-stat-value">{profile.level}</p>
          ) : (
            <Link to="/profile" className="ov-stat-add">
              Add level →
            </Link>
          )}
        </div>

        {/* Membership status */}
        <div className="ov-stat-card">
          <p className="ov-stat-label">Membership</p>
          <span
            className="ov-status-pill"
            style={{ background: pill.bg, color: pill.color }}
          >
            {pill.label}
          </span>
        </div>
      </div>

      {/* ── Quick actions ──────────────────────────────── */}
      <div className="ov-section">
        <h2 className="ov-section-title">Quick Actions</h2>
        <div className="ov-actions-grid">
          {actions.map(({ to, label, desc, Icon, bg, color, locked }) => {
            const content = (
              <>
                <span
                  className="ov-action-icon"
                  style={{ background: bg, color }}
                  aria-hidden="true"
                >
                  {locked
                    ? <Lock size={18} aria-hidden="true" />
                    : <Icon size={18} aria-hidden="true" />}
                </span>
                <span className="ov-action-text">
                  <span className="ov-action-label">{label}</span>
                  <span className="ov-action-desc">{desc}</span>
                </span>
                {!locked && (
                  <ArrowRight
                    size={15}
                    className="ov-action-arrow"
                    aria-hidden="true"
                  />
                )}
              </>
            );

            return locked ? (
              <div key={label} className="ov-action-card ov-action-card--locked" aria-label={`${label} — ${desc}`}>
                {content}
              </div>
            ) : (
              <Link key={to} to={to} className="ov-action-card">
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Bottom panels (only if data exists) ──────── */}
      {(loading || anns.length > 0 || events.length > 0) && (
        <div className="ov-panels">

          {/* Announcements */}
          {(loading || anns.length > 0) && (
            <div className="ov-panel">
              <div className="ov-panel-head">
                <h2 className="ov-section-title" style={{ margin: 0 }}>
                  Latest Announcements
                </h2>
                <Link to="/announcements" className="ov-panel-more">
                  View all
                </Link>
              </div>
              {loading ? (
                <div className="ov-panel-list">
                  {[1,2].map((i) => (
                    <div key={i} className="ov-panel-item">
                      <Skel w="60%" h={14} r={6} mb={6} />
                      <Skel w="35%" h={11} r={6} mb={6} />
                      <Skel w="90%" h={11} r={6} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ov-panel-list">
                  {anns.map((a) => (
                    <div key={a.id} className="ov-panel-item">
                      <p className="ov-panel-item-title">{a.title}</p>
                      <p className="ov-panel-item-date">
                        {new Date(a.created_at).toDateString()}
                      </p>
                      {a.body && (
                        <p className="ov-panel-item-body">{a.body}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming events */}
          {(loading || events.length > 0) && (
            <div className="ov-panel">
              <div className="ov-panel-head">
                <h2 className="ov-section-title" style={{ margin: 0 }}>
                  Upcoming Events
                </h2>
                <Link to="/events" className="ov-panel-more">
                  View all
                </Link>
              </div>
              {loading ? (
                <div className="ov-panel-list">
                  {[1,2].map((i) => (
                    <div key={i} className="ov-panel-item ov-panel-item--event">
                      <Skel w={40} h={40} r={8} />
                      <div style={{ flex:1 }}>
                        <Skel w="60%" h={14} r={6} mb={6} />
                        <Skel w="40%" h={11} r={6} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ov-panel-list">
                  {events.map((e) => {
                    const d = new Date(e.event_date);
                    return (
                      <div key={e.id} className="ov-panel-item ov-panel-item--event">
                        <div className="ov-event-date-badge" aria-hidden="true">
                          <span className="ov-event-month">
                            {d.toLocaleString("default", { month: "short" })}
                          </span>
                          <span className="ov-event-day">{d.getDate()}</span>
                        </div>
                        <div className="ov-event-info">
                          <p className="ov-panel-item-title">{e.title}</p>
                          {e.location && (
                            <p className="ov-panel-item-date">{e.location}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Styles ────────────────────────────────────── */}
      <style>{`
        @keyframes ov-shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        .ov-root { display: flex; flex-direction: column; gap: 20px; }

        /* ── Welcome card ────────────────────────────── */
        .ov-welcome {
          position: relative;
          background: #12245F;
          border-radius: 12px;
          overflow: hidden;
          padding: 28px;
        }
        .ov-welcome-glow {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .ov-welcome-glow--blue {
          width: 360px; height: 360px; top: -140px; right: -80px;
          background: radial-gradient(circle, rgba(30,64,175,0.55) 0%, transparent 65%);
          z-index: 0;
        }
        .ov-welcome-glow--green {
          width: 300px; height: 300px; bottom: -120px; left: -60px;
          background: radial-gradient(circle, rgba(5,150,105,0.22) 0%, transparent 65%);
          z-index: 0;
        }
        .ov-welcome-inner {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 20px;
        }

        /* Avatar */
        .ov-avatar {
          width: 64px; height: 64px; border-radius: 50%; flex-shrink: 0;
          border: 3px solid #F59E0B;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.12);
        }
        .ov-avatar-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .ov-avatar-initials {
          font-size: 1.25rem; font-weight: 700; color: #fff;
        }

        /* Copy */
        .ov-welcome-copy { min-width: 0; }
        .ov-welcome-sub {
          font-size: 0.8125rem; color: #9FB3E6; margin: 0 0 2px;
        }
        .ov-welcome-name {
          font-size: clamp(1.125rem, 2vw, 1.375rem);
          font-weight: 500; color: #fff; margin: 0 0 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ov-welcome-chapter {
          font-size: 0.8125rem; color: #C9D6F5; margin: 0;
        }

        /* ── Stat cards ──────────────────────────────── */
        .ov-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .ov-stat-card {
          background: #fff;
          border: 1px solid #E2E6EF;
          border-radius: 12px;
          padding: 16px 18px;
        }
        .ov-stat-label {
          font-size: 0.6875rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: #6B7280; margin: 0 0 6px;
        }
        .ov-stat-value {
          font-size: 1rem; font-weight: 600;
          color: #1E3A8A; margin: 0;
        }
        .ov-stat-add {
          font-size: 0.8125rem; font-weight: 500;
          color: #1E40AF; text-decoration: none;
          transition: color 150ms ease-out;
        }
        .ov-stat-add:hover { color: #1D4ED8; text-decoration: underline; }
        .ov-stat-add:focus-visible { outline: 2px solid #1E40AF; outline-offset: 2px; border-radius: 4px; }

        .ov-status-pill {
          display: inline-block;
          font-size: 0.75rem; font-weight: 600;
          padding: 3px 10px; border-radius: 999px;
        }

        /* ── Section header ──────────────────────────── */
        .ov-section {}
        .ov-section-title {
          font-size: 0.9375rem; font-weight: 600;
          color: #0F172A; margin: 0 0 12px;
        }

        /* ── Actions grid ────────────────────────────── */
        .ov-actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .ov-action-card {
          display: flex; align-items: center; gap: 12px;
          padding: 14px;
          background: #fff;
          border: 1px solid #E2E6EF;
          border-radius: 10px;
          text-decoration: none;
          transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
        }
        .ov-action-card:hover {
          border-color: #BFDBFE;
          box-shadow: 0 2px 8px rgba(30,64,175,0.08);
        }
        .ov-action-card:focus-visible {
          outline: 2px solid #1E40AF; outline-offset: 2px;
        }
        .ov-action-card--locked {
          opacity: 0.6; cursor: default;
        }
        .ov-action-card--locked:hover { border-color: #E2E6EF; box-shadow: none; }

        .ov-action-icon {
          width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .ov-action-text {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column; gap: 1px;
        }
        .ov-action-label {
          font-size: 0.8125rem; font-weight: 500;
          color: #0F172A; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .ov-action-desc {
          font-size: 0.75rem; color: #6B7280;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ov-action-arrow {
          color: #D1D5DB; flex-shrink: 0;
          transition: color 150ms ease-out;
        }
        .ov-action-card:hover .ov-action-arrow { color: #1E40AF; }

        /* ── Bottom panels ───────────────────────────── */
        .ov-panels {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .ov-panel {
          background: #fff;
          border: 1px solid #E2E6EF;
          border-radius: 12px;
          padding: 18px;
        }
        .ov-panel-head {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .ov-panel-more {
          font-size: 0.75rem; font-weight: 500;
          color: #059669; text-decoration: none;
          transition: color 150ms ease-out;
        }
        .ov-panel-more:hover { color: #047857; text-decoration: underline; }

        .ov-panel-list { display: flex; flex-direction: column; gap: 12px; }

        .ov-panel-item {
          padding-bottom: 12px;
          border-bottom: 1px solid #F1F4FA;
        }
        .ov-panel-item:last-child { padding-bottom: 0; border-bottom: none; }

        .ov-panel-item--event {
          display: flex; align-items: flex-start; gap: 12px;
        }

        .ov-panel-item-title {
          font-size: 0.875rem; font-weight: 500;
          color: #0F172A; margin: 0 0 3px;
        }
        .ov-panel-item-date {
          font-size: 0.75rem; color: #6B7280; margin: 0;
        }
        .ov-panel-item-body {
          font-size: 0.8125rem; color: #4B5563;
          margin: 4px 0 0; line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Event date badge */
        .ov-event-date-badge {
          width: 40px; min-width: 40px;
          background: #1E3A8A; border-radius: 8px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 4px 0;
        }
        .ov-event-month {
          font-size: 9px; font-weight: 700;
          text-transform: uppercase; color: rgba(255,255,255,0.7);
          letter-spacing: 0.5px;
        }
        .ov-event-day {
          font-size: 1.125rem; font-weight: 700; color: #fff; line-height: 1.1;
        }
        .ov-event-info { flex: 1; min-width: 0; }

        /* ── Responsive ──────────────────────────────── */
        @media (max-width: 767px) {
          .ov-stats         { grid-template-columns: 1fr 1fr; }
          .ov-actions-grid  { grid-template-columns: 1fr 1fr; }
          .ov-panels        { grid-template-columns: 1fr; }
        }
        @media (max-width: 479px) {
          .ov-stats         { grid-template-columns: 1fr; }
          .ov-actions-grid  { grid-template-columns: 1fr; }
          .ov-welcome       { padding: 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ov-action-card, .ov-action-arrow,
          .ov-stat-add, .ov-panel-more { transition: none; }
          @keyframes ov-shimmer { from,to { background-position: 0 0; } }
        }
      `}</style>
    </div>
  );
}
