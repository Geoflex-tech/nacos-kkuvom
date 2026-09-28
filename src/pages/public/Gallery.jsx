import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("gallery")
      .select("*")
      .order("uploaded_at", { ascending: false })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-nacos-blue mb-2">Gallery</h1>
      <p className="text-gray-500 mb-8">Moments from our events and activities</p>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          No photos yet. Check back soon.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((img) => (
            <button
              key={img.id}
              onClick={() => setActive(img)}
              className="group relative overflow-hidden rounded-xl aspect-square"
            >
              <img
                src={img.image_url}
                alt={img.caption || ""}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-white text-sm opacity-0 group-hover:opacity-100 transition">
                  {img.caption}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-4xl w-full">
            <img
              src={active.image_url}
              alt={active.caption || ""}
              className="w-full rounded-lg"
            />
            {active.caption && (
              <p className="text-white text-center mt-4">{active.caption}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
