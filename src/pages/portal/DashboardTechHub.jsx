/**
 * DashboardTechHub — /dashboard/tech-hub
 *
 * Protected page: only logged-in registered (approved) students.
 * Tech Hub resources are curated free external links — no file downloads.
 * The tech_hub_resources table requires authenticated read (RLS enforced).
 *
 * All filters (category, level, search) match the original public TechHub page.
 */
import { useEffect, useMemo, useState } from "react";
import {
  Code, Globe, Shield, Database, Brain, Palette,
  Network, Briefcase, GitBranch, Smartphone, Cloud,
  BookOpen, Video, FileText, Wrench, ExternalLink, AlertCircle, Cpu,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  { id: "all",          label: "All",          Icon: BookOpen   },
  { id: "programming",  label: "Programming",  Icon: Code       },
  { id: "web-dev",      label: "Web Dev",      Icon: Globe      },
  { id: "cybersecurity",label: "Cybersecurity",Icon: Shield     },
  { id: "data",         label: "Data",         Icon: Database   },
  { id: "ai-ml",        label: "AI & ML",      Icon: Brain      },
  { id: "ui-ux",        label: "UI/UX",        Icon: Palette    },
  { id: "networking",   label: "Networking",   Icon: Network    },
  { id: "git",          label: "Git & GitHub", Icon: GitBranch  },
  { id: "career",       label: "Career",       Icon: Briefcase  },
  { id: "mobile",       label: "Mobile",       Icon: Smartphone },
  { id: "devops",       label: "DevOps",       Icon: Cloud      },
];

const TYPE_ICONS = {
  course:   Video,    video:    Video,
  article:  FileText, docs:     FileText,
  book:     BookOpen, tool:     Wrench,
  repo:     GitBranch, tutorial: Video,
};

const LEVEL_COLORS = {
  beginner:     "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced:     "bg-red-100 text-red-700",
  all:          "bg-blue-100 text-blue-700",
};

export default function DashboardTechHub() {
  const { profile } = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [category, setCategory] = useState("all");
  const [level, setLevel]       = useState("all");
  const [search, setSearch]     = useState("");

  const isApproved = profile?.status === "approved";

  useEffect(() => {
    if (!isApproved) { setLoading(false); return; }
    supabase
      .from("tech_hub_resources")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setItems(data || []);
        setLoading(false);
      });
  }, [isApproved]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (level    !== "all" && r.level    !== level)    return false;
      if (q) {
        const hay = [r.title, r.description, r.category, (r.tags || []).join(" ")]
          .filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, category, level, search]);

  const counts = useMemo(() => {
    const c = { all: items.length };
    items.forEach((r) => { c[r.category] = (c[r.category] || 0) + 1; });
    return c;
  }, [items]);

  /* Pending/rejected gate */
  if (!isApproved && !loading) {
    return (
      <div className="dth-gate">
        <AlertCircle size={36} aria-hidden="true" style={{ color: "#F59E0B", marginBottom: 12 }} />
        <h2 className="dth-gate-title">Account Pending Approval</h2>
        <p className="dth-gate-text">
          {profile?.status === "rejected"
            ? "Your membership application was not approved. Contact an admin for assistance."
            : "Your account is pending admin approval. Tech Hub will be accessible once you are approved."}
        </p>
        <style>{`
          .dth-gate { min-height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 16px; text-align: center; }
          .dth-gate-title { font-size: 1.25rem; font-weight: 700; color: #1E3A8A; margin: 0 0 8px; }
          .dth-gate-text  { font-size: 0.9375rem; color: #64748B; max-width: 380px; line-height: 1.6; margin: 0; }
        `}</style>
      </div>
    );
  }

  return (
    <section className="dth-wrap">
      <div className="dth-header">
        <div className="dth-icon" aria-hidden="true">
          <Cpu size={22} />
        </div>
        <div>
          <h1 className="dth-title">Tech Hub</h1>
          <p className="dth-subtitle">
            Curated free courses, books, and tools — organized by category and skill level
          </p>
        </div>
      </div>

      {/* Search */}
      <input
        className="dth-search"
        placeholder="Search resources by title, description, or tag…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search Tech Hub resources"
      />

      {/* Category chips */}
      <div className="dth-chips" role="group" aria-label="Filter by category">
        {CATEGORIES.map(({ id, label, Icon }) => {
          const active = category === id;
          const count  = counts[id] || 0;
          if (id !== "all" && count === 0) return null;
          return (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={`dth-chip${active ? " dth-chip--active" : ""}`}
              aria-pressed={active}
            >
              <Icon size={14} aria-hidden="true" />
              <span>{label}</span>
              <span className={`dth-chip-count${active ? " dth-chip-count--active" : ""}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Level filter */}
      <div className="dth-levels" role="group" aria-label="Filter by level">
        {[
          { id: "all",          label: "All levels"    },
          { id: "beginner",     label: "Beginner"      },
          { id: "intermediate", label: "Intermediate"  },
          { id: "advanced",     label: "Advanced"      },
        ].map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            className={`dth-level-btn${level === l.id ? " dth-level-btn--active" : ""}`}
            aria-pressed={level === l.id}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="dth-error">
          <AlertCircle size={16} aria-hidden="true" />
          <span>Failed to load resources: {error}</span>
        </div>
      )}

      {/* Count */}
      {!loading && !error && (
        <p className="dth-count" aria-live="polite">
          {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="dth-grid" aria-busy="true" aria-label="Loading resources">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="dth-card dth-card--skel" aria-hidden="true">
              <div className="dth-skel-icon" />
              <div className="dth-skel-title" />
              <div className="dth-skel-body" />
              <div className="dth-skel-body dth-skel-body--short" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="dth-empty">
          <Cpu size={36} aria-hidden="true" style={{ color: "#D1D5DB", marginBottom: 10 }} />
          <p>
            {items.length === 0
              ? "No resources yet. Check back soon."
              : "No resources match your filters."}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <ul className="dth-grid" aria-label="Tech Hub resources">
          {filtered.map((r) => {
            const TypeIcon = TYPE_ICONS[r.resource_type] || BookOpen;
            const catLabel = CATEGORIES.find((c) => c.id === r.category)?.label || r.category;
            return (
              <li key={r.id}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="dth-card dth-card--link"
                  aria-label={`Open ${r.title} (opens in new tab)`}
                >
                  <div className="dth-card-top">
                    <div className="dth-type-icon" aria-hidden="true">
                      <TypeIcon size={18} />
                    </div>
                    <ExternalLink size={15} className="dth-ext-icon" aria-hidden="true" />
                  </div>
                  <h3 className="dth-card-title">{r.title}</h3>
                  <p className="dth-card-desc">{r.description}</p>
                  <div className="dth-card-tags">
                    <span className="dth-tag dth-tag--cat">{catLabel}</span>
                    {r.level && (
                      <span className={`dth-tag ${LEVEL_COLORS[r.level] || "bg-gray-100 text-gray-600"}`}>
                        {r.level}
                      </span>
                    )}
                    {r.resource_type && (
                      <span className="dth-tag dth-tag--type">{r.resource_type}</span>
                    )}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <style>{`
        .dth-wrap { max-width: 1100px; margin-inline: auto; padding: 32px 16px 64px; }

        .dth-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .dth-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: #F0FDF4; color: #047857;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dth-title    { font-size: 1.5rem; font-weight: 700; color: #1E3A8A; margin: 0; }
        .dth-subtitle { font-size: 0.875rem; color: #64748B; margin: 2px 0 0; }

        .dth-search {
          width: 100%; padding: 10px 14px;
          border: 1px solid #D1D5DB; border-radius: 10px;
          font-size: 0.9rem; color: #374151; margin-bottom: 16px;
          box-sizing: border-box;
        }
        .dth-search:focus { outline: none; border-color: #1E40AF; box-shadow: 0 0 0 3px rgba(30,64,175,0.12); }

        .dth-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
        .dth-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 999px; font-size: 0.8125rem; font-weight: 500;
          background: #F3F4F6; color: #374151; border: none; cursor: pointer;
          transition: background 150ms ease-out, color 150ms ease-out;
        }
        .dth-chip:hover       { background: #E5E7EB; }
        .dth-chip--active     { background: #1E40AF; color: #fff; }
        .dth-chip-count       { font-size: 11px; color: #9CA3AF; }
        .dth-chip-count--active { color: rgba(255,255,255,0.7); }

        .dth-levels { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .dth-level-btn {
          padding: 4px 14px; border-radius: 999px;
          font-size: 0.75rem; font-weight: 600;
          background: #F3F4F6; color: #6B7280; border: none; cursor: pointer;
          transition: background 150ms ease-out, color 150ms ease-out;
        }
        .dth-level-btn:hover        { background: #E5E7EB; }
        .dth-level-btn--active      { background: #047857; color: #fff; }

        .dth-error {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; border-radius: 10px;
          background: #FEF2F2; color: #DC2626; font-size: 0.875rem; margin-bottom: 16px;
        }
        .dth-count { font-size: 0.875rem; color: #6B7280; margin-bottom: 12px; }

        .dth-empty { text-align: center; padding: 48px 16px; color: #64748B; display: flex; flex-direction: column; align-items: center; }

        .dth-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        .dth-card {
          background: #fff;
          border: 1px solid #E5E7EB; border-radius: 12px;
          padding: 20px; display: flex; flex-direction: column;
        }
        .dth-card--link {
          text-decoration: none; cursor: pointer;
          transition: border-color 150ms ease-out, box-shadow 150ms ease-out, transform 150ms ease-out;
        }
        .dth-card--link:hover {
          border-color: #BFDBFE;
          box-shadow: 0 4px 12px rgba(30,64,175,0.08);
          transform: translateY(-2px);
        }
        .dth-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
        .dth-type-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: #EFF6FF; color: #1E40AF;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dth-ext-icon { color: #D1D5DB; transition: color 150ms ease-out; margin-top: 2px; flex-shrink: 0; }
        .dth-card--link:hover .dth-ext-icon { color: #1E40AF; }

        .dth-card-title { font-size: 0.9375rem; font-weight: 700; color: #1E3A8A; margin: 0 0 8px; line-height: 1.3; }
        .dth-card--link:hover .dth-card-title { color: #047857; }
        .dth-card-desc {
          font-size: 0.8125rem; color: #4B5563; line-height: 1.6; margin: 0 0 auto;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dth-card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
        .dth-tag { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
        .dth-tag--cat  { background: #D1FAE5; color: #047857; }
        .dth-tag--type { background: #F3F4F6; color: #6B7280; text-transform: capitalize; }

        /* Skeleton */
        .dth-card--skel { pointer-events: none; }
        .dth-skel-icon  { width: 40px; height: 40px; border-radius: 10px; margin-bottom: 12px;
          background: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%);
          background-size: 200% 100%; animation: dth-shimmer 1.4s infinite; }
        .dth-skel-title { height: 16px; width: 75%; border-radius: 6px; margin-bottom: 10px;
          background: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%);
          background-size: 200% 100%; animation: dth-shimmer 1.4s infinite; }
        .dth-skel-body  { height: 12px; width: 100%; border-radius: 6px; margin-bottom: 6px;
          background: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%);
          background-size: 200% 100%; animation: dth-shimmer 1.4s infinite; }
        .dth-skel-body--short { width: 60%; }
        @keyframes dth-shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        @media (max-width: 1023px) { .dth-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 639px)  { .dth-grid { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) {
          .dth-card--link:hover { transform: none; }
          .dth-skel-icon, .dth-skel-title, .dth-skel-body { animation: none; background: #E2E8F0; }
        }
      `}</style>
    </section>
  );
}
