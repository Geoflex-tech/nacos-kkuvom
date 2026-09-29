import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, ArrowRight, User, Calendar, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PageHeader from "../../components/PageHeader";

export default function News() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) {
          console.error("[News] Failed to load:", err.code, err.message);
          setError("Couldn't load news. Please try again.");
        } else {
          setItems(data || []);
        }
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHeader
        label="Latest Updates"
        titleBold="CHAPTER"
        titleLight="NEWS"
        description="Stories, announcements, and updates from NACOS KKU VOM Chapter."
      />

      <div className="nw-page">

        {/* ── Error ── */}
        {error && (
          <div className="nw-state" role="alert">
            <p className="nw-state__msg nw-state__msg--error">{error}</p>
            <button type="button" className="btn btn-primary nw-retry" onClick={load}>
              <RefreshCw size={14} aria-hidden="true" /> Try again
            </button>
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {loading && !error && (
          <div className="nw-list" aria-busy="true" aria-label="Loading news">
            {[1, 2, 3].map((i) => (
              <div key={i} className="nw-skel" aria-hidden="true">
                <div className="nw-skel__bar nw-skel__bar--date" />
                <div className="nw-skel__bar nw-skel__bar--title" />
                <div className="nw-skel__bar nw-skel__bar--body" />
                <div className="nw-skel__bar nw-skel__bar--body nw-skel__bar--short" />
              </div>
            ))}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && items.length === 0 && (
          <div className="nw-state">
            <Newspaper size={40} aria-hidden="true" style={{ color: "#CBD5E1", marginBottom: "12px" }} />
            <p className="nw-state__msg">No news yet. Check back soon.</p>
          </div>
        )}

        {/* ── Article list ── */}
        {!loading && !error && items.length > 0 && (
          <div className="nw-list">
            {items.map((n, index) => {
              const isFeatured = index === 0 && items.length > 2;
              const date = new Date(n.published_at).toLocaleDateString("en-NG", {
                year: "numeric", month: "long", day: "numeric",
              });

              return (
                <Link
                  key={n.id}
                  to={`/news/${n.slug}`}
                  className={`nw-card${isFeatured ? " nw-card--featured" : ""}`}
                  aria-label={n.title}
                >
                  {/* Featured cover image */}
                  {isFeatured && n.cover_image && (
                    <div className="nw-card__cover" aria-hidden="true">
                      <img
                        src={n.cover_image}
                        alt=""
                        loading="eager"
                        className="nw-card__cover-img"
                      />
                    </div>
                  )}

                  <div className="nw-card__body">
                    {isFeatured && (
                      <span className="nw-featured-pill">Featured</span>
                    )}

                    <h2 className={`nw-card__title${isFeatured ? " nw-card__title--featured" : ""}`}>
                      {n.title}
                    </h2>

                    <div className="nw-card__meta">
                      <span className="nw-card__meta-item">
                        <Calendar size={12} aria-hidden="true" />
                        <time dateTime={n.published_at}>{date}</time>
                      </span>
                      {n.author && (
                        <span className="nw-card__meta-item">
                          <User size={12} aria-hidden="true" />
                          {n.author}
                        </span>
                      )}
                    </div>

                    <p className="nw-card__excerpt">{n.body}</p>

                    <span className="nw-card__readmore">
                      Read full article <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>

      <style>{`
        /* ── Page shell ── */
        .nw-page {
          max-width: 860px;
          margin-inline: auto;
          padding-inline: 24px;
          padding-top: 48px;
          padding-bottom: 80px;
        }

        /* ── States ── */
        .nw-state {
          padding: 64px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .nw-state__msg { font-size: var(--text-base); color: var(--color-text-muted); margin: 0; }
        .nw-state__msg--error { color: var(--color-error); }
        .nw-retry { gap: 6px; }

        /* ── Article list ── */
        .nw-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Card ── */
        .nw-card {
          display: block;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          text-decoration: none;
          transition: border-color 150ms ease-out, box-shadow 150ms ease-out, transform 150ms ease-out;
        }
        .nw-card:hover {
          border-color: var(--color-blue);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .nw-card:focus-visible {
          outline: 2px solid var(--color-blue);
          outline-offset: 2px;
        }

        /* Featured card: image left, text right on desktop */
        .nw-card--featured {
          display: flex;
          flex-direction: row;
        }

        .nw-card__cover {
          width: 260px;
          flex-shrink: 0;
          overflow: hidden;
          background: var(--color-bg-alt);
        }
        .nw-card__cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 300ms ease-out;
        }
        .nw-card--featured:hover .nw-card__cover-img { transform: scale(1.04); }

        /* Body */
        .nw-card__body {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }

        /* Featured pill */
        .nw-featured-pill {
          display: inline-flex;
          align-items: center;
          padding: 2px 10px;
          border-radius: var(--radius-pill);
          background: var(--color-yellow-light);
          color: var(--color-yellow);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          align-self: flex-start;
        }

        /* Title */
        .nw-card__title {
          font-size: var(--text-md);
          font-weight: 700;
          color: var(--color-blue-dark);
          line-height: 1.3;
          margin: 0;
          transition: color 150ms ease-out;
        }
        .nw-card__title--featured { font-size: clamp(1.125rem, 2.5vw, 1.375rem); }
        .nw-card:hover .nw-card__title { color: var(--color-green); }

        /* Meta row */
        .nw-card__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .nw-card__meta-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }

        /* Excerpt */
        .nw-card__excerpt {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          line-height: 1.65;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .nw-card--featured .nw-card__excerpt { -webkit-line-clamp: 3; }

        /* Read more */
        .nw-card__readmore {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--color-green);
          margin-top: 4px;
          transition: gap 150ms ease-out;
        }
        .nw-card:hover .nw-card__readmore { gap: 8px; }

        /* ── Skeletons ── */
        .nw-skel {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .nw-skel__bar {
          border-radius: 6px;
          background: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%);
          background-size: 200% 100%;
          animation: nw-shimmer 1.4s infinite;
        }
        .nw-skel__bar--date   { height: 12px; width: 130px; }
        .nw-skel__bar--title  { height: 18px; width: 75%; }
        .nw-skel__bar--body   { height: 13px; width: 100%; }
        .nw-skel__bar--short  { width: 60%; }
        @keyframes nw-shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* ── Tablet: cover narrower ── */
        @media (max-width: 768px) {
          .nw-card__cover { width: 200px; }
        }

        /* ── Mobile: stack featured card vertically ── */
        @media (max-width: 639px) {
          .nw-page { padding-inline: 16px; padding-top: 32px; padding-bottom: 60px; }
          .nw-card--featured { flex-direction: column; }
          .nw-card__cover { width: 100%; height: 200px; }
          .nw-card__body  { padding: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nw-card, .nw-card__title, .nw-card__readmore { transition: none; }
          .nw-card__cover-img { transition: none; }
          .nw-skel__bar { animation: none; background: #E2E8F0; }
        }
      `}</style>
    </>
  );
}
