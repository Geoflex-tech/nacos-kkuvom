import { useEffect, useMemo, useState } from "react";
import {
  Code,
  Globe,
  Shield,
  Database,
  Brain,
  Palette,
  Network,
  Briefcase,
  GitBranch,
  Smartphone,
  Cloud,
  BookOpen,
  Video,
  FileText,
  Wrench,
  ExternalLink,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const CATEGORIES = [
  { id: "all", label: "All", Icon: BookOpen },
  { id: "programming", label: "Programming", Icon: Code },
  { id: "web-dev", label: "Web Dev", Icon: Globe },
  { id: "cybersecurity", label: "Cybersecurity", Icon: Shield },
  { id: "data", label: "Data", Icon: Database },
  { id: "ai-ml", label: "AI & ML", Icon: Brain },
  { id: "ui-ux", label: "UI/UX", Icon: Palette },
  { id: "networking", label: "Networking", Icon: Network },
  { id: "git", label: "Git & GitHub", Icon: GitBranch },
  { id: "career", label: "Career", Icon: Briefcase },
  { id: "mobile", label: "Mobile", Icon: Smartphone },
  { id: "devops", label: "DevOps", Icon: Cloud },
];

const TYPE_ICONS = {
  course: Video,
  video: Video,
  article: FileText,
  docs: FileText,
  book: BookOpen,
  tool: Wrench,
  repo: GitBranch,
  tutorial: Video,
};

const LEVEL_COLORS = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
  all: "bg-blue-100 text-blue-700",
};

export default function TechHub() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("tech_hub_resources")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (level !== "all" && r.level !== level) return false;
      if (q) {
        const haystack = [
          r.title,
          r.description,
          r.category,
          (r.tags || []).join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [items, category, level, search]);

  const counts = useMemo(() => {
    const c = { all: items.length };
    items.forEach((r) => {
      c[r.category] = (c[r.category] || 0) + 1;
    });
    return c;
  }, [items]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-nacos-blue to-nacos-green text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-sm uppercase tracking-widest text-white/70 mb-3">
            Learn · Build · Grow
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            NACOS KKU Tech Hub
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            A curated library of the best free tech resources on the internet —
            handpicked for Nigerian Computing students.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        {/* Search */}
        <input
          className="input mb-6"
          placeholder="Search resources by title, description, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-4">
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

        {/* Level filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "all", label: "All levels" },
            { id: "beginner", label: "Beginner" },
            { id: "intermediate", label: "Intermediate" },
            { id: "advanced", label: "Advanced" },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                level === l.id
                  ? "bg-nacos-green text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {loading
            ? "Loading..."
            : `${filtered.length} resource${filtered.length === 1 ? "" : "s"}`}
        </p>

        {/* Resources grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading resources...</div>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center text-gray-500">
            No resources match your filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => {
              const TypeIcon = TYPE_ICONS[r.resource_type] || BookOpen;
              const catLabel =
                CATEGORIES.find((c) => c.id === r.category)?.label ||
                r.category;

              return (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card p-5 flex flex-col hover:shadow-md group"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-nacos-blue/10 text-nacos-blue flex items-center justify-center shrink-0">
                      <TypeIcon size={18} />
                    </div>
                    <ExternalLink
                      size={16}
                      className="text-gray-300 group-hover:text-nacos-blue transition shrink-0 mt-1"
                    />
                  </div>

                  <h3 className="font-bold text-nacos-blue leading-tight group-hover:text-nacos-green transition">
                    {r.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-1">
                    {r.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="text-xs bg-nacos-green/10 text-nacos-green font-semibold px-2 py-0.5 rounded">
                      {catLabel}
                    </span>
                    {r.level && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          LEVEL_COLORS[r.level] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {r.level}
                      </span>
                    )}
                    {r.resource_type && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
                        {r.resource_type}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}