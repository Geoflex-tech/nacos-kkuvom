import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Award,
  BookOpen,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";
import Hero from "../../components/Hero";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [execs, setExecs] = useState([]);
  const [president, setPresident] = useState(null);
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    certificates: 0,
    resources: 0,
  });

  useEffect(() => {
    (async () => {
      const [
        newsRes,
        eventsRes,
        execsRes,
        membersRes,
        certsRes,
        resourcesRes,
        presidentRes,
      ] = await Promise.all([
        supabase
          .from("news")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(3),
        supabase
          .from("events")
          .select("*")
          .gte("event_date", new Date().toISOString())
          .order("event_date", { ascending: true })
          .limit(3),
        supabase
          .from("executives")
          .select("*")
          .order("order_index")
          .limit(4),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("certificates")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("tech_hub_resources")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("executives")
          .select("*")
          .or("position.ilike.%president%,position.ilike.%President%")
          .order("order_index")
          .limit(1),
      ]);

      setNews(newsRes.data || []);
      setEvents(eventsRes.data || []);
      setExecs(execsRes.data || []);
      setPresident(presidentRes.data?.[0] || null);
      setStats({
        members: membersRes.count || 0,
        events: eventsRes.data?.length || 0,
        certificates: certsRes.count || 0,
        resources: resourcesRes.count || 0,
      });
    })();
  }, []);

  // Fallback if no president exec is found
  const presidentName = president?.name || "Ezekiel Geoffrey Izam";
  const presidentPosition = president?.position
    ? `${president.position}, NACOS KKU VOM Chapter`
    : "Acting President, NACOS KKU VOM Chapter";

  return (
    <>
      <Hero />

      {/* Stats band */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: "Members", value: stats.members, Icon: Users },
              { label: "Events", value: stats.events, Icon: Calendar },
              { label: "Certificates", value: stats.certificates, Icon: Award },
              { label: "Tech Resources", value: stats.resources, Icon: BookOpen },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="text-center">
                <div className="inline-flex h-12 w-12 rounded-xl bg-nacos-blue/5 text-nacos-blue items-center justify-center mb-3">
                  <Icon size={22} />
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-nacos-blue">
                  {value}
                </p>
                <p className="text-xs md:text-sm text-gray-500 font-medium mt-1 uppercase tracking-wide">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* President's Welcome */}
      <section className="bg-gray-50">
        <div className="section">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="section-eyebrow">A Message from the President</p>
              <h2 className="section-title">Built for the next generation</h2>
            </div>

            <div className="card-flat p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="shrink-0 mx-auto md:mx-0">
                  {president?.image_url ? (
                    <img
                      src={president.image_url}
                      alt={presidentName}
                      className="h-28 w-28 rounded-full object-cover border-4 border-nacos-gold shadow-card"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-gradient-to-br from-nacos-blue to-nacos-green flex items-center justify-center text-white text-4xl font-bold border-4 border-nacos-gold">
                      {presidentName[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to the official digital home of NACOS KKU VOM
                    Chapter. Whether you're a current student, a prospective
                    member, an alumnus, or a friend of the chapter — you are
                    welcome here.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    As the pioneer administration, we are not just building a
                    website. We are laying the digital foundation that every
                    future generation of this chapter will stand on.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    I invite you to join us. Register as a member, attend our
                    events, use our resources, and be part of building
                    something that lasts.
                  </p>
                  <div>
                    <p className="font-bold text-nacos-blue">
                      {presidentName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {presidentPosition}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured executives */}
      {execs.length > 0 && (
        <section className="bg-white">
          <div className="section">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-eyebrow">Leadership</p>
                <h2 className="section-title">Meet the Pioneer Team</h2>
              </div>
              <Link
                to="/executives"
                className="hidden md:inline-flex items-center gap-1 text-nacos-green font-semibold hover:underline"
              >
                View all <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {execs.map((e) => (
                <div
                  key={e.id}
                  className="card p-5 text-center hover:-translate-y-1 transition-transform duration-300"
                >
                  {e.image_url ? (
                    <img
                      src={e.image_url}
                      alt={e.name}
                      className="h-24 w-24 mx-auto rounded-full object-cover border-4 border-nacos-gold shadow-md"
                    />
                  ) : (
                    <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-nacos-blue to-nacos-green text-white flex items-center justify-center text-3xl font-bold border-4 border-nacos-gold">
                      {e.name?.[0] || "?"}
                    </div>
                  )}
                  <h3 className="mt-4 font-bold text-nacos-blue text-sm md:text-base leading-tight">
                    {e.name}
                  </h3>
                  <p className="text-xs md:text-sm text-nacos-green font-semibold mt-1">
                    {e.position}
                  </p>
                  {e.level && (
                    <p className="text-xs text-gray-400 mt-1">{e.level}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="md:hidden text-center mt-6">
              <Link
                to="/executives"
                className="inline-flex items-center gap-1 text-nacos-green font-semibold hover:underline"
              >
                View all executives <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News + Events side by side */}
      <section className="bg-gray-50">
        <div className="section">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* News */}
            <div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="section-eyebrow">Latest Updates</p>
                  <h2 className="section-title text-2xl md:text-3xl">News</h2>
                </div>
                <Link
                  to="/news"
                  className="text-nacos-green font-semibold text-sm hover:underline"
                >
                  All news →
                </Link>
              </div>

              {news.length === 0 ? (
                <div className="card-flat p-8 text-center text-gray-500">
                  No news yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {news.map((n) => (
                    <Link
                      key={n.id}
                      to={`/news/${n.slug}`}
                      className="card p-5 block group"
                    >
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(n.published_at).toDateString()}
                        {n.author && ` · ${n.author}`}
                      </p>
                      <h3 className="font-bold text-nacos-blue leading-tight group-hover:text-nacos-green transition">
                        {n.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {n.body}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-nacos-green font-semibold mt-3">
                        Read more <ArrowRight size={12} />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Events */}
            <div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="section-eyebrow">What's Coming</p>
                  <h2 className="section-title text-2xl md:text-3xl">Events</h2>
                </div>
                <Link
                  to="/events"
                  className="text-nacos-green font-semibold text-sm hover:underline"
                >
                  All events →
                </Link>
              </div>

              {events.length === 0 ? (
                <div className="card-flat p-8 text-center text-gray-500">
                  No upcoming events.
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((e) => {
                    const d = new Date(e.event_date);
                    return (
                      <div
                        key={e.id}
                        className="card p-5 flex gap-4 items-start"
                      >
                        <div className="shrink-0 w-16 text-center bg-nacos-blue text-white rounded-xl overflow-hidden">
                          <div className="text-xs uppercase tracking-wide bg-nacos-blue-dark py-1">
                            {d.toLocaleString("default", { month: "short" })}
                          </div>
                          <div className="text-2xl font-bold py-1">
                            {d.getDate()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-nacos-blue leading-tight">
                            {e.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock size={12} />
                            {d.toLocaleTimeString("default", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {e.location && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <MapPin size={12} />
                              {e.location}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Hub teaser */}
      <section className="bg-white">
        <div className="section">
          <div className="rounded-3xl bg-gradient-to-br from-nacos-blue via-nacos-blue to-nacos-green p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-nacos-gold/20 blur-3xl" />
            <div className="relative grid md:grid-cols-[1fr_auto] items-center gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-nacos-gold font-bold mb-2">
                  New · Learn Free
                </p>
                <h2 className="text-2xl md:text-4xl font-extrabold mb-3">
                  {stats.resources}+ curated resources, handpicked
                </h2>
                <p className="text-white/85 max-w-xl">
                  From freeCodeCamp to fast.ai — the best free courses, books,
                  and tools for Computing students, organized by category and
                  skill level.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/tech-hub" className="btn-gold whitespace-nowrap">
                  Explore Tech Hub
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-50">
        <div className="section">
          <div className="text-center max-w-2xl mx-auto">
            <p className="section-eyebrow">Get Started</p>
            <h2 className="section-title mb-4">
              Ready to be part of the foundation?
            </h2>
            <p className="text-gray-600 mb-8">
              Join NACOS KKU VOM Chapter today. Free registration, real
              resources, and a community of Computing students building the
              future.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/register" className="btn-primary text-base px-6 py-3">
                Create Account
              </Link>
              <Link to="/contact" className="btn-outline text-base px-6 py-3">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
