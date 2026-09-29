import { useEffect, useState, useCallback } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PageHeader from "../../components/PageHeader";

export default function Gallery() {
  const [items, setItems]   = useState([]);
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

  /* close lightbox on Escape */
  const handleKey = useCallback((e) => {
    if (e.key === "Escape") setActive(null);
  }, []);
  useEffect(() => {
    if (active) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [active, handleKey]);

  return (
    <>
      <PageHeader
        label="Moments"
        titleBold="PHOTO"
        titleLight="GALLERY"
        description="Photos from our events, activities, and chapter milestones."
      />

      <section className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          /* skeleton grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-gray-100 animate-pulse"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card p-12 text-center">
            <ImageIcon size={40} className="mx-auto mb-3" style={{ color: "#D1D5DB" }} />
            <p className="text-gray-500">No photos yet. Check back soon.</p>
          </div>
        ) : (
          <ul
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
            role="list"
            aria-label="Photo gallery"
          >
            {items.map((img) => (
              <li key={img.id}>
                <button
                  type="button"
                  onClick={() => setActive(img)}
                  aria-label={img.caption ? `View photo: ${img.caption}` : "View photo"}
                  className="group relative w-full overflow-hidden rounded-2xl aspect-square bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nacos-blue"
                  style={{ display: "block", cursor: "pointer" }}
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || "Gallery photo"}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-left">
                      <p className="text-white text-xs md:text-sm font-medium line-clamp-2">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || "Photo lightbox"}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ cursor: "zoom-out" }}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close photo"
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={20} />
          </button>
          <div className="max-w-5xl w-full">
            <img
              src={active.image_url}
              alt={active.caption || "Gallery photo"}
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
