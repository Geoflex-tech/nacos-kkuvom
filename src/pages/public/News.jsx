import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function News() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    supabase.from("news").select("*").order("published_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, []);
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-nacos-blue mb-6">News & Updates</h1>
      {items.length === 0 ? <p className="text-gray-500">No news yet.</p> : (
        <div className="space-y-6">
          {items.map((n) => (
            <article key={n.id} className="border-b pb-6">
              <h2 className="text-xl font-semibold text-nacos-blue">{n.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{new Date(n.published_at).toDateString()}</p>
              <p className="text-gray-700">{n.body}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}