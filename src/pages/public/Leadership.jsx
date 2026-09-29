/**
 * Leadership page — /leadership  and  /leadership/:slug
 *
 * Three tier groups (Executive Officers / Directors / Discipline).
 * All 13 positions show as vacant until filled via admin.
 * When a position is filled in the DB it appears automatically.
 */
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, RefreshCw } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import LeadershipCard from "../../components/LeadershipCard";
import BioDialog from "../../components/BioDialog";
import { useLeadership } from "../../hooks/useLeadership";

const TIER_META = [
  { key: "executive",  label: "Executive Officers" },
  { key: "directors",  label: "Directors"          },
  { key: "discipline", label: "Discipline"         },
];

/* ── Vacant box ─────────────────────────────────────────── */
function VacantBox({ position }) {
  return (
    <article aria-label={`${position}, coming soon`} className="lp-vacant">
      <div className="lp-vacant__icon" aria-hidden="true">
        <User size={24} color="#94A3B8" strokeWidth={1.5} />
      </div>
      <p className="lp-vacant__title">{position}</p>
      <span className="lp-vacant__pill">Coming soon</span>
    </article>
  );
}

/* ── Skeleton ────────────────────────────────────────────── */
function SkeletonGrid({ count = 7 }) {
  return (
    <div className="lp-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="lp-skeleton" />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function Leadership() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { leaders, filled, total, byTier, loading, error, retry } = useLeadership();

  const [activeBio, setActiveBio]   = useState(null);
  const [triggerRef, setTriggerRef] = useState(null);

  const openBio = useCallback((leader, btnRef) => {
    setActiveBio(leader);
    setTriggerRef(btnRef);
    navigate(`/leadership/${leader.slug}`, { replace: false });
  }, [navigate]);

  const closeBio = useCallback(() => {
    setActiveBio(null);
    navigate("/leadership", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!slug || !leaders.length) return;
    const match = filled.find((l) => l.slug === slug);
    if (match && !activeBio) setActiveBio(match);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, leaders]);

  const statsLine = filled.length === 0
    ? "Positions will be announced soon."
    : `${filled.length} of ${total} positions filled`;

  return (
    <>
      <PageHeader
        label="Leadership"
        titleBold="MEET THE"
        titleLight="PIONEER TEAM"
        description="The elected officers and directors serving NACOS KKU VOM Chapter."
      />

      <section className="lp-wrap">
        <div className="lp-container">

          {!loading && !error && (
            <p className="lp-stats" aria-live="polite">{statsLine}</p>
          )}

          {error && (
            <div className="lp-error" role="alert">
              <p>Couldn&apos;t load the team. Please try again.</p>
              <button type="button" className="lp-retry-btn" onClick={retry}>
                <RefreshCw size={14} aria-hidden="true" /> Try again
              </button>
            </div>
          )}

          {loading && !error && (
            <div aria-busy="true" aria-label="Loading leadership team">
              {TIER_META.map(({ key, label }) => (
                <div key={key} className="lp-tier">
                  <h2 className="lp-tier__heading">{label}</h2>
                  <SkeletonGrid count={key === "executive" ? 7 : key === "directors" ? 5 : 1} />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && (
            <div>
              {TIER_META.map(({ key, label }) => {
                const group = byTier[key] || [];
                if (!group.length) return null;
                return (
                  <div key={key} className="lp-tier">
                    <h2 className="lp-tier__heading">{label}</h2>
                    <ul className="lp-grid" role="list">
                      {group.map((leader) => (
                        <li key={leader.id} className="lp-grid__item">
                          {leader.status === "filled" && leader.name
                            ? <LeadershipCard leader={leader} onReadBio={openBio} />
                            : <VacantBox position={leader.position} />
                          }
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Bio dialog — only reachable when a position is filled */}
      <BioDialog leader={activeBio} triggerRef={triggerRef} onClose={closeBio} />

      <style>{`
        .lp-wrap {
          background: #F4F7FB;
          padding-top: 40px;
          padding-bottom: 72px;
        }
        .lp-container {
          max-width: 1120px;
          margin-inline: auto;
          padding-inline: 24px;
        }
        .lp-stats {
          font-size: 14px;
          color: #64748B;
          margin-bottom: 40px;
        }
        .lp-tier { margin-bottom: 40px; }
        .lp-tier__heading {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #94A3B8;
          margin: 0 0 16px;
        }
        .lp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          list-style: none;
          padding: 0; margin: 0;
        }
        .lp-grid__item { display: flex; flex-direction: column; }
        .lp-grid__item > * { flex: 1; }

        /* ── Vacant box ── */
        .lp-vacant {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px 14px;
          border: 1px dashed #C3CCE0;
          border-radius: 12px;
          background: transparent;
          min-height: 170px;
          box-sizing: border-box;
        }
        .lp-vacant__icon {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: #EEF3FB;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px; flex-shrink: 0;
        }
        .lp-vacant__title {
          font-size: 13px;
          font-weight: 500;
          color: #64748B;
          line-height: 1.4;
          margin: 0 0 10px;
          word-break: break-word;
          hyphens: auto;
        }
        .lp-vacant__pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 9999px;
          background: #FEF3C7;
          color: #B45309;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        /* ── Tablet: 3 columns ── */
        @media (max-width: 1023px) {
          .lp-grid { grid-template-columns: repeat(3, 1fr); }
        }
        /* ── Mobile: 2 columns ── */
        @media (max-width: 639px) {
          .lp-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .lp-container { padding-inline: 16px; }
        }

        /* ── Skeleton ── */
        .lp-skeleton {
          height: 170px;
          border-radius: 12px;
          background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
          background-size: 200% 100%;
          animation: lp-shimmer 1.4s infinite;
        }
        @keyframes lp-shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* ── Error ── */
        .lp-error { text-align: center; padding: 48px 16px; color: #64748B; }
        .lp-retry-btn {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 12px; padding: 8px 18px;
          border-radius: 9999px; background: #1E40AF; color: #fff;
          border: none; cursor: pointer; font-size: 13px; font-weight: 600;
          font-family: inherit; transition: background 150ms ease-out;
        }
        .lp-retry-btn:hover { background: #1D4ED8; }
        .lp-retry-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1E40AF;
        }

        @media (prefers-reduced-motion: reduce) {
          .lp-skeleton { animation: none; background: #E2E8F0; }
        }
      `}</style>
    </>
  );
}
