import { useEffect, useState, useCallback } from "react";
import { X, Image as ImageIcon, RefreshCw, ZoomIn } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PageHeader from "../../components/PageHeader";

export default function Gallery() {
  const [items, setItems]     = useState([]);
  const [active, setActive]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    supabase
      .from("gallery")
      .select("*")
      .order("uploaded_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) {
          console.error("[Gallery] Failed to load:", err.code, err.message);
          setError("Couldn't load gallery. Please try again.");
        } else {
          setItems(data || []);
        }
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Lightbox keyboard & scroll lock ── */
  const handleKey = useCallback((e) => {
    if (e.key === "Escape") setActive(null);
  }, []);

  useEffect(() => {
    if (active) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [active, handleKey]);

  return (
    <>
      <PageHeader
        label="Moments"
        titleBold="PHOTO"
        titleLight="GALLERY"
        description="Photos from our events, activities, and chapter milestones."
      />

      <div className="gl-page">

        {/* ── Error ── */}
        {error && (
          <div className="gl-state" role="alert">
            <p className="gl-state__msg gl-state__msg--error">{error}</p>
            <button type="button" className="btn btn-primary gl-retry" onClick={load}>
              <RefreshCw size={14} aria-hidden="true" /> Try again
            </button>
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {loading && !error && (
          <ul className="gl-grid" aria-busy="true" aria-label="Loading photos" role="list">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="gl-skel" aria-hidden="true" />
            ))}
          </ul>
        )}

        {/* ── Empty ── */}
        {!loading && !error && items.length === 0 && (
          <div className="gl-state">
            <ImageIcon size={40} aria-hidden="true" style={{ color: "#CBD5E1", marginBottom: "12px" }} />
            <p className="gl-state__msg">No photos yet. Check back soon.</p>
          </div>
        )}

        {/* ── Photo grid ── */}
        {!loading && !error && items.length > 0 && (
          <ul className="gl-grid" role="list" aria-label="Photo gallery">
            {items.map((img) => (
              <li key={img.id}>
                <button
                  type="button"
                  onClick={() => setActive(img)}
                  aria-label={img.caption ? `View: ${img.caption}` : "View photo"}
                  className="gl-thumb"
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || "Gallery photo"}
                    loading="lazy"
                    decoding="async"
                    className="gl-thumb__img"
                  />
                  <div className="gl-thumb__overlay" aria-hidden="true">
                    <ZoomIn size={20} />
                  </div>
                  {img.caption && (
                    <div className="gl-thumb__caption" aria-hidden="true">
                      <p>{img.caption}</p>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

      </div>

      {/* ── Lightbox ── */}
      {active && (
        <>
          {/* Backdrop */}
          <div
            className="gl-lb-backdrop"
            onClick={() => setActive(null)}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.caption || "Photo lightbox"}
            className="gl-lb"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close photo"
              className="gl-lb__close"
            >
              <X size={20} aria-hidden="true" />
            </button>

            {/* Image */}
            <div className="gl-lb__img-wrap">
              <img
                src={active.image_url}
                alt={active.caption || "Gallery photo"}
                className="gl-lb__img"
              />
            </div>

            {/* Caption */}
            {active.caption && (
              <p className="gl-lb__caption">{active.caption}</p>
            )}
          </div>
        </>
      )}

      <style>{`
        /* ── Page shell ── */
        .gl-page {
          max-width: 1120px;
          margin-inline: auto;
          padding-inline: 24px;
          padding-top: 48px;
          padding-bottom: 80px;
        }

        /* ── States ── */
        .gl-state {
          padding: 64px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .gl-state__msg { font-size: var(--text-base); color: var(--color-text-muted); margin: 0; }
        .gl-state__msg--error { color: var(--color-error); }
        .gl-retry { gap: 6px; }

        /* ── Photo grid: 4-col → 3-col → 2-col ── */
        .gl-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          list-style: none;
          margin: 0; padding: 0;
        }

        /* ── Thumbnail button ── */
        .gl-thumb {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: var(--radius-md);
          background: var(--color-bg-alt);
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .gl-thumb:focus-visible {
          outline: 2px solid var(--color-blue);
          outline-offset: 2px;
        }

        .gl-thumb__img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 350ms ease-out;
        }
        @media (hover: hover) {
          .gl-thumb:hover .gl-thumb__img {
            transform: scale(1.07);
          }
          .gl-thumb:hover .gl-thumb__overlay {
            opacity: 1;
            background: rgba(15, 23, 42, 0.35);
          }
        }
        .gl-thumb:focus-visible .gl-thumb__img {
          transform: scale(1.07);
        }
        .gl-thumb:focus-visible .gl-thumb__overlay {
          opacity: 1;
          background: rgba(15, 23, 42, 0.35);
        }

        /* Zoom icon overlay */
        .gl-thumb__overlay {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(15, 23, 42, 0.0);
          color: #fff;
          opacity: 0;
          transition: opacity 200ms ease-out, background 200ms ease-out;
        }

        /* Caption bar */
        .gl-thumb__caption {
          position: absolute; inset: auto 0 0 0;
          background: linear-gradient(to top, rgba(0,0,0,0.70), transparent);
          padding: 20px 10px 8px;
          pointer-events: none;
        }
        .gl-thumb__caption p {
          margin: 0;
          font-size: 11px;
          color: #fff;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Skeletons ── */
        .gl-skel {
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          background: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%);
          background-size: 200% 100%;
          animation: gl-shimmer 1.4s infinite;
        }
        @keyframes gl-shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* ── Lightbox backdrop ── */
        .gl-lb-backdrop {
          position: fixed; inset: 0; z-index: 9988;
          background: rgba(5, 8, 22, 0.92);
          backdrop-filter: blur(4px);
          animation: gl-fade-in 150ms ease-out forwards;
        }

        /* ── Lightbox dialog ── */
        .gl-lb {
          position: fixed;
          inset: 0; z-index: 9989;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          padding-left: max(16px, env(safe-area-inset-left));
          padding-right: max(16px, env(safe-area-inset-right));
          pointer-events: none; /* clicks pass through to backdrop to close */
        }

        .gl-lb__close {
          position: fixed;
          top: max(16px, env(safe-area-inset-top, 16px));
          right: max(16px, env(safe-area-inset-right, 16px));
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.20);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          pointer-events: all;
          transition: background 150ms ease-out;
          z-index: 9990;
        }
        .gl-lb__close:hover { background: rgba(255,255,255,0.22); }
        .gl-lb__close:focus-visible { outline: 2px solid #FCD34D; outline-offset: 2px; }

        .gl-lb__img-wrap {
          pointer-events: all;
          max-width: min(90vw, 1000px);
          max-height: 80vh;
          max-height: 80dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: gl-zoom-in 150ms ease-out forwards;
        }
        .gl-lb__img {
          max-width: 100%;
          max-height: 80vh;
          max-height: 80dvh;
          border-radius: var(--radius-lg);
          box-shadow: 0 24px 64px rgba(0,0,0,0.60);
          display: block;
          object-fit: contain;
        }

        .gl-lb__caption {
          color: rgba(255,255,255,0.85);
          font-size: var(--text-base);
          text-align: center;
          margin: 16px 0 0;
          max-width: 60ch;
          pointer-events: none;
        }

        @keyframes gl-fade-in {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes gl-zoom-in {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* ── Tablet: 3 columns ── */
        @media (max-width: 1023px) {
          .gl-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* ── Mobile: 2 columns ── */
        @media (max-width: 639px) {
          .gl-page { padding-inline: 16px; padding-top: 32px; padding-bottom: 60px; }
          .gl-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .gl-lb__img { max-height: 70vh; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gl-thumb__img, .gl-thumb__overlay { transition: none; }
          .gl-skel { animation: none; background: #E2E8F0; }
          .gl-lb-backdrop, .gl-lb__img-wrap { animation: none; }
        }
      `}</style>
    </>
  );
}
