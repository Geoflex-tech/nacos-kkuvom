import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../../components/Hero";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: n } = await supabase.from("news").select("*").order("published_at", { ascending: false }).limit(3);
      const { data: e } = await supabase.from("events").select("*").order("event_date", { ascending: true }).limit(3);
      setNews(n || []);
      setEvents(e || []);
    })();
  }, []);

  return (
    <>
      <Hero />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-nacos-blue mb-6">Latest News</h2>
        {news.length === 0 ? (
          <p className="text-gray-500">No news yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((n) => (
              <article key={n.id} className="card p-4">
                <h3 className="font-semibold text-nacos-blue">{n.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{n.body}</p>
              </article>
            ))}
          </div>
        )}
        <Link to="/news" className="inline-block mt-6 text-nacos-green font-semibold hover:underline">
          View all news →
        </Link>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-nacos-blue mb-6">Upcoming Events</h2>
          {events.length === 0 ? (
            <p className="text-gray-500">No events scheduled yet.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {events.map((e) => (
                <div key={e.id} className="card p-5">
                  <p className="text-xs text-nacos-green font-bold uppercase">
                    {new Date(e.event_date).toDateString()}
                  </p>
                  <h3 className="font-semibold text-lg text-nacos-blue mt-1">{e.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{e.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}