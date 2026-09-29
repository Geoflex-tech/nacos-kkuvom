import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Announcements() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dp-wrap">
      {/* Page header */}
      <div className="dp-page-head">
        <div className="dp-page-icon" aria-hidden="true">
          <Megaphone size={20} />
        </div>
        <div>
          <h1 className="dp-page-title">Announcements</h1>
          <p className="dp-page-sub">Latest updates from the chapter executives</p>
        </div>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="dp-list" aria-busy="true" aria-label="Loading announcements">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dp-card dp-card--skel" aria-hidden="true">
              <div className="dp-skel dp-skel--title" />
              <div className="dp-skel dp-skel--meta"  />
              <div className="dp-skel dp-skel--body"  />
              <div className="dp-skel dp-skel--body dp-skel--short" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div className="dp-empty">
          <Megaphone size={36} aria-hidden="true" style={{ color: "#D1D5DB", marginBottom: 12 }} />
          <p className="dp-empty-text">No announcements yet.</p>
          <p className="dp-empty-sub">Check back here for chapter updates and notices.</p>
        </div>
      )}

      {/* List */}
      {!loading && items.length > 0 && (
        <div className="dp-list" aria-label="Announcements list">
          {items.map((a) => (
            <article key={a.id} className="dp-card">
              <h2 className="dp-ann-title">{a.title}</h2>
              <p className="dp-ann-date">
                {new Date(a.created_at).toLocaleString("en-NG", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <p className="dp-ann-body">{a.body}</p>
            </article>
          ))}
        </div>
      )}

      <DashPageStyles />
    </div>
  );
}

/* Shared dashboard-page styles — same class prefix "dp-" used across
   Announcements, MyCertificates, and Dues so they all look consistent. */
export function DashPageStyles() {
  return (
    <style>{`
      .dp-wrap { display: flex; flex-direction: column; gap: 20px; }

      /* Page header row */
      .dp-page-head {
        display: flex; align-items: center; gap: 14px; margin-bottom: 4px;
      }
      .dp-page-icon {
        width: 44px; height: 44px; border-radius: 10px;
        background: #EFF6FF; color: #1E40AF;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .dp-page-title {
        font-size: 1.25rem; font-weight: 600;
        color: #0F172A; margin: 0 0 2px;
      }
      .dp-page-sub {
        font-size: 0.8125rem; color: #6B7280; margin: 0;
      }

      /* Card */
      .dp-card {
        background: #fff;
        border: 1px solid #E2E6EF;
        border-radius: 12px;
        padding: 18px 20px;
      }

      /* List */
      .dp-list { display: flex; flex-direction: column; gap: 10px; }

      /* Empty state */
      .dp-empty {
        text-align: center; padding: 56px 16px;
        display: flex; flex-direction: column; align-items: center;
      }
      .dp-empty-text {
        font-size: 0.9375rem; font-weight: 500; color: #374151; margin: 0 0 4px;
      }
      .dp-empty-sub {
        font-size: 0.8125rem; color: #9CA3AF; margin: 0;
      }

      /* Skeleton shimmer */
      .dp-card--skel { pointer-events: none; }
      .dp-skel {
        border-radius: 6px; margin-bottom: 8px;
        background: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%);
        background-size: 200% 100%;
        animation: dp-shimmer 1.4s infinite;
      }
      .dp-skel--title  { height: 16px; width: 55%; }
      .dp-skel--meta   { height: 11px; width: 28%; }
      .dp-skel--body   { height: 12px; width: 100%; }
      .dp-skel--short  { width: 70%; }
      @keyframes dp-shimmer {
        from { background-position: 200% 0; }
        to   { background-position: -200% 0; }
      }

      /* ── Announcements ─────────────────────────────── */
      .dp-ann-title {
        font-size: 0.9375rem; font-weight: 600;
        color: #1E3A8A; margin: 0 0 4px;
      }
      .dp-ann-date {
        font-size: 0.75rem; color: #9CA3AF; margin: 0 0 10px;
      }
      .dp-ann-body {
        font-size: 0.875rem; color: #374151;
        line-height: 1.65; margin: 0; white-space: pre-line;
      }

      /* ── Certificates ──────────────────────────────── */
      .dp-cert-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      .dp-cert-card {
        display: block; text-decoration: none;
        background: #fff;
        border: 1px solid #E2E6EF;
        border-radius: 12px;
        padding: 18px 20px;
        transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
      }
      .dp-cert-card:hover {
        border-color: #BFDBFE;
        box-shadow: 0 2px 8px rgba(30,64,175,0.08);
      }
      .dp-cert-card:focus-visible { outline: 2px solid #1E40AF; outline-offset: 2px; }
      .dp-cert-top {
        display: flex; align-items: flex-start;
        justify-content: space-between; gap: 8px; margin-bottom: 10px;
      }
      .dp-cert-icon {
        width: 40px; height: 40px; border-radius: 10px;
        background: #FEF3C7; color: #B45309;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .dp-cert-status {
        font-size: 0.6875rem; font-weight: 600; padding: 3px 8px;
        border-radius: 999px; white-space: nowrap;
      }
      .dp-cert-title {
        font-size: 0.9375rem; font-weight: 600;
        color: #1E3A8A; margin: 0 0 4px;
      }
      .dp-cert-desc {
        font-size: 0.8125rem; color: #4B5563;
        margin: 0 0 8px; line-height: 1.5;
        display: -webkit-box; -webkit-line-clamp: 2;
        -webkit-box-orient: vertical; overflow: hidden;
      }
      .dp-cert-meta {
        font-size: 0.75rem; color: #9CA3AF; margin: 0; font-family: monospace;
      }
      .dp-cert-cta {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 0.75rem; font-weight: 500;
        color: #059669; margin-top: 8px;
      }

      /* ── Dues ──────────────────────────────────────── */
      .dp-dues-status-row {
        display: flex; align-items: center; justify-content: space-between;
        gap: 12px; margin-bottom: 16px;
      }
      .dp-dues-label   { font-size: 0.875rem; font-weight: 500; color: #0F172A; margin: 0; }
      .dp-dues-sub     { font-size: 0.75rem; color: #6B7280; margin: 2px 0 0; }
      .dp-dues-badge {
        font-size: 0.8125rem; font-weight: 600;
        padding: 4px 12px; border-radius: 999px;
      }
      .dp-dues-badge--paid    { background: #D1FAE5; color: #065F46; }
      .dp-dues-badge--unpaid  { background: #FEF3C7; color: #92400E; }
      .dp-dues-amount {
        font-size: 0.875rem; color: #374151; margin: 0 0 16px;
      }
      .dp-dues-amount strong { color: #1E3A8A; font-weight: 600; }
      .dp-pay-btn {
        display: flex; align-items: center; justify-content: center;
        gap: 8px; width: 100%; height: 44px;
        background: #1F3A9A; color: #fff;
        border: none; border-radius: 8px;
        font-size: 0.875rem; font-weight: 500;
        font-family: inherit; cursor: pointer;
        transition: background 150ms ease-out;
      }
      .dp-pay-btn:hover:not(:disabled) { background: #1A3286; }
      .dp-pay-btn:focus-visible { outline: 2px solid #1E40AF; outline-offset: 2px; }
      .dp-pay-btn:disabled { opacity: 0.65; cursor: not-allowed; }
      .dp-pay-spinner {
        width: 15px; height: 15px;
        border: 2px solid rgba(255,255,255,0.35);
        border-top-color: #fff; border-radius: 50%;
        animation: dp-spin 0.7s linear infinite; flex-shrink: 0;
      }
      @keyframes dp-spin { to { transform: rotate(360deg); } }

      .dp-pay-msg {
        margin-top: 12px; font-size: 0.875rem;
        padding: 10px 14px; border-radius: 8px;
      }
      .dp-pay-msg--ok  { background: #F0FDF4; color: #166534; }
      .dp-pay-msg--err { background: #FEF2F2; color: #B91C1C; }

      .dp-hist-title {
        font-size: 0.9375rem; font-weight: 600;
        color: #0F172A; margin: 0 0 10px;
      }
      .dp-hist-row {
        display: flex; align-items: center; justify-content: space-between;
        gap: 12px;
      }
      .dp-hist-ref  { font-size: 0.75rem; color: #9CA3AF; margin: 2px 0 0; font-family: monospace; }
      .dp-hist-amount { font-size: 0.9375rem; font-weight: 600; color: #1E3A8A; margin: 0; }
      .dp-hist-status { font-size: 0.8125rem; font-weight: 600; }
      .dp-hist-status--ok  { color: #059669; }
      .dp-hist-status--err { color: #DC2626; }
      .dp-hist-status--pend { color: #D97706; }

      /* ── Profile page ──────────────────────────────── */
      .dp-form-card {
        background: #fff; border: 1px solid #E2E6EF;
        border-radius: 12px; padding: 20px 24px;
      }
      .dp-form-section-title {
        font-size: 0.875rem; font-weight: 600;
        color: #1E3A8A; margin: 0 0 16px;
      }
      .dp-field { margin-bottom: 16px; }
      .dp-label {
        display: block; font-size: 0.8125rem; font-weight: 500;
        color: #374151; margin-bottom: 6px;
      }
      .dp-input {
        width: 100%; height: 44px; padding: 0 12px;
        border: 1px solid #D3D9E8; border-radius: 8px;
        background: #fff; font-size: 0.875rem;
        color: #0F172A; font-family: inherit;
        box-sizing: border-box; outline: none;
        transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
      }
      .dp-input::placeholder { color: #9CA3AF; }
      .dp-input:focus { border-color: #1E40AF; box-shadow: 0 0 0 3px rgba(30,64,175,0.14); }
      .dp-input:disabled { background: #F9FAFB; cursor: not-allowed; color: #9CA3AF; }
      .dp-input-hint { font-size: 0.75rem; color: #9CA3AF; margin: 4px 0 0; }
      .dp-select {
        width: 100%; height: 44px; padding: 0 12px;
        border: 1px solid #D3D9E8; border-radius: 8px;
        background: #fff; font-size: 0.875rem;
        color: #0F172A; font-family: inherit;
        box-sizing: border-box; outline: none; cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 36px;
        transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
      }
      .dp-select:focus { border-color: #1E40AF; box-shadow: 0 0 0 3px rgba(30,64,175,0.14); }
      .dp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .dp-save-btn {
        display: flex; align-items: center; justify-content: center;
        gap: 8px; width: 100%; height: 44px;
        background: #1F3A9A; color: #fff;
        border: none; border-radius: 8px;
        font-size: 0.875rem; font-weight: 500;
        font-family: inherit; cursor: pointer;
        transition: background 150ms ease-out;
      }
      .dp-save-btn:hover:not(:disabled) { background: #1A3286; }
      .dp-save-btn:focus-visible { outline: 2px solid #1E40AF; outline-offset: 2px; }
      .dp-save-btn:disabled { opacity: 0.65; cursor: not-allowed; }
      .dp-msg {
        padding: 10px 14px; border-radius: 8px;
        font-size: 0.875rem; line-height: 1.5;
      }
      .dp-msg--ok  { background: #F0FDF4; color: #166534; }
      .dp-msg--err { background: #FEF2F2; color: #B91C1C; }
      .dp-msg--inf { background: #EFF6FF; color: #1E40AF; }

      @media (max-width: 639px) {
        .dp-cert-grid { grid-template-columns: 1fr; }
        .dp-grid-2    { grid-template-columns: 1fr; }
      }
      @media (prefers-reduced-motion: reduce) {
        .dp-card--skel .dp-skel { animation: none; background: #E2E8F0; }
        .dp-pay-spinner           { animation: none; }
        .dp-cert-card, .dp-pay-btn, .dp-save-btn { transition: none; }
      }
    `}</style>
  );
}
