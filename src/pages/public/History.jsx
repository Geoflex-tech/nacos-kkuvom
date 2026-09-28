import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { History as HistoryIcon, ArrowRight } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function History() {
  const [administrations, setAdministrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("administrations")
      .select("*")
      .order("start_date", { ascending: false })
      .then(({ data }) => {
        setAdministrations(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-nacos-blue via-nacos-blue-dark to-nacos-green">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-nacos-gold/10 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-nacos-green-light/20 blur-3xl animate-float" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-20 text-center text-white">
          <p className="text-sm uppercase tracking-widest text-white/70 mb-3">
            Legacy
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Chapter History
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            A digital archive of every administration that has shaped
            NACOS KKU VOM Chapter.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading history...</p>
        ) : administrations.length === 0 ? (
          <div className="card-flat p-10 text-center">
            <HistoryIcon size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No administrations recorded yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-8 top-2 bottom-2 w-0.5 bg-gradient-to-b from-nacos-gold via-nacos-green to-nacos-blue/20" />

            <div className="space-y-6">
              {administrations.map((a) => (
                <div key={a.id} className="relative pl-16 md:pl-24">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-4 md:left-6 top-6 h-5 w-5 rounded-full border-4 ${
                      a.is_current
                        ? "bg-nacos-gold border-white shadow-glow"
                        : "bg-white border-nacos-blue"
                    }`}
                  />

                  <Link
                    to={`/history/${a.id}`}
                    className="card p-6 block group hover:-translate-y-0.5 transition-transform duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="badge bg-nacos-blue text-white font-mono">
                            {a.session_label}
                          </span>
                          {a.is_current && (
                            <span className="badge bg-nacos-gold text-nacos-blue font-bold">
                              ★ CURRENT
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-nacos-blue group-hover:text-nacos-green transition">
                          {a.administration_name}
                        </h2>

                        {a.motto && (
                          <p className="text-sm italic text-gray-500 mt-1">
                            "{a.motto}"
                          </p>
                        )}

                        {a.description && (
                          <p className="text-gray-700 mt-3 line-clamp-2">
                            {a.description}
                          </p>
                        )}

                        {a.start_date && (
                          <p className="text-xs text-gray-400 mt-3">
                            {new Date(a.start_date).toLocaleDateString(
                              "default",
                              { month: "long", year: "numeric" }
                            )}
                            {a.end_date &&
                              ` — ${new Date(a.end_date).toLocaleDateString(
                                "default",
                                { month: "long", year: "numeric" }
                              )}`}
                          </p>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 text-nacos-green font-semibold text-sm shrink-0 group-hover:gap-2 transition-all">
                        View <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}