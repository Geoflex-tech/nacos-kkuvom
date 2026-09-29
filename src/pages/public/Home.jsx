import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, Calendar, Award, BookOpen,
  ArrowRight, MapPin, Clock, User,
} from "lucide-react";
import Hero from "../../components/Hero";
import { SectionHeader, Card } from "../../components/ui";
import { supabase } from "../../lib/supabase";
import { useLeadership } from "../../hooks/useLeadership";
import { useCallback } from "react";
import BioDialog from "../../components/BioDialog";
import LeadershipCard from "../../components/LeadershipCard";

/* ── Vacant box — used for unfilled positions ─────────────── */
function VacantBox({ position }) {
  return (
    <article
      aria-label={`${position}, coming soon`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px 14px",
        border: "1px dashed #C3CCE0",
        borderRadius: "12px",
        background: "transparent",
        height: "100%",
        minHeight: "160px",
        boxSizing: "border-box",
      }}
    >
      {/* Icon */}
      <div
        aria-hidden="true"
        style={{
          width: "52px", height: "52px",
          borderRadius: "50%",
          background: "#EEF3FB",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "12px",
          flexShrink: 0,
        }}
      >
        <User size={22} color="#94A3B8" strokeWidth={1.5} aria-hidden="true" />
      </div>

      {/* Position title */}
      <p style={{
        fontSize: "13px",
        fontWeight: 500,
        color: "#64748B",
        lineHeight: 1.4,
        margin: "0 0 10px",
      }}>
        {position}
      </p>

      {/* Coming soon pill */}
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: "9999px",
        background: "#FEF3C7",
        color: "#B45309",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.3px",
        whiteSpace: "nowrap",
      }}>
        Coming soon
      </span>
    </article>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Home() {
  const [news, setNews]       = useState([]);
  const [events, setEvents]   = useState([]);
  const [gallery, setGallery] = useState([]);
  const [stats, setStats]     = useState({ members: 0, events: 0, certificates: 0, resources: 0 });

  /* Leadership — live from DB, no hardcoded names */
  const { leaders, filled, loading: leaderLoading } = useLeadership();
  const [activeBio, setActiveBio] = useState(null);
  const [bioTrigger, setBioTrigger] = useState(null);

  const openBio = useCallback((leader, btnRef) => {
    setActiveBio(leader);
    setBioTrigger(btnRef);
  }, []);
  const closeBio = useCallback(() => { setActiveBio(null); }, []);

  useEffect(() => {
    (async () => {
      const [newsRes, eventsRes, membersRes, certsRes, resourcesRes, galleryRes] =
        await Promise.all([
          supabase.from("news").select("*").order("published_at", { ascending: false }).limit(3),
          supabase.from("events").select("*").gte("event_date", new Date().toISOString()).order("event_date", { ascending: true }).limit(3),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("certificates").select("*", { count: "exact", head: true }),
          supabase.from("tech_hub_resources").select("*", { count: "exact", head: true }),
          supabase.from("gallery").select("id,image_url,caption").order("uploaded_at", { ascending: false }).limit(6),
        ]);
      setNews(newsRes.data || []);
      setEvents(eventsRes.data || []);
      setGallery(galleryRes.data || []);
      setStats({
        members:      membersRes.count     || 0,
        events:       eventsRes.data?.length || 0,
        certificates: certsRes.count       || 0,
        resources:    resourcesRes.count   || 0,
      });
    })();
  }, []);

  /*
    Home leadership preview — first 4 executive positions by rank.
    Show filled cards for any that are filled, vacant boxes for the rest.
    Total is always exactly 4.
  */
  const PREVIEW_RANKS = [1, 2, 3, 4]; // President, VP, Sec-Gen, Asst Sec-Gen
  const previewSlots = PREVIEW_RANKS.map((rank) =>
    leaders.find((l) => l.rank === rank) || null
  );

  return (
    <>
      <Hero stats={{
        news:      news.length      || null,
        events:    stats.events     || null,
        resources: stats.resources  || null,
        members:   stats.members    || null,
      }} />

      {/* ── Stats Band ────────────────────────────────────── */}
      <section style={{ background: "var(--color-bg-alt)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container section-pad">
          <dl style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--space-4)" }} className="stats-grid">
            {[
              { label: "Members",        value: stats.members,      Icon: Users,    accent: "var(--color-blue)",   bg: "var(--color-blue-light)"   },
              { label: "Events",         value: stats.events,       Icon: Calendar, accent: "var(--color-green)",  bg: "var(--color-green-light)"  },
              { label: "Certificates",   value: stats.certificates, Icon: Award,    accent: "var(--color-yellow)", bg: "var(--color-yellow-light)" },
              { label: "Tech Resources", value: stats.resources,    Icon: BookOpen, accent: "var(--color-blue)",   bg: "var(--color-blue-light)"   },
            ].map(({ label, value, Icon, accent, bg }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "3rem", height: "3rem", borderRadius: "var(--radius-sm)", background: bg, marginBottom: "var(--space-1)" }}>
                  <Icon size={20} color={accent} />
                </div>
                <dt style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: "var(--weight-bold)", color: "var(--color-blue-dark)", lineHeight: 1.1 }}>
                  {value}
                </dt>
                <dd style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.25rem" }}>
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <style>{`@media(max-width:640px){.stats-grid{grid-template-columns:repeat(2,1fr)!important;}}
          @media(max-width:360px){.stats-grid{grid-template-columns:1fr!important;}}
        `}</style>
      </section>

      {/* ── Leadership — Meet the Pioneer Team ───────────── */}
      <section style={{ background: "var(--color-bg-alt)" }} aria-labelledby="home-leadership-heading">
        <div className="container section-pad">
          {/* header row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "var(--space-4)", flexWrap: "wrap", gap: "var(--space-2)" }}>
            <SectionHeader eyebrow="Leadership" heading="Meet the Pioneer Team" />
            <Link to="/leadership" className="btn btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
              aria-label="View all leadership positions">
              View all <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* skeleton while loading */}
          {leaderLoading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }} className="home-lc-grid" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ height: "160px", borderRadius: "12px", background: "linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%)", backgroundSize: "200% 100%", animation: "home-shimmer 1.4s infinite" }} />
              ))}
            </div>
          )}

          {/* 4 slots: filled card or vacant box */}
          {!leaderLoading && (
            <ul style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", listStyle: "none", margin: 0, padding: 0 }}
              className="home-lc-grid" role="list">
              {previewSlots.map((leader, i) => (
                <li key={leader?.id || `vacant-preview-${i}`} style={{ display: "flex", flexDirection: "column" }}>
                  {leader && leader.status === "filled" && leader.name
                    ? <LeadershipCard leader={leader} onReadBio={openBio} />
                    : <VacantBox position={leader?.position || ["President", "Vice President", "Secretary-General", "Assistant Secretary-General"][i]} />
                  }
                </li>
              ))}
            </ul>
          )}
        </div>

        <style>{`
          @media(max-width:1023px){ .home-lc-grid{ grid-template-columns:repeat(2,1fr)!important; } }
          @media(max-width:479px){  .home-lc-grid{ grid-template-columns:repeat(2,1fr)!important; gap:10px!important; } }
          @media(max-width:360px){  .home-lc-grid{ grid-template-columns:1fr!important; } }
          @keyframes home-shimmer{ from{background-position:200% 0} to{background-position:-200% 0} }
          @media(prefers-reduced-motion:reduce){ .home-lc-grid div[style*="animation"]{ animation:none!important; background:#E2E8F0!important; } }
        `}</style>
      </section>

      {/* Bio dialog — only reachable when a position is filled */}
      <BioDialog leader={activeBio} triggerRef={bioTrigger} onClose={closeBio} />

      {/* ── News + Events ─────────────────────────────────── */}
      <section style={{ background: "var(--color-bg)" }}>
        <div className="container section-pad">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }} className="news-events-grid">

            {/* News */}
            <div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
                <SectionHeader eyebrow="Latest Updates" heading="News" />
                <Link to="/news" className="btn btn-ghost" style={{ fontSize: "var(--text-sm)" }}>All news →</Link>
              </div>
              {news.length === 0 ? (
                <Card style={{ padding: "var(--space-4)", textAlign: "center" }}>
                  <p style={{ color: "var(--color-text-muted)" }}>No news yet.</p>
                </Card>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }} role="list">
                  {news.map((n) => (
                    <li key={n.id}>
                      <Link to={`/news/${n.slug}`} style={{ display: "block", textDecoration: "none" }}>
                        <Card as="article" style={{ padding: "var(--space-3)" }}>
                          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "0.375rem" }}>
                            {new Date(n.published_at).toDateString()}{n.author && ` · ${n.author}`}
                          </p>
                          <h3 style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-semibold)", color: "var(--color-blue-dark)", lineHeight: 1.4 }}>{n.title}</h3>
                          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "0.375rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{n.body}</p>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "var(--text-xs)", color: "var(--color-green)", fontWeight: "var(--weight-semibold)", marginTop: "0.5rem" }}>
                            Read more <ArrowRight size={12} aria-hidden="true" />
                          </span>
                        </Card>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Events */}
            <div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
                <SectionHeader eyebrow="What's Coming" heading="Events" />
                <Link to="/events" className="btn btn-ghost" style={{ fontSize: "var(--text-sm)" }}>All events →</Link>
              </div>
              {events.length === 0 ? (
                <Card style={{ padding: "var(--space-4)", textAlign: "center" }}>
                  <p style={{ color: "var(--color-text-muted)" }}>No upcoming events.</p>
                </Card>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }} role="list">
                  {events.map((e) => {
                    const d = new Date(e.event_date);
                    return (
                      <li key={e.id}>
                        <Card as="article" style={{ padding: "var(--space-3)", display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
                          <div aria-hidden="true" style={{ flexShrink: 0, width: "3.5rem", textAlign: "center", background: "var(--color-blue)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                            <div style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.06em", padding: "0.2rem 0", color: "rgba(255,255,255,0.75)", background: "var(--color-blue-dark)" }}>
                              {d.toLocaleString("default", { month: "short" })}
                            </div>
                            <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "#fff", padding: "0.25rem 0" }}>
                              {d.getDate()}
                            </div>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-semibold)", color: "var(--color-blue-dark)", lineHeight: 1.4 }}>{e.title}</h3>
                            <p style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                              <Clock size={12} aria-hidden="true" />
                              {d.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            {e.location && (
                              <p style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>
                                <MapPin size={12} aria-hidden="true" /> {e.location}
                              </p>
                            )}
                          </div>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.news-events-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── Tech Hub Teaser ───────────────────────────────── */}
      <section style={{ background: "var(--color-bg-alt)" }}>
        <div className="container section-pad">
          <div style={{ background: "linear-gradient(135deg, var(--color-blue-dark) 0%, var(--color-blue) 60%, #0D9488 100%)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)", position: "relative", overflow: "hidden" }}>
            <div aria-hidden="true" style={{ position: "absolute", top: "-3rem", right: "-3rem", width: "12rem", height: "12rem", borderRadius: "50%", background: "rgba(217,119,6,0.25)", filter: "blur(40px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--space-4)", alignItems: "center" }} className="techhub-layout">
              <div>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", textTransform: "uppercase", letterSpacing: "0.1em", color: "#FCD34D" }}>Learn Free</span>
                <h2 style={{ fontSize: "clamp(1.25rem,3vw,2rem)", fontWeight: "var(--weight-bold)", color: "#fff", marginTop: "0.25rem", marginBottom: "0.75rem" }}>
                  {stats.resources}+ curated resources, handpicked for computing students
                </h2>
                <p style={{ fontSize: "var(--text-base)", color: "rgba(255,255,255,0.82)", maxWidth: "52ch" }}>
                  From freeCodeCamp to fast.ai — the best free courses, books, and tools organized by category and skill level.
                </p>
              </div>
              <div>
                <Link to="/tech-hub"
                  className="techhub-cta-btn"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "var(--radius-pill)", background: "#FCD34D", color: "var(--color-blue-dark)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-base)", whiteSpace: "nowrap", textDecoration: "none" }}
                >
                  Explore Tech Hub <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:640px){
          .techhub-layout{grid-template-columns:1fr!important;}
          .techhub-layout > div:last-child { width: 100%; }
          .techhub-layout a { width: 100%; justify-content: center; }
        }
        @media(hover:hover){.techhub-cta-btn:hover{transform:translateY(-2px);}}
        .techhub-cta-btn{transition:transform 150ms ease-out;}
        @media(prefers-reduced-motion:reduce){.techhub-cta-btn{transition:none!important;transform:none!important;}}
        `}</style>
      </section>

      {/* ── Gallery Preview ───────────────────────────────── */}
      <section style={{ background: "var(--color-bg)" }} aria-labelledby="home-gallery-heading">
        <div className="container section-pad">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "var(--space-4)", flexWrap: "wrap", gap: "var(--space-2)" }}>
            <SectionHeader eyebrow="Moments" heading="Gallery" />
            <Link to="/gallery" className="btn btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              View all <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {gallery.length === 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }} className="gallery-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: "1", borderRadius: "12px", background: "#EEF3FB", display: "flex", alignItems: "center", justifyContent: "center" }} aria-hidden="true">
                  <span style={{ fontSize: "1.5rem", opacity: 0.25 }}>📷</span>
                </div>
              ))}
            </div>
          ) : (
            <ul style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", listStyle: "none", margin: 0, padding: 0 }}
              className="gallery-grid" role="list">
              {gallery.map((img) => (
                <li key={img.id}>
                  <Link to="/gallery" style={{ display: "block", textDecoration: "none" }}>
                    <div style={{ aspectRatio: "1", borderRadius: "12px", overflow: "hidden", position: "relative", background: "#EEF3FB" }}>
                      <img
                        src={img.image_url}
                        alt={img.caption || "Gallery photo"}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        className="home-gallery-img"
                      />
                      {img.caption && (
                        <div style={{ position: "absolute", inset: "auto 0 0 0", background: "linear-gradient(to top,rgba(0,0,0,0.65),transparent)", padding: "20px 10px 8px", pointerEvents: "none" }}>
                          <p style={{ margin: 0, fontSize: "11px", color: "#fff", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {img.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div style={{ textAlign: "center", marginTop: "var(--space-4)" }}>
            <Link to="/gallery" className="btn btn-secondary">
              See all photos <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <style>{`
          @media(max-width:639px){ .gallery-grid{ grid-template-columns:repeat(2,1fr)!important; } }
          @media (hover: hover) { .home-gallery-img:hover { transform: scale(1.06); } }
          .home-gallery-img { transition: transform 300ms ease-out; }
          @media(prefers-reduced-motion:reduce){ .gallery-grid img, .home-gallery-img{ transition:none!important; transform:none!important; } }
        `}</style>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section style={{ background: "var(--color-bg)" }}>
        <div className="container section-pad" style={{ textAlign: "center" }}>
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <SectionHeader
              eyebrow="Get Started"
              heading="Ready to be part of the foundation?"
              sub="Join NACOS KKU VOM Chapter today. Free registration, real resources, and a community of computing students building the future."
              center
            />
            <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center", flexWrap: "wrap", marginTop: "var(--space-4)" }}>
              <Link to="/register" className="btn btn-primary">Create Account</Link>
              <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
