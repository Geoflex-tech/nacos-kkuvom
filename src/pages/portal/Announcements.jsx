import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Announcements() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, []);

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-nacos-blue mb-2">Announcements</h1>
      <p className="text-gray-500 mb-6">Latest updates from the chapter executives</p>

      {items.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          No announcements yet.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <div key={a.id} className="card p-5">
              <h2 className="font-bold text-nacos-blue">{a.title}</h2>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(a.created_at).toLocaleString()}
              </p>
              <p className="text-gray-700 mt-3 whitespace-pre-line">{a.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
