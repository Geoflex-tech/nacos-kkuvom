import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Users, ArrowRight } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Executives() {
  const [execs, setExecs] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: currentAdmin } = await supabase
        .from("administrations")
        .select("*")
        .eq("is_current", true)
        .maybeSingle();
      setCurrent(currentAdmin);

      let query = supabase
        .from("executives")
        .select("*")
        .order("order_index");
      if (currentAdmin) query = query.eq("administration_id", currentAdmin.id);
      const { data } = await query;
      setExecs(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-nacos-blue via-nacos-blue to-nacos-green text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-nacos-gold/15 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl animate-float" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-24 text-center">
          <span className="inline-block bg-white/15 backdrop-blur border border-white/25 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            Leadership
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5">
            Chapter Executives
          </h1>
          {current ? (
            <p className="text-white/90 text-lg">
              {current.administration_name} · {current.session_label}
            </p>
          ) : (
            <p className="text-white/90 text-lg">
              The elected executives serving NACOS KKU VOM Chapter
            </p>
          )}
        </div>
      </section>

      {/* Executives grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading executives...</p>
        ) : execs.length === 0 ? (
          <div className="card-flat p-12 text-center">
            <Users size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              No executives added for this session yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {execs.map((e) => (
              <div
                key={e.id}
                className="card p-6 text-center hover:-translate-y-1 transition-transform duration-300 group"
              >
                {/* Photo */}
                <div className="relative inline-block">
                  {e.image_url ? (
                    <img
                      src={e.image_url}
                      alt={e.name}
                      className="h-32 w-32 rounded-full object-cover border-4 border-nacos-gold shadow-card"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-nacos-blue to-nacos-green text-white flex items-center justify-center text-5xl font-bold border-4 border-nacos-gold shadow-card">
                      {e.name?.[0] || "?"}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-nacos-green border-4 border-white flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>

                {/* Name + position */}
                <h3 className="mt-5 font-bold text-nacos-blue text-lg leading-tight">
                  {e.name}
                </h3>
                <p className="text-sm text-nacos-green font-semibold mt-1">
                  {e.position}
                </p>
                {e.level && (
                  <p className="text-xs text-gray-400 mt-1">{e.level}</p>
                )}

                {/* Bio */}
                {e.bio && (
                  <p className="text-xs text-gray-600 mt-4 line-clamp-3 leading-relaxed">
                    {e.bio}
                  </p>
                )}

                {/* Contact */}
                {(e.email || e.phone) && (
                  <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
                    {e.email && (
                      <a
                        href={`mailto:${e.email}`}
                        className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-nacos-blue transition"
                      >
                        <Mail size={12} />
                        <span className="truncate">{e.email}</span>
                      </a>
                    )}
                    {e.phone && (
                      <a
                        href={`tel:${e.phone}`}
                        className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-nacos-blue transition"
                      >
                        <Phone size={12} />
                        {e.phone}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* History teaser */}
        <div className="mt-16">
          <div className="rounded-3xl bg-gradient-to-br from-nacos-blue to-nacos-green text-white p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-nacos-gold/20 blur-3xl" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-nacos-gold font-bold mb-2">
                  Legacy
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                  Explore the Chapter's History
                </h2>
                <p className="text-white/90 max-w-xl">
                  See every administration that has served NACOS KKU VOM
                  Chapter — preserved as a digital archive for future
                  generations.
                </p>
              </div>
              <Link
                to="/history"
                className="inline-flex items-center gap-2 bg-white text-nacos-blue px-6 py-3 rounded-full font-semibold hover:shadow-lg transition whitespace-nowrap"
              >
                View History <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}