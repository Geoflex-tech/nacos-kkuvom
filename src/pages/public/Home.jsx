import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, Calendar, Award, BookOpen,
  ArrowRight, MapPin, Clock,
} from "lucide-react";
import Hero from "../../components/Hero";
import { SectionHeader, Card } from "../../components/ui";
import { supabase } from "../../lib/supabase";
import LeadershipCard from "../../components/LeadershipCard";
import BioDialog from "../../components/BioDialog";
import { useLeadership } from "../../hooks/useLeadership";
import { useCallback, useRef } from "react";

export default function Home() {
  const [news, setNews]           = useState([]);
  const [events, setEvents]       = useState([]);
  const [president, setPresident] = useState(null);
  const [gallery, setGallery]     = useState([]);
  const [stats, setStats]         = useState({ members: 0, events: 0, certificates: 0, resources: 0 });

  // Leadership data — live from DB
  const { filled, vacant, total, loading: leaderLoading } = useLeadership();
  const [activeBio, setActiveBio]   = useState(null);
  const [bioTrigger, setBioTrigger] = useState(null);

  const openBio = useCallback((leader, btnRef) => {
    setActiveBio(leader);
    setBioTrigger(btnRef);
  }, []);
  const closeBio = useCallback(() => {
    setActiveBio(null);
  }, []);

  useEffect(() => {
    (async () => {
      const [newsRes, eventsRes, membersRes, certsRes, resourcesRes, presidentRes, galleryRes] =
        await Promise.all([
          supabase.from("news").select("*").order("published_at", { ascending: false }).limit(3),
          supabase.from("events").select("*").gte("event_date", new Date().toISOString()).order("event_date", { ascending: true }).limit(3),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("certificates").select("*", { count: "exact", head: true }),
          supabase.from("tech_hub_resources").select("*", { count: "exact", head: true }),
          supabase.from("executives").select("*").or("position.ilike.%president%,position.ilike.%President%").eq("status","filled").order("rank").limit(1),
          supabase.from("gallery").select("id,image_url,caption").order("uploaded_at", { ascending: false }).limit(6),
        ]);
      setNews(newsRes.data || []);
      setEvents(eventsRes.data || []);
      setPresident(presidentRes.data?.[0] || null);
      setGallery(galleryRes.data || []);
      setStats({
        members:      membersRes.count  || 0,
        events:       eventsRes.data?.length || 0,
        certificates: certsRes.count    || 0,
        resources:    resourcesRes.count || 0,
      });
    })();
  }, []);

  const presidentName     = president?.name     || "Ezekiel Geoffrey Izam";
  const presidentPosition = president?.position
    ? `${president.position}, NACOS KKU VOM Chapter`
    : "Acting President, NACOS KKU VOM Chapter";

  return (
    <>
      <Hero />

      {/* ── Stats Band ────────────────────────────────────── */}
      <section style={{ background: "var(--color-bg-alt)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container section-pad">
          <dl style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--space-4)" }} className="stats-grid">
            {[
              { label: "Members",        value: stats.members,      Icon: Users,    accent: "var(--color-blue)",   bg: "var(--color-blue-light)"         },
              { label: "Events",         value: stats.events,       Icon: Calendar, accent: "var(--color-green)",  bg: "var(--color-green-light)"        },
              { label: "Certificates",   value: stats.certificates, Icon: Award,    accent: "var(--color-yellow)", bg: "var(--color-yellow-light)"       },
              { label: "Tech Resources", value: stats.resources,    Icon: BookOpen, accent: "var(--color-blue)",   bg: "var(--color-blue-light)"         },
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
        <style>{`@media(max-width:640px){.stats-grid{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
      </section>

      {/* ── President's Welcome ───────────────────────────── */}
      <section style={{ background: "var(--color-bg)" }}>
        <div className="container section-pad">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <SectionHeader eyebrow="A Message from the President" heading="Built for the next generation" center />
            <Card style={{ marginTop: "var(--space-4)", padding: "var(--space-4)" }}>
              <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }} className="president-layout">
                <div style={{ flexShrink: 0 }}>
                  {president?.image_url ? (
                    <img src={president.image_url} alt={presidentName} loading="lazy"
                      style={{ width: "6rem", height: "6rem", borderRadius: "50%", objectFit: "cover", border: "3px solid var(--color-yellow)" }} />
                  ) : (
                    <div style={{ width: "6rem", height: "6rem", borderRadius: "50%", background: "var(--color-blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", border: "3px solid var(--color-yellow)" }}>
                      {presidentName[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  {[
                    "Welcome to the official digital home of NACOS KKU VOM Chapter. Whether you're a current student, a prospective member, an alumnus, or a friend of the chapter — you are welcome here.",
                    "As the pioneer administration, we are not just building a website. We are laying the digital foundation that every future generation of this chapter will stand on.",
                    "I invite you to join us. Register as a member, attend our events, use our resources, and be part of building something that lasts.",
                  ].map((para, i) => (
                    <p key={i} style={{ fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-2)" }}>
                      {para}
                    </p>
                  ))}
                  <p style={{ fontWeight: "var(--weight-semibold)", color: "var(--color-blue-dark)" }}>{presidentName}</p>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{presidentPosition}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <style>{`@media(max-width:640px){.president-layout{flex-direction:column!important;align-items:center!important;}}`}</style>
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

          {/* filled cards */}
          {!leaderLoading && filled.length > 0 && (
            <ul style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", listStyle: "none", margin: 0, padding: 0 }}
              className="home-lc-grid" role="list">
              {filled.map((leader) => (
                <li key={leader.id} style={{ display: "flex", flexDirection: "column" }}>
                  <LeadershipCard leader={leader} onReadBio={openBio} />
                </li>
              ))}

              {/* summary vacant card */}
              {vacant.length > 0 && (
                <li style={{ display: "flex", flexDirection: "column" }}>
                  <Link
                    to="/leadership"
                    style={{ textDecoration: "none", display: "flex", flex: 1 }}
                    aria-label={`${vacant.length} more positions coming soon — view all`}
                  >
                    <article className="home-vacant-summary">
                      <span className="home-vacant-count">{vacant.length}</span>
                      <p className="home-vacant-label">more positions<br />coming soon</p>
                      <span className="lc-coming-soon" style={{ marginTop: "auto" }}>View all →</span>
                    </article>
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>

        <style>{`
          @media(max-width:1023px){ .home-lc-grid{ grid-template-columns:repeat(3,1fr)!important; } }
          @media(max-width:639px){  .home-lc-grid{ grid-template-columns:repeat(2,1fr)!important; gap:10px!important; } }
          @keyframes home-shimmer{ from{background-position:200% 0} to{background-position:-200% 0} }
          @media(prefers-reduced-motion:reduce){ .home-lc-grid [style*="animation"]{ animation:none!important; } }

          .home-vacant-summary {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            border-radius: 12px;
            border: 1px dashed #C3CCE0;
            padding: 20px 14px;
            flex: 1;
            transition: border-color 150ms ease-out, background 150ms ease-out;
          }
          .home-vacant-summary:hover {
            border-color: #1E40AF;
            background: rgba(30,64,175,0.03);
          }
          .home-vacant-count {
            font-size: 2rem;
            font-weight: 700;
            color: #1E40AF;
            line-height: 1;
          }
          .home-vacant-label {
            font-size: 12px;
            color: #94A3B8;
            margin: 6px 0 10px;
            line-height: 1.4;
          }
          /* pill reuse from LeadershipCard */
          .lc-coming-soon {
            display: inline-flex;
            align-items: center;
            padding: 3px 10px;
            border-radius: 999px;
            background: #FEF3C7;
            color: #B45309;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.3px;
            white-space: nowrap;
          }
        `}</style>
      </section>

      {/* Bio dialog (home page) */}
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
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "var(--radius-pill)", background: "#FCD34D", color: "var(--color-blue-dark)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-base)", whiteSpace: "nowrap", transition: "transform 150ms ease-out", textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
                >
                  Explore Tech Hub <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:640px){.techhub-layout{grid-template-columns:1fr!important;}}`}</style>
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
            /* placeholder grid when no photos yet */
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
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 300ms ease-out" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
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
          @media(prefers-reduced-motion:reduce){ .gallery-grid img{ transition:none!important; } }
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
