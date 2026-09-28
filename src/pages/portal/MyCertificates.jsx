import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function MyCertificates() {
  const { session } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("certificates")
      .select("*")
      .eq("member_id", session.user.id)
      .order("issued_date", { ascending: false })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, [session]);

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-nacos-blue mb-2">My Certificates</h1>
      <p className="text-gray-500 mb-8">
        Certificates issued to you by NACOS KKU Vom Chapter
      </p>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-3">🎓</div>
          <p className="text-gray-600 mb-2">You don't have any certificates yet.</p>
          <p className="text-sm text-gray-500">
            Attend workshops, events, and chapter activities to earn certificates.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((c) => (
            <Link
              key={c.id}
              to={`/certificates/${c.id}`}
              className="card p-5 block hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-3xl">🏆</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    c.status === "valid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <h3 className="font-bold text-nacos-blue leading-tight">{c.title}</h3>
              {c.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {c.description}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-3 font-mono">
                {c.certificate_number}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Issued {new Date(c.issued_date).toDateString()}
              </p>
              <span className="inline-block mt-3 text-xs text-nacos-green font-semibold">
                View certificate →
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}