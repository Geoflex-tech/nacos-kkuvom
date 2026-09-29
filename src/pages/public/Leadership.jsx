/**
 * Leadership page — /leadership  and  /leadership/:slug
 *
 * Renders three tier groups (Executive Officers / Directors / Discipline),
 * each with a card grid of filled + vacant positions, sorted by rank.
 * If a :slug is in the URL, the matching filled leader's bio dialog is opened automatically.
 *
 * STEP 2 + STEP 3 + STEP 5 of the spec.
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import LeadershipCard from "../../components/LeadershipCard";
import BioDialog from "../../components/BioDialog";
import { useLeadership } from "../../hooks/useLeadership";
import { RefreshCw } from "lucide-react";

/* ── tier display config ─────────────────────────────────────── */
const TIER_META = [
  { key: "executive",  label: "Executive Officers" },
  { key: "directors",  label: "Directors"          },
  { key: "discipline", label: "Discipline"         },
];

/* ── Loading skeleton ─────────────────────────────────────────── */
function SkeletonGrid({ count = 7 }) {
  return (
    <div className="lp-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="lp-skeleton" />
      ))}
    </div>
  );
}

/* ── JSON-LD for filled leaders ───────────────────────────────── */
function PersonStructuredData({ filled }) {
  if (!filled.length) return null;
  const items = filled.map((l) => ({
    "@type": "Person",
    name:  l.name,
    jobTitle: l.position,
    ...(l.image_url && { image: l.image_url }),
    ...(l.bio && { description: l.bio }),
    memberOf: {
      "@type": "Organization",
      name: "NACOS KKU VOM Chapter",
    },
  }));
  const schema = {
    "@context": "https://schema.org",
    "@graph": items,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function Leadership() {
  const { slug }   = useParams();       // /leadership/:slug
  const navigate   = useNavigate();
  const { leaders, filled, vacant, total, byTier, loading, error, retry } =
    useLeadership();

  const [activeBio, setActiveBio]       = useState(null);   // leader | null
  const [triggerRef, setTriggerRef]     = useState(null);   // ref to "Read bio" btn

  /* ── open bio dialog ─────────────────────────────────────── */
  const openBio = useCallback((leader, btnRef) => {
    setActiveBio(leader);
    setTriggerRef(btnRef);
    // push slug URL without full navigation
    navigate(`/leadership/${leader.slug}`, { replace: false });
  }, [navigate]);

  /* ── close bio dialog ───────────────────────────────────── */
  const closeBio = useCallback(() => {
    setActiveBio(null);
    navigate("/leadership", { replace: true });
  }, [navigate]);

  /* ── open dialog when /leadership/:slug is loaded ─────── */
  useEffect(() => {
    if (!slug || !leaders.length) return;
    const match = filled.find((l) => l.slug === slug);
    if (match && !activeBio) {
      setActiveBio(match);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, leaders]);

  /* ── render ──────────────────────────────────────────────── */
  return (
    <>
      {/* SEO structured data */}
      {!loading && <PersonStructuredData filled={filled} />}

      <PageHeader
        label="Leadership"
        titleBold="MEET THE"
        titleLight="PIONEER TEAM"
        description="The elected officers and directors serving NACOS KKU VOM Chapter."
      />

      <section className="lp-wrap" aria-labelledby="lp-heading">
        <div className="lp-container">

          {/* ── "X of 13 positions filled" ─ */}
          {!loading && !error && (
            <p className="lp-stats" aria-live="polite">
              <strong>{filled.length}</strong> of{" "}
              <strong>{total}</strong> positions filled
            </p>
          )}

          {/* ── Error state ── */}
          {error && (
            <div className="lp-error" role="alert">
              <p>Couldn't load the team. Retry.</p>
              <button
                type="button"
                className="lp-retry-btn"
                onClick={retry}
              >
                <RefreshCw size={14} aria-hidden="true" />
                Try again
              </button>
            </div>
          )}

          {/* ── Loading skeletons ── */}
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

          {/* ── Tier groups ── */}
          {!loading && !error && (
            <div>
              {TIER_META.map(({ key, label }) => {
                const group = byTier[key] || [];
                if (group.length === 0) return null;
                return (
                  <div key={key} className="lp-tier">
                    <h2 className="lp-tier__heading">{label}</h2>
                    <ul className="lp-grid" role="list">
                      {group.map((leader) => (
                        <li key={leader.id} className="lp-grid__item">
                          <LeadershipCard
                            leader={leader}
                            onReadBio={openBio}
                          />
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

      {/* Bio dialog */}
      <BioDialog
        leader={activeBio}
        triggerRef={triggerRef}
        onClose={closeBio}
      />

      <style>{`
        /* ── Page wrapper ──────────────────────────── */
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

        /* ── Stats line ─────────────────────────────── */
        .lp-stats {
          font-size: 14px;
          color: #64748B;
          margin-bottom: 40px;
        }
        .lp-stats strong { color: #1E40AF; }

        /* ── Tier group ─────────────────────────────── */
        .lp-tier {
          margin-bottom: 40px;
        }
        .lp-tier__heading {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #94A3B8;
          margin: 0 0 16px 0;
        }

        /* ── Card grid ──────────────────────────────── */
        .lp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .lp-grid__item {
          /* ensure all cells in a row have equal height */
          display: flex;
          flex-direction: column;
        }
        .lp-grid__item > * { flex: 1; }

        /* ── Tablet: 3 columns ──────────────────────── */
        @media (max-width: 1023px) {
          .lp-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* ── Mobile: 2 columns ──────────────────────── */
        @media (max-width: 639px) {
          .lp-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }

        /* ── Skeleton ───────────────────────────────── */
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

        /* ── Error state ─────────────────────────────── */
        .lp-error {
          text-align: center;
          padding: 48px 16px;
          color: #64748B;
        }
        .lp-retry-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 8px 18px;
          border-radius: 999px;
          background: #1E40AF;
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          transition: background 150ms ease-out;
        }
        .lp-retry-btn:hover { background: #1D4ED8; }
        .lp-retry-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1E40AF;
        }

        /* ── Reduced motion ─────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .lp-skeleton { animation: none; background: #E2E8F0; }
        }
      `}</style>
    </>
  );
}
