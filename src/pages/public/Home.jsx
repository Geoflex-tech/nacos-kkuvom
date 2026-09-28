import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../../components/Hero";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: n } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(3);
      const { data: e } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true })
        .limit(3);
      setNews(n || []);
      setEvents(e || []);
    })();
  }, []);

  return (
    <>
      <Hero /> {/* President's Welcome */}
<section className="bg-gray-50 py-16">
  <div className="max-w-4xl mx-auto px-4">
    <div className="card p-8 md:p-10">
      <p className="text-xs uppercase tracking-widest text-nacos-green font-bold mb-4 text-center">
        A Message from the President
      </p>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-nacos-blue to-nacos-green flex items-center justify-center text-white text-2xl font-bold border-4 border-nacos-gold">
            E
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to the official digital home of NACOS KKU VOM Chapter.
            Whether you're a current student, a prospective member, an alumnus,
            or a friend of the chapter — you are welcome here.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            As the pioneer administration, we are not just building a website.
            We are laying the digital foundation that every future generation
            of this chapter will stand on. Every system here — the member
            portal, the certificate registry, the chapter archive — is
            designed to serve students long after our tenure ends.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            I invite you to join us. Register as a member, attend our events,
            use our resources, and be part of building something that lasts.
          </p>
          <div>
            <p className="font-bold text-nacos-blue">
              Ezekiel Geoffrey Izam
            </p>
            <p className="text-sm text-gray-500">
              Acting President, NACOS KKU VOM Chapter
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-nacos-blue mb-6">Latest News</h2>
        {news.length === 0 ? (
          <p className="text-gray-500">No news yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((n) => (
              <Link
                to={`/news/${n.slug}`}
                key={n.id}
                className="card p-4 block hover:shadow-md"
              >
                <h3 className="font-semibold text-nacos-blue">{n.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{n.body}</p>
                <span className="inline-block mt-2 text-xs text-nacos-green font-semibold">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        )}
        <Link
          to="/news"
          className="inline-block mt-6 text-nacos-green font-semibold hover:underline"
        >
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
