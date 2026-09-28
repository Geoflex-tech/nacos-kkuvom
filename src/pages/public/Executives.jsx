import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Users } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Executives() {
  const [execs, setExecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: currentAdmin } = await supabase
        .from("administrations")
        .select("*")
        .eq("is_current", true)
        .maybeSingle();
      setCurrent(currentAdmin);

      let query = supabase.from("executives").select("*").order("order_index");
      if (currentAdmin) {
        query = query.eq("administration_id", currentAdmin.id);
      }
      const { data } = await query;
      setExecs(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-nacos-blue via-nacos-blue to-nacos-green">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-nacos-gold/10 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-nacos-green-light/20 blur-3xl animate-float" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-20 text-center text-white">
          <p className="text-sm uppercase tracking-widest text-white/70 mb-3">
            Leadership
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Chapter Executives
          </h1>
          {current ? (
            <p className="text-white/85 text-lg max-w-2xl mx-auto">
              {current.administration_name} · {current.session_label}
            </p>
          ) : (
            <p className="text-white/85 text-lg max-w-2xl mx-auto">
              The elected executives serving NACOS KKU VOM Chapter
            </p>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading executives...</p>
        ) : execs.length === 0 ? (
          <div className="card-flat p-10 text-center">
            <Users size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              No executives have been added for this session yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {execs.map((e) => (
              <div
                key={e.id}
                className="card p-6 text-center hover:-translate-y-1 transition-transform duration-300 group"
              >
                {e.image_url ? (
                  <div className="relative inline-block">
                    <img
                      src={e.image_url}
                      alt={e.name}
                      className="h-32 w-32 rounded-full object-cover border-4 border-nacos-gold shadow-card group-hover:shadow-card-hover transition"
                    />
                    <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-nacos-green border-4 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-nacos-blue to-nacos-green text-white flex items-center justify-center text-5xl font-bold border-4 border-nacos-gold shadow-card">
                    {e.name?.[0] || "?"}
                  </div>
                )}

                <h3 className="mt-5 font-bold text-nacos-blue text-lg leading-tight">
                  {e.name}
                </h3>
                <p className="text-sm text-nacos-green font-semibold mt-1">
                  {e.position}
                </p>
                {e.level && (
                  <p className="text-xs text-gray-400 mt-1">{e.level}</p>
                )}

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

        {/* Link to history */}
        <div className="mt-16 card-flat p-8 text-center bg-gradient-to-br from-gray-50 to-white">
          <p className="section-eyebrow">Legacy</p>
          <h2 className="text-2xl font-bold text-nacos-blue mb-3">
            Explore the Chapter's History
          </h2>
          <p className="text-gray-600 mb-5 max-w-xl mx-auto">
            See every administration that has served NACOS KKU VOM Chapter —
            preserved as a digital archive for future generations.
          </p>
          <Link to="/history" className="btn-outline inline-flex">
            View Chapter History
          </Link>
        </div>
      </section>
    </>
  );
}
