import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Resources() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, []);

  const filtered = items.filter(
    (r) =>
      r.title?.toLowerCase().includes(filter.toLowerCase()) ||
      r.course_code?.toLowerCase().includes(filter.toLowerCase()) ||
      r.level?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-nacos-blue mb-2">Resources</h1>
      <p className="text-gray-500 mb-6">Past questions, lecture notes, and study materials</p>

      <input
        className="input mb-6"
        placeholder="Search by title, course code, or level..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          {items.length === 0 ? "No resources uploaded yet." : "No results match your search."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="card p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-nacos-blue">{r.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {r.course_code && <span className="mr-3">{r.course_code}</span>}
                  {r.level && <span className="mr-3">{r.level}</span>}
                </p>
                {r.description && (
                  <p className="text-sm text-gray-600 mt-1">{r.description}</p>
                )}
              </div>
              <a
                href={r.file_url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary text-sm whitespace-nowrap"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}