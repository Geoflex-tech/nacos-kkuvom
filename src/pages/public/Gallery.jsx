import { useEffect, useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
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
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-nacos-blue via-nacos-blue-dark to-nacos-green">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-nacos-gold/10 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-nacos-green-light/20 blur-3xl animate-float" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-20 text-center text-white">
          <p className="text-sm uppercase tracking-widest text-white/70 mb-3">
            Moments
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Gallery</h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            Photos from our events, activities, and chapter milestones.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading gallery...</p>
        ) : items.length === 0 ? (
          <div className="card-flat p-12 text-center">
            <ImageIcon size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No photos yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {items.map((img) => (
              <button
                key={img.id}
                onClick={() => setActive(img)}
                className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-100 shadow-soft hover:shadow-card-hover transition-all duration-300"
              >
                <img
                  src={img.image_url}
                  alt={img.caption || ""}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-left">
                    <p className="text-white text-xs md:text-sm font-medium line-clamp-2">
                      {img.caption}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <button
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={20} />
          </button>
          <div className="max-w-5xl w-full">
            <img
              src={active.image_url}
              alt={active.caption || ""}
              className="w-full rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {active.caption && (
              <p className="text-white text-center mt-5 text-lg">
                {active.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}