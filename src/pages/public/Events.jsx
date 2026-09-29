import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PageHeader from "../../components/PageHeader";

const FILTERS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past",     label: "Past"     },
  { id: "all",      label: "All"      },
];

export default function Events() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("upcoming");
  const [error, setError]     = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) {
          console.error("[Events] Failed to load:", err.code, err.message);
          setError("Couldn't load events. Please try again.");
        } else {
          setItems(data || []);
        }
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const now = new Date();
  const filtered = items.filter((e) => {
    if (!e.event_date) return true;
    const d = new Date(e.event_date);
    if (filter === "upcoming") return d >= now;
    if (filter === "past")     return d < now;
    return true;
  });

  return (
    <>
      <PageHeader
        label="What's Happening"
        titleBold="UPCOMING"
        titleLight="EVENTS"
        description="Workshops, talks, meetings, and activities from NACOS KKU VOM Chapter."
      />

      <div className="ev-page">

        {/* ── Filter tabs ── */}
        <div className="ev-filters" role="group" aria-label="Filter events">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`ev-filter-btn${filter === f.id ? " ev-filter-btn--active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="ev-state" role="alert">
            <p className="ev-state__msg ev-state__msg--error">{error}</p>
            <button type="button" className="btn btn-primary ev-retry" onClick={load}>
              <RefreshCw size={14} aria-hidden="true" /> Try again
            </button>
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {loading && !error && (
          <div className="ev-list" aria-busy="true" aria-label="Loading events">
            {[1, 2, 3].map((i) => (
              <div key={i} className="ev-skel" aria-hidden="true">
                <div className="ev-skel__badge" />
                <div className="ev-skel__body">
                  <div className="ev-skel__bar ev-skel__bar--title" />
                  <div className="ev-skel__bar ev-skel__bar--meta" />
                  <div className="ev-skel__bar ev-skel__bar--desc" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && filtered.length === 0 && (
          <div className="ev-state">
            <Calendar size={40} aria-hidden="true" style={{ color: "#CBD5E1", marginBottom: "12px" }} />
            <p className="ev-state__msg">
              {filter === "upcoming"
                ? "No upcoming events. Check back soon."
                : filter === "past"
                ? "No past events recorded."
                : "No events yet."}
            </p>
          </div>
        )}

        {/* ── Event cards ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="ev-list" role="list" aria-label="Events">
            {filtered.map((e) => {
              const d = new Date(e.event_date);
              const isPast = d < now;
              const month = d.toLocaleString("default", { month: "short" });
              const time  = d.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit" });

              return (
                <article key={e.id} className="ev-card" role="listitem">

                  {/* Date badge */}
                  <div
                    className="ev-date-badge"
                    aria-label={`${month} ${d.getDate()} ${d.getFullYear()}`}
                    style={{
                      background: isPast ? "#F1F5F9" : "var(--color-blue-dark)",
                    }}
                  >
                    <span className="ev-date-badge__month"
                      style={{ color: isPast ? "#94A3B8" : "rgba(255,255,255,0.75)" }}>
                      {month}
                    </span>
                    <span className="ev-date-badge__day"
                      style={{ color: isPast ? "#64748B" : "#fff" }}>
                      {d.getDate()}
                    </span>
                    <span className="ev-date-badge__year"
                      style={{ color: isPast ? "#94A3B8" : "rgba(255,255,255,0.65)" }}>
                      {d.getFullYear()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="ev-card__body">
                    <div className="ev-card__top">
                      <h2 className="ev-card__title">{e.title}</h2>
                      <span
                        className="ev-card__status"
                        style={isPast
                          ? { background: "#F1F5F9", color: "#64748B" }
                          : { background: "var(--color-green-light)", color: "var(--color-green)" }
                        }
                      >
                        {isPast ? "Past" : "Upcoming"}
                      </span>
                    </div>

                    <div className="ev-card__meta">
                      <span className="ev-card__meta-item">
                        <Clock size={13} aria-hidden="true" />
                        <time dateTime={e.event_date}>{time}</time>
                      </span>
                      {e.location && (
                        <span className="ev-card__meta-item">
                          <MapPin size={13} aria-hidden="true" />
                          {e.location}
                        </span>
                      )}
                    </div>

                    {e.description && (
                      <p className="ev-card__desc">{e.description}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      <style>{`
        /* ── Page shell ── */
        .ev-page {
          max-width: 860px;
          margin-inline: auto;
          padding-inline: 24px;
          padding-top: 48px;
          padding-bottom: 80px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ── Filter tabs ── */
        .ev-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ev-filter-btn {
          padding: 6px 18px;
          border-radius: var(--radius-pill);
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          font-family: inherit;
          border: 1.5px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-text-muted);
          cursor: pointer;
          transition: background 150ms ease-out, color 150ms ease-out, border-color 150ms ease-out;
          min-height: 36px;
        }
        .ev-filter-btn:hover { background: var(--color-bg-alt); color: var(--color-blue); border-color: var(--color-blue); }
        .ev-filter-btn--active {
          background: var(--color-blue-dark);
          color: #fff;
          border-color: var(--color-blue-dark);
        }
        .ev-filter-btn:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }

        /* ── States ── */
        .ev-state {
          padding: 64px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .ev-state__msg { font-size: var(--text-base); color: var(--color-text-muted); margin: 0; }
        .ev-state__msg--error { color: var(--color-error); }
        .ev-retry { gap: 6px; }

        /* ── Event list ── */
        .ev-list { display: flex; flex-direction: column; gap: 14px; }

        /* ── Event card ── */
        .ev-card {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          box-shadow: var(--shadow-sm);
        }

        /* Date badge */
        .ev-date-badge {
          flex-shrink: 0;
          width: 64px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 0 8px;
          text-align: center;
        }
        .ev-date-badge__month {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          line-height: 1;
          margin-bottom: 4px;
        }
        .ev-date-badge__day {
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 2px;
        }
        .ev-date-badge__year {
          font-size: 10px;
          font-weight: 500;
          line-height: 1;
        }

        /* Card body */
        .ev-card__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }

        .ev-card__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ev-card__title {
          font-size: var(--text-md);
          font-weight: 700;
          color: var(--color-blue-dark);
          line-height: 1.3;
          margin: 0;
          flex: 1;
          min-width: 0;
        }
        .ev-card__status {
          display: inline-flex;
          align-items: center;
          padding: 2px 10px;
          border-radius: var(--radius-pill);
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ev-card__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }
        .ev-card__meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: var(--text-sm);
          color: var(--color-text-muted);
        }

        .ev-card__desc {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: 1.65;
          margin: 0;
          white-space: pre-line;
        }

        /* ── Skeletons ── */
        .ev-skel {
          display: flex; gap: 20px; align-items: flex-start;
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); padding: 20px 24px;
        }
        .ev-skel__badge {
          width: 64px; height: 80px; border-radius: var(--radius-sm); flex-shrink: 0;
          background: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%);
          background-size: 200% 100%; animation: ev-shimmer 1.4s infinite;
        }
        .ev-skel__body { flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .ev-skel__bar {
          border-radius: 6px;
          background: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%);
          background-size: 200% 100%; animation: ev-shimmer 1.4s infinite;
        }
        .ev-skel__bar--title { height: 18px; width: 70%; }
        .ev-skel__bar--meta  { height: 13px; width: 45%; }
        .ev-skel__bar--desc  { height: 13px; width: 90%; }
        @keyframes ev-shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* ── Mobile ── */
        @media (max-width: 639px) {
          .ev-page { padding-inline: 16px; padding-top: 32px; padding-bottom: 60px; gap: 20px; }
          .ev-card { flex-direction: column; gap: 14px; padding: 16px; }
          .ev-date-badge { flex-direction: row; width: auto; padding: 6px 14px; gap: 8px; border-radius: var(--radius-pill); }
          .ev-date-badge__day { font-size: 1.125rem; margin-bottom: 0; }
          .ev-date-badge__month, .ev-date-badge__year { font-size: 11px; }
          .ev-skel { flex-direction: column; gap: 12px; }
          .ev-skel__badge { width: 100%; height: 36px; border-radius: var(--radius-pill); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ev-filter-btn, .ev-card { transition: none; }
          .ev-skel__bar, .ev-skel__badge { animation: none; background: #E2E8F0; }
        }
      `}</style>
    </>
  );
}
