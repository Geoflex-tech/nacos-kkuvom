/**
 * HistoryMilestones — /history
 *
 * Vertical timeline of chapter milestones, sorted by sort_date ascending.
 * Data-driven: no hardcoded content. Shows empty state when no milestones exist.
 * Cards alternate left/right on desktop, single column on mobile.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PageHeader from "../../components/PageHeader";

/* ── Loading skeleton ─────────────────────────────────────── */
function SkeletonTimeline() {
  return (
    <div className="ht-timeline" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`ht-item ht-item--${i % 2 === 0 ? "right" : "left"}`}>
          <div className="ht-dot" />
          <div className="ht-card ht-card--skeleton">
            <div className="ht-skel-pill" />
            <div className="ht-skel-title" />
            <div className="ht-skel-body" />
            <div className="ht-skel-body ht-skel-body--short" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Single milestone card ───────────────────────────────── */
function MilestoneCard({ milestone, side }) {
  return (
    <div className={`ht-item ht-item--${side}`}>
      <div className="ht-dot" aria-hidden="true" />
      <article className="ht-card">
        {/* year pill */}
        <span className="ht-year">{milestone.year}</span>
        <h2 className="ht-title">{milestone.title}</h2>
        <p className="ht-desc">{milestone.description}</p>
        {milestone.image_url && (
          <img
            src={milestone.image_url}
            alt={milestone.title}
            loading="lazy"
            className="ht-img"
          />
        )}
      </article>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function HistoryMilestones() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    supabase
      .from("milestones")
      .select("id, year, title, description, image_url, sort_date")
      .order("sort_date", { ascending: true, nullsFirst: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setMilestones(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHeader
        label="Our journey"
        titleBold="OUR"
        titleLight="HISTORY"
        description="The milestones that have shaped NACOS KKU VOM Chapter from its founding to today."
      />

      <section className="ht-wrap">
        <div className="ht-container">

          {/* Error */}
          {error && (
            <div className="ht-empty" role="alert">
              <p style={{ color: "#DC2626" }}>Couldn't load history. Please try again.</p>
            </div>
          )}

          {/* Loading */}
          {loading && !error && <SkeletonTimeline />}

          {/* Empty state */}
          {!loading && !error && milestones.length === 0 && (
            <div className="ht-empty">
              <BookOpen size={40} aria-hidden="true" style={{ color: "#D1D5DB", marginBottom: "12px" }} />
              <p className="ht-empty-text">
                Our history is being compiled. Check back soon.
              </p>
            </div>
          )}

          {/* Timeline */}
          {!loading && !error && milestones.length > 0 && (
            <div className="ht-timeline" role="list" aria-label="Chapter history timeline">
              {milestones.map((m, i) => (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  side={i % 2 === 0 ? "left" : "right"}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      <style>{`
        /* ── Page wrapper ──────────────────────────────── */
        .ht-wrap {
          background: var(--color-bg-alt, #F4F7FB);
          padding-top: 56px;
          padding-bottom: 80px;
        }
        .ht-container {
          max-width: 900px;
          margin-inline: auto;
          padding-inline: 24px;
        }

        /* ── Empty state ────────────────────────────────── */
        .ht-empty {
          text-align: center;
          padding: 64px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ht-empty-text {
          font-size: 1rem;
          color: #64748B;
          margin: 0;
        }

        /* ── Timeline track ─────────────────────────────── */
        .ht-timeline {
          position: relative;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        /* centre vertical line */
        .ht-timeline::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: #D9DEE8;
          transform: translateX(-50%);
        }

        /* ── Each milestone row ─────────────────────────── */
        .ht-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          margin-bottom: 40px;
          /* alternate: left = card on left, right = card on right */
        }
        .ht-item--left  { flex-direction: row-reverse; }
        .ht-item--right { flex-direction: row; }

        /* dot on the centre line */
        .ht-dot {
          position: absolute;
          left: 50%;
          top: 22px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #1E3A8A;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px #D9DEE8;
          transform: translateX(-50%);
          z-index: 1;
          flex-shrink: 0;
        }

        /* ── Card ───────────────────────────────────────── */
        .ht-card {
          width: calc(50% - 32px);
          background: #ffffff;
          border: 1px solid #D9DEE8;
          border-radius: 12px;
          padding: 20px;
          box-sizing: border-box;
        }
        .ht-item--left  .ht-card { margin-right: 32px; text-align: right; }
        .ht-item--right .ht-card { margin-left:  32px; text-align: left;  }

        /* year pill */
        .ht-year {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 999px;
          background: #D1FAE5;
          color: #047857;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .ht-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1E3A8A;
          line-height: 1.3;
          margin: 0 0 8px;
        }
        .ht-desc {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.6;
          margin: 0;
        }
        .ht-img {
          margin-top: 14px;
          width: 100%;
          border-radius: 8px;
          object-fit: cover;
          max-height: 200px;
          display: block;
        }

        /* ── Skeleton ───────────────────────────────────── */
        .ht-card--skeleton { pointer-events: none; }
        .ht-skel-pill  { height: 20px; width: 60px; border-radius: 999px; background: #E2E8F0; margin-bottom: 10px; animation: ht-shimmer 1.4s infinite; background-size: 200% 100%; background-image: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%); }
        .ht-skel-title { height: 16px; width: 80%;  border-radius: 6px;   background-image: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%); background-size: 200% 100%; animation: ht-shimmer 1.4s infinite; margin-bottom: 8px; }
        .ht-skel-body  { height: 12px; width: 100%; border-radius: 6px;   background-image: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%); background-size: 200% 100%; animation: ht-shimmer 1.4s infinite; margin-bottom: 6px; }
        .ht-skel-body--short { width: 65%; }
        @keyframes ht-shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

        /* ── Mobile: single column ──────────────────────── */
        @media (max-width: 639px) {
          .ht-timeline::before { left: 16px; transform: none; }
          .ht-item { flex-direction: column !important; padding-left: 40px; }
          .ht-dot  { left: 10px; top: 18px; transform: none; }
          .ht-card { width: 100%; margin: 0 !important; text-align: left !important; }
          .ht-item--left .ht-card { margin-right: 0 !important; }
        }

        /* ── Reduced motion ─────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .ht-skel-pill, .ht-skel-title, .ht-skel-body { animation: none; background: #E2E8F0; }
        }
      `}</style>
    </>
  );
}
