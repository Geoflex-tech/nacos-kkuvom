import { useEffect, useMemo, useState } from "react";
import {
  GraduationCap,
  Briefcase,
  Wrench,
  Trophy,
  Rocket,
  Award,
  Building2,
  BookOpen,
  Calendar,
  ExternalLink,
  MapPin,
  Clock,
  Star,
  Sparkles,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const CATEGORIES = [
  { id: "all", label: "All", Icon: Sparkles },
  { id: "scholarship", label: "Scholarships", Icon: GraduationCap },
  { id: "internship", label: "Internships", Icon: Briefcase },
  { id: "siwes", label: "SIWES", Icon: Wrench },
  { id: "hackathon", label: "Hackathons", Icon: Rocket },
  { id: "competition", label: "Competitions", Icon: Trophy },
  { id: "fellowship", label: "Fellowships", Icon: Award },
  { id: "job", label: "Jobs", Icon: Building2 },
  { id: "training", label: "Training", Icon: BookOpen },
  { id: "event", label: "Events", Icon: Calendar },
];

const CATEGORY_COLORS = {
  scholarship: "bg-blue-50 text-blue-700",
  internship: "bg-green-50 text-green-700",
  siwes: "bg-yellow-50 text-yellow-700",
  hackathon: "bg-purple-50 text-purple-700",
  competition: "bg-pink-50 text-pink-700",
  fellowship: "bg-indigo-50 text-indigo-700",
  job: "bg-emerald-50 text-emerald-700",
  training: "bg-orange-50 text-orange-700",
  event: "bg-cyan-50 text-cyan-700",
};

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const deadline = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function deadlineLabel(dateStr) {
  const d = daysUntil(dateStr);
  if (d === null) return null;
  if (d < 0) return { text: "Closed", color: "text-gray-500 bg-gray-100" };
  if (d === 0) return { text: "Closes today", color: "text-red-700 bg-red-100" };
  if (d <= 3) return { text: `${d} day${d === 1 ? "" : "s"} left`, color: "text-red-700 bg-red-100" };
  if (d <= 14) return { text: `${d} days left`, color: "text-yellow-700 bg-yellow-100" };
  return { text: `${d} days left`, color: "text-green-700 bg-green-100" };
}

export default function Opportunities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("opportunities")
      .select("*")
      .eq("status", "open")
      .order("is_featured", { ascending: false })
      .order("deadline", { ascending: true, nullsFirst: false })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((o) => {
      if (category !== "all" && o.category !== category) return false;
      if (q) {
        const haystack = [
          o.title,
          o.organization,
          o.description,
          o.location,
          o.eligibility,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [items, category, search]);

  const counts = useMemo(() => {
    const c = { all: items.length };
    items.forEach((o) => {
      c[o.category] = (c[o.category] || 0) + 1;
    });
    return c;
  }, [items]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-nacos-blue via-nacos-blue to-nacos-green">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-nacos-gold/15 blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 -right-32 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl animate-float" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-20 text-center text-white">
          <p className="text-sm uppercase tracking-widest text-white/70 mb-3">
            For Our Members
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Opportunities
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Scholarships, internships, hackathons, and more — curated for
            Computing students.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        {/* Search */}
        <input
          className="input mb-6"
          placeholder="Search by title, organization, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(({ id, label, Icon }) => {
            const active = category === id;
            const count = counts[id] || 0;
            if (id !== "all" && count === 0) return null;
            return (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  active
                    ? "bg-nacos-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
                <span
                  className={`text-xs ml-0.5 ${
                    active ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-center text-gray-500 py-16">
            Loading opportunities...
          </p>
        ) : filtered.length === 0 ? (
          <div className="card-flat p-12 text-center">
            <Sparkles size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              {items.length === 0
                ? "No opportunities yet. Check back soon."
                : "No opportunities match your filters."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {filtered.length}{" "}
              {filtered.length === 1 ? "opportunity" : "opportunities"}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((o) => {
                const cat = CATEGORIES.find((c) => c.id === o.category);
                const catColor =
                  CATEGORY_COLORS[o.category] || "bg-gray-100 text-gray-600";
                const dl = deadlineLabel(o.deadline);
                const isClosed = dl?.text === "Closed";

                return (
                  <div
                    key={o.id}
                    className={`card p-5 flex flex-col relative ${
                      o.is_featured ? "ring-2 ring-nacos-gold/60" : ""
                    }`}
                  >
                    {/* Featured badge */}
                    {o.is_featured && (
                      <div className="absolute -top-2 -right-2 bg-nacos-gold text-nacos-blue text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Star size={10} fill="currentColor" />
                        FEATURED
                      </div>
                    )}

                    {/* Top row: category + deadline */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span
                        className={`badge ${catColor} flex items-center gap-1`}
                      >
                        {cat?.Icon && <cat.Icon size={11} />}
                        {cat?.label || o.category}
                      </span>
                      {dl && (
                        <span
                          className={`badge ${dl.color} flex items-center gap-1 shrink-0`}
                        >
                          <Clock size={11} />
                          {dl.text}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-nacos-blue text-lg leading-tight">
                      {o.title}
                    </h3>

                    {/* Organization */}
                    {o.organization && (
                      <p className="text-sm text-nacos-green font-semibold mt-1">
                        {o.organization}
                      </p>
                    )}

                    {/* Location */}
                    {o.location && (
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <MapPin size={11} />
                        {o.location}
                      </p>
                    )}

                    {/* Description */}
                    {o.description && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {o.description}
                      </p>
                    )}

                    {/* Benefits */}
                    {o.benefits && (
                      <p className="text-xs text-gray-700 mt-3 bg-nacos-gold/10 border border-nacos-gold/30 rounded-md p-2">
                        <span className="font-semibold text-nacos-blue">
                          Benefits:{" "}
                        </span>
                        {o.benefits}
                      </p>
                    )}

                    {/* Deadline + apply button */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                      {o.deadline && (
                        <p className="text-xs text-gray-500">
                          Deadline:{" "}
                          <span className="font-semibold text-gray-700">
                            {new Date(o.deadline).toLocaleDateString("default", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </p>
                      )}
                      {o.apply_url && (
                        <a
                          href={o.apply_url}
                          target="_blank"
                          rel="noreferrer"
                          className={`text-sm font-semibold inline-flex items-center gap-1 ${
                            isClosed
                              ? "text-gray-400 pointer-events-none"
                              : "text-nacos-green hover:underline"
                          }`}
                        >
                          Apply <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    {/* Eligibility (collapsible look) */}
                    {o.eligibility && (
                      <details className="mt-3 group">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-nacos-blue font-medium">
                          Eligibility requirements
                        </summary>
                        <p className="text-xs text-gray-600 mt-2 pl-3 border-l-2 border-gray-200">
                          {o.eligibility}
                        </p>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </>
  );
}