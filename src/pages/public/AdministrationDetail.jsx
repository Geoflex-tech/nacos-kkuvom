import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AdministrationDetail() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [executives, setExecutives] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
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

      const [execsRes, eventsRes, newsRes, galleryRes] = await Promise.all([
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
      ]);

      setExecutives(execsRes.data || []);
      setEvents(eventsRes.data || []);
      setNews(newsRes.data || []);
      setGallery(galleryRes.data || []);
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
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-nacos-blue mb-4">Not found</h1>
        <p className="text-gray-500 mb-6">
          This administration record doesn't exist.
        </p>
        <Link to="/history" className="btn-primary inline-block">
          Back to History
        </Link>
      </section>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-nacos-blue to-nacos-green text-white">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <Link
            to="/history"
            className="text-sm text-white/80 hover:text-nacos-gold"
          >
            ← Back to History
          </Link>
          <div className="flex items-center gap-3 mt-4 mb-3 flex-wrap">
            <span className="bg-white/15 backdrop-blur text-white text-sm font-bold px-3 py-1 rounded-full">
              {admin.session_label}
            </span>
            {admin.is_current && (
              <span className="bg-nacos-gold text-nacos-blue text-sm font-bold px-3 py-1 rounded-full">
                CURRENT
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            {admin.administration_name}
          </h1>
          {admin.motto && (
            <p className="text-white/85 italic text-lg">"{admin.motto}"</p>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 space-y-14">
        {/* Description */}
        {admin.description && (
          <div>
            <h2 className="text-2xl font-bold text-nacos-blue mb-4">
              About This Administration
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {admin.description}
            </p>
          </div>
        )}

        {/* Executives */}
        <div>
          <h2 className="text-2xl font-bold text-nacos-blue mb-4">
            Executives
          </h2>
          {executives.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No executives recorded for this session.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {executives.map((e) => (
                <div key={e.id} className="card p-4 text-center">
                  {e.image_url ? (
                    <img
                      src={e.image_url}
                      alt={e.name}
                      className="h-24 w-24 mx-auto rounded-full object-cover border-4 border-nacos-gold"
                    />
                  ) : (
                    <div className="h-24 w-24 mx-auto rounded-full bg-nacos-blue text-white flex items-center justify-center text-3xl font-bold">
                      {e.name?.[0] || "?"}
                    </div>
                  )}
                  <h3 className="mt-3 font-bold text-nacos-blue">{e.name}</h3>
                  <p className="text-sm text-nacos-green font-semibold">
                    {e.position}
                  </p>
                  {e.level && (
                    <p className="text-xs text-gray-500 mt-1">{e.level}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Events */}
        {events.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-nacos-blue mb-4">
              Events
            </h2>
            <div className="space-y-3">
              {events.map((e) => (
                <div key={e.id} className="card p-4">
                  <p className="text-xs text-nacos-green font-bold uppercase">
                    {e.event_date
                      ? new Date(e.event_date).toDateString()
                      : "No date"}
                  </p>
                  <h3 className="font-bold text-nacos-blue mt-1">{e.title}</h3>
                  {e.location && (
                    <p className="text-sm text-gray-500">{e.location}</p>
                  )}
                  {e.description && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">
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
            <h2 className="text-2xl font-bold text-nacos-blue mb-4">
              News & Posts
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {news.map((n) => (
                <Link
                  key={n.id}
                  to={`/news/${n.slug}`}
                  className="card p-4 block hover:shadow-md"
                >
                  <h3 className="font-semibold text-nacos-blue">{n.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(n.published_at).toDateString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
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
            <h2 className="text-2xl font-bold text-nacos-blue mb-4">
              Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.slice(0, 8).map((g) => (
                <img
                  key={g.id}
                  src={g.image_url}
                  alt={g.caption || ""}
                  className="w-full aspect-square object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}