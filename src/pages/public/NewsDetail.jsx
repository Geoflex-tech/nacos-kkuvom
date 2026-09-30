import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function NewsDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setNotFound(true);
        else setItem(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  }

  if (notFound) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-nacos-blue mb-4">Post not found</h1>
        <p className="text-gray-500 mb-6">This article may have been removed.</p>
        <Link to="/news" className="btn-primary inline-block">
          Back to News
        </Link>
      </section>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/news" className="text-sm text-nacos-green font-semibold hover:underline">
        ← Back to News
      </Link>

      {item.cover_image && (
        <img
          src={item.cover_image}
          alt={item.title}
          className="w-full h-72 object-cover rounded-lg my-6"
        />
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-nacos-blue mt-4 mb-3">
        {item.title}
      </h1>

      <p className="text-sm text-gray-500 mb-8">
        {new Date(item.published_at).toDateString()}
        {item.author && ` · by ${item.author}`}
      </p>

      <div className="prose max-w-none text-gray-800 whitespace-pre-line leading-relaxed">
        {item.body}
      </div>
    </article>
  );
}
