import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Trophy, FolderKanban,
  ExternalLink, Quote, Calendar, MapPin, Users, RefreshCw,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

/* ── Status pill colours ─────────────────────────────────── */
const STATUS_STYLES = {
  planned:      { bg: "#F1F5F9", color: "#475569" },
  "in-progress":{ bg: "#FEF3C7", color: "#92400E" },
  completed:    { bg: "#D1FAE5", color: "#065F46" },
  archived:     { bg: "#E5E7EB", color: "#4B5563" },
};

/* ── Loading skeleton strip ──────────────────────────────── */
function Skel({ w = "100%", h = 14, r = 6, mb = 0 }) {
  return (
    <div aria-hidden="true" style={{
      width: w, height: h, borderRadius: r, marginBottom: mb,
      background: "linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%)",
      backgroundSize: "200% 100%", animation: "ad-shimmer 1.4s infinite",
    }} />
  );
}

/* ── Section heading ─────────────────────────────────────── */
function SecHeading({ eyebrow, icon: Icon, iconColor, children }) {
  return (
    <div className="ad-sec-head">
      <p className="ad-eyebrow">{eyebrow}</p>
      <h2 className="ad-sec-title">
        {Icon && <Icon size={22} color={iconColor} aria-hidden="true" />}
        {children}
      </h2>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function AdministrationDetail() {
  const { id } = useParams();
  const [admin, setAdmin]         = useState(null);
  const [executives, setExecs]    = useState([]);
  const [events, setEvents]       = useState([]);
  const [news, setNews]           = useState([]);
  const [gallery, setGallery]     = useState([]);
  const [nextAdmin, setNext]      = useState(null);
  const [prevAdmin, setPrev]      = useState(null);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);

  useEffect(() => {
    (async () => {
      const { data: a } = await supabase
        .from("administrations").select("*").eq("id", id).maybeSingle();

      if (!a) { setNotFound(true); setLoading(false); return; }
      setAdmin(a);

      const [execsR, eventsR, newsR, galleryR, othersR] = await Promise.all([
        supabase.from("executives").select("*").eq("administration_id", id).order("order_index"),
        supabase.from("events").select("*").eq("administration_id", id).order("event_date", { ascending: false }),
        supabase.from("news").select("*").eq("administration_id", id).order("published_at", { ascending: false }),
        supabase.from("gallery").select("*").eq("administration_id", id).order("uploaded_at", { ascending: false }),
        supabase.from("administrations").select("id,session_label,administration_name,start_date").order("start_date", { ascending: true }),
      ]);

      setExecs(execsR.data || []);
      setEvents(eventsR.data || []);
      setNews(newsR.data || []);
      setGallery(galleryR.data || []);

      const sorted = othersR.data || [];
      const idx = sorted.findIndex((x) => x.id === id);
      if (idx > 0)                      setPrev(sorted[idx - 1]);
      if (idx >= 0 && idx < sorted.length - 1) setNext(sorted[idx + 1]);

      setLoading(false);
    })();
  }, [id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="ad-page" style={{ paddingTop: "48px" }}>
        <div className="ad-hero ad-hero--skeleton">
          <Skel w="80px" h={26} r={999} mb={16} />
          <Skel w="60%" h={40} r={8} mb={12} />
          <Skel w="45%" h={22} r={6} />
        </div>
        <div className="ad-body" aria-busy="true">
          {[1,2,3].map((i) => (
            <div key={i} className="ad-section">
              <Skel w="120px" h={13} r={6} mb={10} />
              <Skel w="50%" h={26} r={6} mb={20} />
              <Skel w="100%" h={14} r={6} mb={8} />
              <Skel w="90%" h={14} r={6} mb={8} />
              <Skel w="70%" h={14} r={6} />
            </div>
          ))}
        </div>
        <style>{`@keyframes ad-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}`}</style>
      </div>
    );
  }

  /* ── Not found ── */
  if (notFound) {
    return (
      <div className="ad-page ad-state">
        <h1 className="ad-state__heading">Not found</h1>
        <p className="ad-state__body">This administration record doesn't exist.</p>
        <Link to="/history" className="btn btn-primary" style={{ marginTop: "8px" }}>← Back to History</Link>
      </div>
    );
  }

  const achievements = Array.isArray(admin.achievements) ? admin.achievements : [];
  const projects     = Array.isArray(admin.projects)     ? admin.projects     : [];

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-NG", { month: "long", year: "numeric" }) : null;

  return (
    <>
      {/* ── Hero banner ──────────────────────────────── */}
      <header className="ad-hero">
        {admin.cover_image && (
          <>
            <div className="ad-hero__bg-img" aria-hidden="true">
              <img src={admin.cover_image} alt="" />
            </div>
            <div className="ad-hero__bg-overlay" aria-hidden="true" />
          </>
        )}

        <div className="ad-hero__content">
          <Link to="/history" className="ad-back">
            <ArrowLeft size={14} aria-hidden="true" /> Back to History
          </Link>

          <div className="ad-hero__badges">
            <span className="ad-hero__badge ad-hero__badge--session">{admin.session_label}</span>
            {admin.is_current && (
              <span className="ad-hero__badge ad-hero__badge--current">★ Current</span>
            )}
          </div>

          <h1 className="ad-hero__title">{admin.administration_name}</h1>

          {admin.motto && (
            <p className="ad-hero__motto">"{admin.motto}"</p>
          )}

          {(admin.start_date || admin.end_date) && (
            <p className="ad-hero__dates">
              {[fmtDate(admin.start_date), fmtDate(admin.end_date)].filter(Boolean).join(" — ")}
            </p>
          )}
        </div>
      </header>

      {/* ── Page body ────────────────────────────────── */}
      <div className="ad-page">
        <div className="ad-body">

          {/* About */}
          {admin.description && (
            <div className="ad-section">
              <SecHeading eyebrow="About">About This Administration</SecHeading>
              <div className="ad-prose-card">
                <p className="ad-prose">{admin.description}</p>
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="ad-section">
              <SecHeading eyebrow="Milestones" icon={Trophy} iconColor="#D97706">
                Achievements
              </SecHeading>
              <div className="ad-timeline">
                {achievements.map((a, i) => (
                  <div key={i} className="ad-timeline__item">
                    <div className="ad-timeline__dot" aria-hidden="true">
                      <span>{i + 1}</span>
                    </div>
                    <div className="ad-card ad-timeline__card">
                      <div className="ad-achievement-top">
                        <h3 className="ad-card__heading">{a.title}</h3>
                        {a.date && (
                          <span className="ad-meta-date">
                            {new Date(a.date).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                      {a.description && <p className="ad-card__body">{a.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="ad-section">
              <SecHeading eyebrow="Initiatives" icon={FolderKanban} iconColor="var(--color-green)">
                Projects
              </SecHeading>
              <div className="ad-grid-2">
                {projects.map((p, i) => (
                  <div key={i} className="ad-card ad-card--flex">
                    <div className="ad-project-top">
                      <h3 className="ad-card__heading">{p.name}</h3>
                      {p.status && (
                        <span className="ad-status-pill" style={{
                          background: (STATUS_STYLES[p.status] || STATUS_STYLES.planned).bg,
                          color:      (STATUS_STYLES[p.status] || STATUS_STYLES.planned).color,
                        }}>
                          {p.status}
                        </span>
                      )}
                    </div>
                    {p.description && <p className="ad-card__body ad-card__body--grow">{p.description}</p>}
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer" className="ad-ext-link">
                        View project <ExternalLink size={12} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Executives */}
          {executives.length > 0 && (
            <div className="ad-section">
              <SecHeading eyebrow="Leadership" icon={Users} iconColor="var(--color-blue)">
                Executives
              </SecHeading>
              <div className="ad-exec-grid">
                {executives.map((e) => (
                  <div key={e.id} className="ad-exec-card">
                    {e.image_url ? (
                      <img
                        src={e.image_url}
                        alt={e.name}
                        className="ad-exec-photo"
                        loading="lazy"
                      />
                    ) : (
                      <div className="ad-exec-photo ad-exec-photo--fallback" aria-hidden="true">
                        {e.name?.[0] || "?"}
                      </div>
                    )}
                    <h3 className="ad-exec-name">{e.name}</h3>
                    <p className="ad-exec-pos">{e.position}</p>
                    {e.level && <p className="ad-exec-level">{e.level}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          {events.length > 0 && (
            <div className="ad-section">
              <SecHeading eyebrow="Activities" icon={Calendar} iconColor="var(--color-blue)">
                Events
              </SecHeading>
              <div className="ad-grid-2">
                {events.map((e) => (
                  <div key={e.id} className="ad-card">
                    {e.event_date && (
                      <p className="ad-event-date">
                        {new Date(e.event_date).toDateString()}
                      </p>
                    )}
                    <h3 className="ad-card__heading">{e.title}</h3>
                    {e.location && (
                      <p className="ad-card__meta">
                        <MapPin size={12} aria-hidden="true" /> {e.location}
                      </p>
                    )}
                    {e.description && (
                      <p className="ad-card__body ad-card__body--clamp">{e.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News */}
          {news.length > 0 && (
            <div className="ad-section">
              <SecHeading eyebrow="Updates">News & Posts</SecHeading>
              <div className="ad-grid-2">
                {news.map((n) => (
                  <Link key={n.id} to={`/news/${n.slug}`} className="ad-card ad-card--link">
                    <h3 className="ad-card__heading ad-card__heading--link">{n.title}</h3>
                    <p className="ad-card__meta">{new Date(n.published_at).toDateString()}</p>
                    <p className="ad-card__body ad-card__body--clamp">{n.body}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="ad-section">
              <SecHeading eyebrow="Moments">Gallery</SecHeading>
              <div className="ad-gallery-grid">
                {gallery.slice(0, 8).map((g) => (
                  <div key={g.id} className="ad-gallery-item">
                    <img
                      src={g.image_url}
                      alt={g.caption || ""}
                      loading="lazy"
                      className="ad-gallery-img"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy note */}
          {admin.legacy_note && (
            <div className="ad-section">
              <SecHeading eyebrow="Handover" icon={Quote} iconColor="#D97706">
                Legacy Note
              </SecHeading>
              <div className="ad-legacy">
                <div className="ad-legacy__bg" aria-hidden="true" />
                <Quote size={40} className="ad-legacy__icon" aria-hidden="true" />
                <p className="ad-legacy__text">{admin.legacy_note}</p>
              </div>
            </div>
          )}

          {/* Prev / Next */}
          {(prevAdmin || nextAdmin) && (
            <div className="ad-nav-row">
              {prevAdmin ? (
                <Link to={`/history/${prevAdmin.id}`} className="ad-nav-card">
                  <p className="ad-nav-card__label">
                    <ArrowLeft size={12} aria-hidden="true" /> Previous
                  </p>
                  <p className="ad-nav-card__name">{prevAdmin.administration_name}</p>
                  <p className="ad-nav-card__session">{prevAdmin.session_label}</p>
                </Link>
              ) : <div />}

              {nextAdmin && (
                <Link to={`/history/${nextAdmin.id}`} className="ad-nav-card ad-nav-card--right">
                  <p className="ad-nav-card__label" style={{ justifyContent: "flex-end" }}>
                    Next <ArrowRight size={12} aria-hidden="true" />
                  </p>
                  <p className="ad-nav-card__name">{nextAdmin.administration_name}</p>
                  <p className="ad-nav-card__session">{nextAdmin.session_label}</p>
                </Link>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes ad-shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

        /* ── Hero ── */
        .ad-hero {
          position: relative;
          background: #12245F;
          overflow: hidden;
          padding-top:    calc(env(safe-area-inset-top, 0px) + 10px + 52px + 72px);
          padding-bottom: 64px;
          margin-top: calc(-1 * (env(safe-area-inset-top, 0px) + 10px + 52px + 16px));
        }
        .ad-hero--skeleton {
          padding-top: 48px;
          margin-top: 0;
        }
        .ad-hero__bg-img {
          position: absolute; inset: 0; z-index: 0;
        }
        .ad-hero__bg-img img {
          width: 100%; height: 100%; object-fit: cover; opacity: 0.22; display: block;
        }
        .ad-hero__bg-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(135deg, rgba(18,36,95,0.92) 0%, rgba(30,64,175,0.80) 60%, rgba(5,150,105,0.45) 100%);
        }
        .ad-hero__content {
          position: relative; z-index: 2;
          max-width: 1040px; margin-inline: auto;
          padding-inline: 24px;
          display: flex; flex-direction: column; gap: 12px;
        }

        /* Back link */
        .ad-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: var(--text-sm); font-weight: 500;
          color: rgba(255,255,255,0.70); text-decoration: none;
          transition: color 150ms ease-out;
          align-self: flex-start;
        }
        .ad-back:hover { color: #FCD34D; }
        .ad-back:focus-visible { outline: 2px solid #FCD34D; outline-offset: 3px; border-radius: 3px; }

        /* Badges */
        .ad-hero__badges { display: flex; flex-wrap: wrap; gap: 8px; }
        .ad-hero__badge {
          display: inline-flex; align-items: center;
          padding: 3px 12px; border-radius: var(--radius-pill);
          font-size: 12px; font-weight: 600;
        }
        .ad-hero__badge--session {
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.20);
          color: rgba(255,255,255,0.85);
          font-family: monospace;
        }
        .ad-hero__badge--current {
          background: #FCD34D; color: #1E3A8A;
        }

        .ad-hero__title {
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: 700; color: #fff;
          line-height: 1.1; margin: 0;
        }
        .ad-hero__motto {
          font-size: clamp(0.9375rem, 2vw, 1.125rem);
          color: rgba(255,255,255,0.82);
          font-style: italic; margin: 0;
          max-width: 56ch;
        }
        .ad-hero__dates {
          font-size: var(--text-sm); color: rgba(255,255,255,0.60); margin: 0;
        }

        /* ── Page wrapper ── */
        .ad-page {
          max-width: 1040px; margin-inline: auto;
          padding-inline: 24px;
          padding-bottom: 80px;
        }
        .ad-body { padding-top: 48px; display: flex; flex-direction: column; gap: 56px; }

        /* ── States ── */
        .ad-state {
          text-align: center; padding: 80px 24px;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .ad-state__heading { font-size: 1.5rem; font-weight: 700; color: var(--color-blue-dark); margin: 0; }
        .ad-state__body    { font-size: var(--text-base); color: var(--color-text-muted); margin: 0; }

        /* ── Section heading ── */
        .ad-section {}
        .ad-sec-head { margin-bottom: 24px; }
        .ad-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: var(--color-green);
          margin: 0 0 6px;
        }
        .ad-sec-title {
          font-size: clamp(1.25rem, 3vw, 1.75rem);
          font-weight: 700; color: var(--color-blue-dark);
          margin: 0; display: flex; align-items: center; gap: 10px;
        }

        /* ── Prose card ── */
        .ad-prose-card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); padding: 28px 32px;
        }
        .ad-prose {
          font-size: var(--text-md); color: var(--color-text-secondary);
          line-height: 1.8; margin: 0; white-space: pre-line;
        }

        /* ── Generic card ── */
        .ad-card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); padding: 20px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .ad-card--flex { display: flex; flex-direction: column; }
        .ad-card--link {
          text-decoration: none;
          transition: border-color 150ms ease-out, box-shadow 150ms ease-out, transform 150ms ease-out;
        }
        .ad-card--link:hover {
          border-color: var(--color-blue);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .ad-card--link:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }

        .ad-card__heading {
          font-size: var(--text-md); font-weight: 700;
          color: var(--color-blue-dark); margin: 0; line-height: 1.3;
        }
        .ad-card__heading--link { transition: color 150ms ease-out; }
        .ad-card--link:hover .ad-card__heading--link { color: var(--color-green); }

        .ad-card__body {
          font-size: var(--text-sm); color: var(--color-text-secondary);
          line-height: 1.65; margin: 0;
        }
        .ad-card__body--grow { flex: 1; }
        .ad-card__body--clamp {
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .ad-card__meta {
          display: flex; align-items: center; gap: 5px;
          font-size: var(--text-xs); color: var(--color-text-muted); margin: 0;
        }

        /* ── 2-col grid ── */
        .ad-grid-2 {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;
        }

        /* ── Achievement timeline ── */
        .ad-timeline { position: relative; display: flex; flex-direction: column; gap: 16px; }
        .ad-timeline::before {
          content: ""; position: absolute; left: 20px; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #D97706, var(--color-green), rgba(30,64,175,0.2));
        }
        .ad-timeline__item {
          position: relative; display: flex; align-items: flex-start;
          gap: 16px; padding-left: 52px;
        }
        .ad-timeline__dot {
          position: absolute; left: 9px; top: 16px;
          width: 24px; height: 24px; border-radius: 50%;
          background: #D97706; border: 3px solid #fff;
          box-shadow: 0 0 0 1px #D97706;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; z-index: 1;
        }
        .ad-timeline__dot span { font-size: 9px; font-weight: 700; color: #fff; }
        .ad-timeline__card { flex: 1; }

        .ad-achievement-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
        }
        .ad-meta-date {
          font-size: var(--text-xs); color: var(--color-text-muted); white-space: nowrap;
        }

        /* ── Project cards ── */
        .ad-project-top {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
        }
        .ad-status-pill {
          display: inline-flex; align-items: center;
          padding: 2px 8px; border-radius: var(--radius-pill);
          font-size: 11px; font-weight: 600; white-space: nowrap; flex-shrink: 0;
        }
        .ad-ext-link {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: var(--text-sm); font-weight: 600;
          color: var(--color-green); text-decoration: none;
          margin-top: 4px; transition: color 150ms ease-out;
        }
        .ad-ext-link:hover { color: #047857; text-decoration: underline; }

        /* ── Exec grid ── */
        .ad-exec-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
        }
        .ad-exec-card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); padding: 20px 14px;
          text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .ad-exec-photo {
          width: 80px; height: 80px; border-radius: 50%; object-fit: cover;
          border: 3px solid #D97706; display: block;
        }
        .ad-exec-photo--fallback {
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, var(--color-blue-dark), var(--color-green));
          color: #fff; font-size: 1.75rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .ad-exec-name { font-size: var(--text-sm); font-weight: 700; color: var(--color-blue-dark); margin: 0; }
        .ad-exec-pos  { font-size: 12px; font-weight: 600; color: var(--color-green); margin: 0; }
        .ad-exec-level{ font-size: 11px; color: var(--color-text-muted); margin: 0; }

        /* ── Event specifics ── */
        .ad-event-date {
          font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
          text-transform: uppercase; color: var(--color-green); margin: 0;
        }

        /* ── Gallery grid ── */
        .ad-gallery-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
        }
        .ad-gallery-item {
          aspect-ratio: 1; border-radius: var(--radius-md); overflow: hidden;
          background: var(--color-bg-alt);
        }
        .ad-gallery-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 300ms ease-out;
        }
        .ad-gallery-item:hover .ad-gallery-img { transform: scale(1.06); }

        /* ── Legacy note ── */
        .ad-legacy {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #12245F 0%, var(--color-blue) 60%, #0D9488 100%);
          border-radius: var(--radius-xl); padding: 40px 36px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .ad-legacy__bg {
          position: absolute; top: -60px; right: -60px;
          width: 240px; height: 240px; border-radius: 50%;
          background: rgba(217,119,6,0.25); filter: blur(50px);
          pointer-events: none;
        }
        .ad-legacy__icon { color: rgba(252,211,77,0.35); }
        .ad-legacy__text {
          font-size: var(--text-md); color: rgba(255,255,255,0.92);
          line-height: 1.8; margin: 0; white-space: pre-line;
          position: relative; z-index: 1;
        }

        /* ── Prev/Next nav ── */
        .ad-nav-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
          padding-top: 24px; border-top: 1px solid var(--color-border);
        }
        .ad-nav-card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); padding: 16px 20px;
          text-decoration: none;
          display: flex; flex-direction: column; gap: 4px;
          transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
        }
        .ad-nav-card:hover { border-color: var(--color-blue); box-shadow: var(--shadow-md); }
        .ad-nav-card:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }
        .ad-nav-card--right { text-align: right; }
        .ad-nav-card__label {
          display: flex; align-items: center; gap: 4px;
          font-size: var(--text-xs); color: var(--color-text-muted); margin: 0;
        }
        .ad-nav-card__name {
          font-size: var(--text-base); font-weight: 700;
          color: var(--color-blue-dark); margin: 0;
          transition: color 150ms ease-out;
        }
        .ad-nav-card:hover .ad-nav-card__name { color: var(--color-green); }
        .ad-nav-card__session {
          font-size: var(--text-xs); color: var(--color-text-muted);
          font-family: monospace; margin: 0;
        }

        /* ── Tablet: adjust grids ── */
        @media (max-width: 1023px) {
          .ad-exec-grid { grid-template-columns: repeat(3, 1fr); }
          .ad-gallery-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .ad-grid-2 { grid-template-columns: 1fr; }
          .ad-exec-grid { grid-template-columns: repeat(2, 1fr); }
          .ad-gallery-grid { grid-template-columns: repeat(2, 1fr); }
          .ad-prose-card { padding: 20px; }
          .ad-legacy { padding: 28px 24px; }
        }

        /* ── Mobile ── */
        @media (max-width: 639px) {
          .ad-hero__content { padding-inline: 16px; }
          .ad-page { padding-inline: 16px; }
          .ad-body { padding-top: 32px; gap: 40px; }
          .ad-exec-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .ad-gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .ad-nav-row { grid-template-columns: 1fr; }
          .ad-nav-card--right { text-align: left; }
          .ad-nav-card--right .ad-nav-card__label { justify-content: flex-start; }
          .ad-legacy { padding: 24px 20px; }
          .ad-timeline::before { left: 14px; }
          .ad-timeline__item { padding-left: 42px; }
          .ad-timeline__dot  { left: 3px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ad-card--link, .ad-nav-card, .ad-gallery-img,
          .ad-back, .ad-ext-link { transition: none; }
        }
      `}</style>
    </>
  );
}
