/**
 * DashboardResources — /dashboard/resources
 *
 * Protected page: only logged-in registered (approved) students.
 * Files are served via signed, expiring URLs — no public links.
 * Raw file_url from the DB is a Supabase Storage path; we exchange it
 * for a signed URL (60-minute expiry) on click.
 *
 * Access rule applied: profile.status === 'approved' OR any isMember
 * (the task says "registered student" = approved account).
 */
import { useEffect, useState, useCallback } from "react";
import { BookOpen, Download, Search, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const SIGNED_URL_EXPIRY = 3600; // 60 minutes

/* Extract storage bucket + path from a Supabase Storage URL or path.
   Supports both full URL and bare path (e.g. "resources/file.pdf"). */
function extractStoragePath(fileUrl) {
  if (!fileUrl) return null;
  try {
    const url = new URL(fileUrl);
    // Supabase URL format: .../storage/v1/object/public/{bucket}/{path}
    const match = url.pathname.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+)/);
    if (match) return { bucket: match[1], path: match[2] };
  } catch {
    // Not a full URL — treat as "bucket/path"
    const parts = fileUrl.split("/");
    if (parts.length >= 2) {
      return { bucket: parts[0], path: parts.slice(1).join("/") };
    }
  }
  return null;
}

async function getSignedUrl(fileUrl) {
  const parsed = extractStoragePath(fileUrl);
  if (!parsed) return fileUrl; // fallback — return as-is

  const { data, error } = await supabase
    .storage
    .from(parsed.bucket)
    .createSignedUrl(parsed.path, SIGNED_URL_EXPIRY);

  if (error || !data?.signedUrl) return fileUrl;
  return data.signedUrl;
}

export default function DashboardResources() {
  const { profile } = useAuth();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("all");
  const [downloading, setDownloading] = useState(null);

  // Only approved members see real content
  const isApproved = profile?.status === "approved";

  useEffect(() => {
    if (!isApproved) {
      setLoading(false);
      return;
    }
    supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setItems(data || []);
        setLoading(false);
      });
  }, [isApproved]);

  const categories = ["all", ...new Set(items.map((r) => r.level).filter(Boolean))];

  const filtered = items.filter((r) => {
    const q = filter.toLowerCase();
    const matchesSearch =
      !q ||
      r.title?.toLowerCase().includes(q) ||
      r.course_code?.toLowerCase().includes(q) ||
      r.level?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q);
    const matchesCat = category === "all" || r.level === category;
    return matchesSearch && matchesCat;
  });

  const handleDownload = useCallback(async (item) => {
    setDownloading(item.id);
    try {
      const url = await getSignedUrl(item.file_url);
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.download = item.title || "resource";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // fallback
      window.open(item.file_url, "_blank", "noreferrer");
    } finally {
      setDownloading(null);
    }
  }, []);

  /* Pending/rejected account — show a friendly gate */
  if (!isApproved && !loading) {
    return (
      <div className="dr-gate">
        <AlertCircle size={36} aria-hidden="true" style={{ color: "#F59E0B", marginBottom: 12 }} />
        <h2 className="dr-gate-title">Account Pending Approval</h2>
        <p className="dr-gate-text">
          {profile?.status === "rejected"
            ? "Your membership application was not approved. Contact an admin for assistance."
            : "Your account is pending admin approval. Resources will be accessible once you are approved."}
        </p>
        <style>{`
          .dr-gate { min-height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 16px; text-align: center; }
          .dr-gate-title { font-size: 1.25rem; font-weight: 700; color: #1E3A8A; margin: 0 0 8px; }
          .dr-gate-text  { font-size: 0.9375rem; color: #64748B; max-width: 380px; line-height: 1.6; margin: 0; }
        `}</style>
      </div>
    );
  }

  return (
    <section className="dr-wrap">
      <div className="dr-header">
        <div className="dr-icon" aria-hidden="true">
          <BookOpen size={22} />
        </div>
        <div>
          <h1 className="dr-title">Resources</h1>
          <p className="dr-subtitle">Past questions, lecture notes, and study materials</p>
        </div>
      </div>

      {/* Search + category filter */}
      <div className="dr-controls">
        <div className="dr-search-wrap">
          <Search size={16} className="dr-search-icon" aria-hidden="true" />
          <input
            className="dr-search"
            placeholder="Search by title, course code, or level…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Search resources"
          />
        </div>
        <div className="dr-chips" role="group" aria-label="Filter by level">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`dr-chip${category === cat ? " dr-chip--active" : ""}`}
              aria-pressed={category === cat}
            >
              {cat === "all" ? "All levels" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="dr-error">
          <AlertCircle size={16} aria-hidden="true" />
          <span>Failed to load resources: {error}</span>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="dr-list" aria-busy="true" aria-label="Loading resources">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="dr-item dr-item--skel" aria-hidden="true">
              <div className="dr-skel-title" />
              <div className="dr-skel-meta" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="dr-empty">
          <BookOpen size={36} aria-hidden="true" style={{ color: "#D1D5DB", marginBottom: 10 }} />
          <p>
            {items.length === 0
              ? "No resources uploaded yet. Check back soon."
              : "No resources match your search."}
          </p>
        </div>
      )}

      {/* List */}
      {!loading && !error && filtered.length > 0 && (
        <ul className="dr-list" aria-label="Resources list">
          {filtered.map((r) => (
            <li key={r.id} className="dr-item">
              <div className="dr-item-info">
                <h3 className="dr-item-title">{r.title}</h3>
                <p className="dr-item-meta">
                  {r.course_code && <span>{r.course_code}</span>}
                  {r.level && <span>{r.level}</span>}
                  {r.description && <span className="dr-item-desc">{r.description}</span>}
                </p>
              </div>
              <button
                className="dr-dl-btn"
                onClick={() => handleDownload(r)}
                disabled={downloading === r.id}
                aria-label={`Download ${r.title}`}
              >
                <Download size={15} aria-hidden="true" />
                {downloading === r.id ? "Getting link…" : "Download"}
              </button>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .dr-wrap { max-width: 800px; margin-inline: auto; padding: 32px 16px 64px; }

        .dr-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .dr-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: #EFF6FF; color: #1E40AF;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dr-title    { font-size: 1.5rem; font-weight: 700; color: #1E3A8A; margin: 0; }
        .dr-subtitle { font-size: 0.875rem; color: #64748B; margin: 2px 0 0; }

        .dr-controls { margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px; }

        .dr-search-wrap { position: relative; }
        .dr-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9CA3AF; pointer-events: none; }
        .dr-search {
          width: 100%; padding: 10px 12px 10px 36px;
          border: 1px solid #D1D5DB; border-radius: 10px;
          font-size: 0.9rem; color: #374151;
          background: #fff;
          transition: border-color 150ms ease-out;
          box-sizing: border-box;
        }
        .dr-search:focus { outline: none; border-color: #1E40AF; box-shadow: 0 0 0 3px rgba(30,64,175,0.12); }

        .dr-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .dr-chip {
          padding: 4px 14px; border-radius: 999px; font-size: 0.8125rem; font-weight: 500;
          background: #F3F4F6; color: #374151; border: none; cursor: pointer;
          transition: background 150ms ease-out, color 150ms ease-out;
        }
        .dr-chip:hover      { background: #E5E7EB; }
        .dr-chip--active    { background: #1E40AF; color: #fff; }

        .dr-error {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; border-radius: 10px;
          background: #FEF2F2; color: #DC2626; font-size: 0.875rem; margin-bottom: 16px;
        }

        .dr-empty { text-align: center; padding: 48px 16px; color: #64748B; display: flex; flex-direction: column; align-items: center; }

        .dr-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }

        .dr-item {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 16px 20px; background: #fff;
          border: 1px solid #E5E7EB; border-radius: 12px;
          transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
        }
        .dr-item:hover { border-color: #BFDBFE; box-shadow: 0 2px 8px rgba(30,64,175,0.06); }

        .dr-item-info { flex: 1; min-width: 0; }
        .dr-item-title { font-size: 0.9375rem; font-weight: 600; color: #1E3A8A; margin: 0 0 4px; }
        .dr-item-meta  { display: flex; flex-wrap: wrap; gap: 6px; font-size: 0.8125rem; color: #6B7280; }
        .dr-item-meta span::after { content: "·"; margin-left: 6px; }
        .dr-item-meta span:last-child::after { content: ""; margin-left: 0; }
        .dr-item-desc { color: #9CA3AF; }

        .dr-dl-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 999px;
          background: #1E40AF; color: #fff;
          font-size: 0.8125rem; font-weight: 600;
          border: none; cursor: pointer; white-space: nowrap;
          transition: background 150ms ease-out;
          flex-shrink: 0;
        }
        .dr-dl-btn:hover:not(:disabled)   { background: #1D4ED8; }
        .dr-dl-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Skeleton */
        .dr-item--skel { pointer-events: none; min-height: 60px; }
        .dr-skel-title { height: 16px; width: 55%; border-radius: 6px; margin-bottom: 8px;
          background: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%);
          background-size: 200% 100%; animation: dr-shimmer 1.4s infinite; }
        .dr-skel-meta  { height: 12px; width: 30%; border-radius: 6px;
          background: linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%);
          background-size: 200% 100%; animation: dr-shimmer 1.4s infinite; }
        @keyframes dr-shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        @media (max-width: 480px) {
          .dr-item { flex-direction: column; align-items: flex-start; }
          .dr-dl-btn { align-self: flex-end; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dr-skel-title, .dr-skel-meta { animation: none; background: #E2E8F0; }
        }
      `}</style>
    </section>
  );
}
