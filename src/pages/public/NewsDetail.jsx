import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function NewsDetail() {
  const { slug } = useParams();
  const [item, setItem]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setNotFound(true);
        else setItem(data);
        setLoading(false);
      });
  }, [slug]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="nd-page nd-state" aria-busy="true" aria-label="Loading article">
        <RefreshCw size={28} className="nd-spinner" aria-hidden="true" />
        <p className="nd-state-body">Loading article…</p>
        <style>{`
          .nd-spinner { color: var(--color-blue); animation: nd-spin 0.9s linear infinite; }
          @keyframes nd-spin { to { transform: rotate(360deg); } }
          @media (prefers-reduced-motion: reduce) { .nd-spinner { animation: none; } }
        `}</style>
      </div>
    );
  }

  /* ── Not found ── */
  if (notFound) {
    return (
      <div className="nd-page nd-state">
        <h1 className="nd-state-heading">Article not found</h1>
        <p className="nd-state-body">This article may have been removed or the link is incorrect.</p>
        <Link to="/news" className="btn btn-primary" style={{ marginTop: "8px" }}>
          ← Back to News
        </Link>
      </div>
    );
  }

  const publishDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString("en-NG", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <article className="nd-page" aria-labelledby="nd-title">

      {/* Back nav */}
      <Link to="/news" className="nd-back">
        <ArrowLeft size={14} aria-hidden="true" />
        Back to News
      </Link>

      {/* Cover image */}
      {item.cover_image && (
        <div className="nd-cover" aria-hidden="true">
          <img
            src={item.cover_image}
            alt={item.title}
            className="nd-cover__img"
            loading="eager"
          />
        </div>
      )}

      {/* Title */}
      <h1 id="nd-title" className="nd-title">{item.title}</h1>

      {/* Meta — date + author */}
      {(publishDate || item.author) && (
        <div className="nd-meta" aria-label="Article metadata">
          {publishDate && (
            <span className="nd-meta__item">
              <Calendar size={13} aria-hidden="true" />
              <time dateTime={item.published_at}>{publishDate}</time>
            </span>
          )}
          {item.author && (
            <span className="nd-meta__item">
              <User size={13} aria-hidden="true" />
              {item.author}
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      <hr className="nd-divider" aria-hidden="true" />

      {/* Body */}
      <div className="nd-body">{item.body}</div>

      <style>{`
        .nd-page {
          max-width: 720px;
          margin-inline: auto;
          padding-inline: 24px;
          padding-top: 48px;
          padding-bottom: 80px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* ── Loading / not-found state ── */
        .nd-state {
          align-items: center;
          text-align: center;
          gap: 16px;
          padding-top: 80px;
        }
        .nd-state-heading {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-blue-dark);
          margin: 0;
        }
        .nd-state-body {
          font-size: var(--text-base);
          color: var(--color-text-muted);
          margin: 0;
        }

        /* ── Back link ── */
        .nd-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--color-green);
          text-decoration: none;
          margin-bottom: 28px;
          transition: color 150ms ease-out;
        }
        .nd-back:hover { color: var(--color-blue); }
        .nd-back:focus-visible {
          outline: 2px solid var(--color-blue);
          outline-offset: 3px;
          border-radius: 3px;
        }

        /* ── Cover image ── */
        .nd-cover {
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 28px;
          aspect-ratio: 16 / 7;
          background: var(--color-bg-alt);
        }
        .nd-cover__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── Title ── */
        .nd-title {
          font-size: clamp(1.5rem, 4vw, 2.25rem);
          font-weight: 700;
          color: var(--color-blue-dark);
          line-height: 1.2;
          margin: 0 0 16px;
        }

        /* ── Meta row ── */
        .nd-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }
        .nd-meta__item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: var(--text-sm);
          color: var(--color-text-muted);
        }

        /* ── Divider ── */
        .nd-divider {
          border: none;
          border-top: 1px solid var(--color-border);
          margin: 0 0 28px;
        }

        /* ── Body text ── */
        .nd-body {
          font-size: var(--text-md);
          line-height: 1.8;
          color: var(--color-text-secondary);
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* ── Mobile ── */
        @media (max-width: 639px) {
          .nd-page { padding-inline: 16px; padding-top: 32px; }
          .nd-cover { aspect-ratio: 16 / 9; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nd-back { transition: none; }
        }
      `}</style>
    </article>
  );
}
