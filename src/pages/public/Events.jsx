import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PageHeader from "../../components/PageHeader";

export default function Events() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const filtered = items.filter((e) => {
    if (!e.event_date) return true;
    const d = new Date(e.event_date);
    if (filter === "upcoming") return d >= now;
    if (filter === "past") return d < now;
    return true;
  });

  return (
    <>
      <PageHeader
        label="What's Happening"
        titleBold="UPCOMING"
        titleLight="EVENTS"
        description="Workshops, talks, meetings, and activities from NACOS KKU VOM Chapter."
      />

      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "upcoming", label: "Upcoming" },
            { id: "past", label: "Past" },
            { id: "all", label: "All" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                filter === f.id
                  ? "bg-nacos-blue text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading events...</p>
        ) : filtered.length === 0 ? (
          <div className="card-flat p-10 text-center">
            <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              {filter === "upcoming"
                ? "No upcoming events. Check back soon."
                : filter === "past"
                ? "No past events."
                : "No events yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((e) => {
              const d = new Date(e.event_date);
              const isPast = d < now;
              return (
                <div
                  key={e.id}
                  className="card p-5 md:p-6 flex flex-col md:flex-row gap-5"
                >
                  {/* Date badge */}
                  <div
                    className={`shrink-0 w-full md:w-24 rounded-xl text-center overflow-hidden ${
                      isPast ? "bg-gray-100 text-gray-500" : "bg-nacos-blue text-white"
                    }`}
                  >
                    <div
                      className={`text-xs uppercase tracking-wide py-1.5 ${
                        isPast ? "bg-gray-200" : "bg-nacos-blue-dark"
                      }`}
                    >
                      {d.toLocaleString("default", { month: "short" })}
                    </div>
                    <div className="text-3xl font-bold py-2">{d.getDate()}</div>
                    <div className="text-xs py-1">{d.getFullYear()}</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h2 className="text-xl font-bold text-nacos-blue leading-tight">
                        {e.title}
                      </h2>
                      {isPast ? (
                        <span className="badge bg-gray-100 text-gray-500 shrink-0">
                          Past
                        </span>
                      ) : (
                        <span className="badge bg-nacos-green/10 text-nacos-green shrink-0">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {d.toLocaleTimeString("default", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {e.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {e.location}
                        </span>
                      )}
                    </div>

                    {e.description && (
                      <p className="text-gray-700 mt-4 whitespace-pre-line leading-relaxed">
                        {e.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
