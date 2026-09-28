import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
  FolderKanban,
  ExternalLink,
  Quote,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const STATUS_COLORS = {
  planned: "bg-gray-100 text-gray-600",
  "in-progress": "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  archived: "bg-gray-200 text-gray-500",
};

export default function AdministrationDetail() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [executives, setExecutives] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [nextAdmin, setNextAdmin] = useState(null);
  const [prevAdmin, setPrevAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: a } = await supabase
        .from("administrations")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!a) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setAdmin(a);

      const [execsRes, eventsRes, newsRes, galleryRes, othersRes] =
        await Promise.all([
          supabase
            .from("executives")
            .select("*")
            .eq("administration_id", id)
            .order("order_index"),
          supabase
            .from("events")
            .select("*")
            .eq("administration_id", id)
            .order("event_date", { ascending: false }),
          supabase
            .from("news")
            .select("*")
            .eq("administration_id", id)
            .order("published_at", { ascending: false }),
          supabase
            .from("gallery")
            .select("*")
            .eq("administration_id", id)
            .order("uploaded_at", { ascending: false }),
          supabase
            .from("administrations")
            .select("id, session_label, administration_name, start_date")
            .order("start_date", { ascending: true }),
        ]);

      setExecutives(execsRes.data || []);
      setEvents(eventsRes.data || []);
      setNews(newsRes.data || []);
      setGallery(galleryRes.data || []);

      const sorted = othersRes.data || [];
      const idx = sorted.findIndex((x) => x.id === id);
      if (idx > 0) setPrevAdmin(sorted[idx - 1]);
      if (idx >= 0 && idx < sorted.length - 1) setNextAdmin(sorted[idx + 1]);

      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading administration...
      </div>
    );
  }

  if (notFound) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-nacos-blue mb-4">
          Not found
        </h1>
        <p className="text-gray-500 mb-6">
          This administration record doesn't exist.
        </p>
        <Link to="/history" className="btn-primary inline-block">
          Back to History
        </Link>
      </section>
    );
  }

  const achievements = Array.isArray(admin.achievements)
    ? admin.achievements
    : [];
  const projects = Array.isArray(admin.projects) ? admin.projects : [];

  return (
    <>
      {/* Hero with cover image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-nacos-blue via-nacos-blue-dark to-nacos-green">
        {admin.cover_image && (
          <div className="absolute inset-0">
            <img
              src={admin.cover_image}
              alt=""
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-nacos-blue/80 via-nacos-blue-dark/80 to-nacos-green/80" />
          </div>
        )}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-nacos-gold/10 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-nacos-green-light/20 blur-3xl animate-float" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-20 text-white">
          <Link
            to="/history"
            className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-nacos-gold transition mb-6"
          >
            <ArrowLeft size={14} />
            Back to History
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="badge bg-white/15 backdrop-blur text-white font-mono border border-white/20">
              {admin.session_label}
            </span>
            {admin.is_current && (
              <span className="badge bg-nacos-gold text-nacos-blue font-bold">
                ★ CURRENT
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight">
            {admin.administration_name}
          </h1>

          {admin.motto && (
            <p className="text-white/90 italic text-lg md:text-xl max-w-3xl">
              "{admin.motto}"
            </p>
          )}

          {(admin.start_date || admin.end_date) && (
            <p className="text-white/70 text-sm mt-4">
              {admin.start_date &&
                new Date(admin.start_date).toLocaleDateString("default", {
                  month: "long",
                  year: "numeric",
                })}
              {admin.end_date &&
                ` — ${new Date(admin.end_date).toLocaleDateString("default", {
                  month: "long",
                  year: "numeric",
                })}`}
            </p>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 space-y-14">
        {/* About */}
        {admin.description && (
          <div>
            <p className="section-eyebrow">About</p>
            <h2 className="section-title text-2xl md:text-3xl mb-4">
              About This Administration
            </h2>
            <div className="card-flat p-6 md:p-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base md:text-lg">
                {admin.description}
              </p>
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <p className="section-eyebrow">Milestones</p>
            <h2 className="section-title text-2xl md:text-3xl mb-6 flex items-center gap-3">
              <Trophy size={24} className="text-nacos-gold" />
              Achievements
            </h2>

            <div className="relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-nacos-gold via-nacos-green to-nacos-blue/20" />
              <div className="space-y-4">
                {achievements.map((a, i) => (
                  <div key={i} className="relative pl-14">
                    <div className="absolute left-1.5 top-4 h-6 w-6 rounded-full bg-nacos-gold border-4 border-white shadow-md flex items-center justify-center">
                      <span className="text-nacos-blue text-[10px] font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <div className="card p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <h3 className="font-bold text-nacos-blue text-lg">
                          {a.title}
                        </h3>
                        {a.date && (
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(a.date).toLocaleDateString("default", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      {a.description && (
                        <p className="text-gray-600 mt-2 leading-relaxed">
                          {a.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <p className="section-eyebrow">Initiatives</p>
            <h2 className="section-title text-2xl md:text-3xl mb-6 flex items-center gap-3">
              <FolderKanban size={24} className="text-nacos-green" />
              Projects
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((p, i) => (
                <div key={i} className="card p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-nacos-blue text-lg leading-tight">
                      {p.name}
                    </h3>
                    {p.status && (
                      <span
                        className={`badge shrink-0 ${
                          STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    )}
                  </div>
                  {p.description && (
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">
                      {p.description}
                    </p>
                  )}
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-nacos-green font-semibold text-sm mt-4 hover:underline"
                    >
                      View project <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Executives */}
        {executives.length > 0 && (
          <div>
            <p className="section-eyebrow">Leadership</p>
            <h2 className="section-title text-2xl md:text-3xl mb-6 flex items-center gap-3">
              <Users size={24} className="text-nacos-blue" />
              Executives
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {executives.map((e) => (
                <div key={e.id} className="card p-5 text-center">
                  {e.image_url ? (
                    <img
                      src={e.image_url}
                      alt={e.name}
                      className="h-24 w-24 mx-auto rounded-full object-cover border-4 border-nacos-gold"
                    />
                  ) : (
                    <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-nacos-blue to-nacos-green text-white flex items-center justify-center text-3xl font-bold border-4 border-nacos-gold">
                      {e.name?.[0] || "?"}
                    </div>
                  )}
                  <h3 className="mt-3 font-bold text-nacos-blue text-sm leading-tight">
                    {e.name}
                  </h3>
                  <p className="text-xs text-nacos-green font-semibold mt-1">
                    {e.position}
                  </p>
                  {e.level && (
                    <p className="text-xs text-gray-400 mt-0.5">{e.level}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {events.length > 0 && (
          <div>
            <p className="section-eyebrow">Activities</p>
            <h2 className="section-title text-2xl md:text-3xl mb-6 flex items-center gap-3">
              <Calendar size={24} className="text-nacos-blue" />
              Events
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {events.map((e) => (
                <div key={e.id} className="card p-5">
                  {e.event_date && (
                    <p className="text-xs text-nacos-green font-bold uppercase tracking-wide mb-2">
                      {new Date(e.event_date).toDateString()}
                    </p>
                  )}
                  <h3 className="font-bold text-nacos-blue">{e.title}</h3>
                  {e.location && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin size={11} /> {e.location}
                    </p>
                  )}
                  {e.description && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                      {e.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News */}
        {news.length > 0 && (
          <div>
            <p className="section-eyebrow">Updates</p>
            <h2 className="section-title text-2xl md:text-3xl mb-6">
              News & Posts
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {news.map((n) => (
                <Link
                  key={n.id}
                  to={`/news/${n.slug}`}
                  className="card p-5 block group"
                >
                  <h3 className="font-semibold text-nacos-blue group-hover:text-nacos-green transition">
                    {n.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(n.published_at).toDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {n.body}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <div>
            <p className="section-eyebrow">Moments</p>
            <h2 className="section-title text-2xl md:text-3xl mb-6">
              Gallery
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.slice(0, 8).map((g) => (
                <div
                  key={g.id}
                  className="relative overflow-hidden rounded-xl aspect-square"
                >
                  <img
                    src={g.image_url}
                    alt={g.caption || ""}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legacy note */}
        {admin.legacy_note && (
          <div>
            <p className="section-eyebrow">Handover</p>
            <h2 className="section-title text-2xl md:text-3xl mb-6 flex items-center gap-3">
              <Quote size={24} className="text-nacos-gold" />
              Legacy Note
            </h2>

            <div className="relative bg-gradient-to-br from-nacos-blue via-nacos-blue-dark to-nacos-green text-white rounded-3xl p-8 md:p-10 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-nacos-gold/20 blur-3xl" />
              <Quote
                size={48}
                className="text-nacos-gold/40 mb-4"
              />
              <p className="text-white/95 leading-relaxed whitespace-pre-line text-base md:text-lg relative">
                {admin.legacy_note}
              </p>
            </div>
          </div>
        )}

        {/* Prev / Next navigation */}
        {(prevAdmin || nextAdmin) && (
          <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t">
            {prevAdmin ? (
              <Link
                to={`/history/${prevAdmin.id}`}
                className="card p-5 group hover:border-nacos-blue/30"
              >
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <ArrowLeft size={12} /> Previous administration
                </p>
                <p className="font-bold text-nacos-blue group-hover:text-nacos-green transition">
                  {prevAdmin.administration_name}
                </p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {prevAdmin.session_label}
                </p>
              </Link>
            ) : (
              <div />
            )}

            {nextAdmin && (
              <Link
                to={`/history/${nextAdmin.id}`}
                className="card p-5 group hover:border-nacos-blue/30 text-right"
              >
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1 justify-end">
                  Next administration <ArrowRight size={12} />
                </p>
                <p className="font-bold text-nacos-blue group-hover:text-nacos-green transition">
                  {nextAdmin.administration_name}
                </p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {nextAdmin.session_label}
                </p>
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
}