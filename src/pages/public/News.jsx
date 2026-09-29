import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, ArrowRight, User } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PageHeader from "../../components/PageHeader";

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHeader
        label="Latest Updates"
        titleBold="CHAPTER"
        titleLight="NEWS"
        description="Stories, announcements, and updates from NACOS KKU VOM Chapter."
      />

      <section className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading news...</p>
        ) : items.length === 0 ? (
          <div className="card-flat p-10 text-center">
            <Newspaper size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No news yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {items.map((n, index) => {
              const isFeatured = index === 0 && items.length > 2;
              return (
                <Link
                  key={n.id}
                  to={`/news/${n.slug}`}
                  className={`card group block ${
                    isFeatured ? "md:flex md:gap-6 p-5 md:p-6" : "p-5 md:p-6"
                  }`}
                >
                  {isFeatured && n.cover_image && (
                    <div className="md:w-72 shrink-0 mb-4 md:mb-0">
                      <img
                        src={n.cover_image}
                        alt={n.title}
                        className="w-full h-48 md:h-full rounded-xl object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    {isFeatured && (
                      <span className="badge bg-nacos-gold/20 text-nacos-blue mb-3">
                        Featured
                      </span>
                    )}
                    <h2
                      className={`font-bold text-nacos-blue leading-tight group-hover:text-nacos-green transition ${
                        isFeatured ? "text-2xl md:text-3xl" : "text-xl"
                      }`}
                    >
                      {n.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                      <span>
                        {new Date(n.published_at).toLocaleDateString("default", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {n.author && (
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {n.author}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-gray-600 mt-3 ${
                        isFeatured ? "line-clamp-3" : "line-clamp-2"
                      }`}
                    >
                      {n.body}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-nacos-green font-semibold mt-4 group-hover:gap-2 transition-all">
                      Read full article <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
