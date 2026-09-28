import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading chapter history...
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-nacos-blue to-nacos-green text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Chapter History
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            A digital archive of every administration that has shaped
            NACOS KKU Vom Chapter.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        {administrations.length === 0 ? (
          <p className="text-gray-500 text-center">No administrations recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {administrations.map((a) => (
              <Link
                key={a.id}
                to={`/history/${a.id}`}
                className="card p-6 block hover:shadow-lg transition group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="inline-block bg-nacos-blue text-white text-xs font-bold px-3 py-1 rounded-full">
                        {a.session_label}
                      </span>
                      {a.is_current && (
                        <span className="inline-block bg-nacos-gold text-nacos-blue text-xs font-bold px-3 py-1 rounded-full">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-nacos-blue group-hover:text-nacos-green transition">
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
                  </div>
                  <span className="text-nacos-green font-semibold text-sm whitespace-nowrap group-hover:underline">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
