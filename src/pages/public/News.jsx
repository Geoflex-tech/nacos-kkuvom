import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function News() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-nacos-blue mb-2">News & Updates</h1>
      <p className="text-gray-500 mb-8">Latest from NACOS KKU VOM Chapter</p>

      {items.length === 0 ? (
        <p className="text-gray-500">No news yet.</p>
      ) : (
        <div className="space-y-8">
          {items.map((n) => (
            <article key={n.id} className="border-b pb-8 last:border-b-0">
              <Link to={`/news/${n.slug}`} className="block group">
                {n.cover_image && (
                  <img
                    src={n.cover_image}
                    alt={n.title}
                    className="w-full h-56 object-cover rounded-lg mb-4 group-hover:opacity-90 transition"
                  />
                )}
                <h2 className="text-2xl font-bold text-nacos-blue group-hover:text-nacos-green transition">
                  {n.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(n.published_at).toDateString()}
                  {n.author && ` · by ${n.author}`}
                </p>
                <p className="text-gray-700 mt-3 line-clamp-3">{n.body}</p>
                <span className="inline-block mt-3 text-nacos-green font-semibold text-sm group-hover:underline">
                  Read more →
                </span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
