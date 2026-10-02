import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Github,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  FolderKanban,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  "web",
  "mobile",
  "ai-ml",
  "cybersecurity",
  "data",
  "ui-ux",
  "game",
  "iot",
  "blockchain",
  "other",
];

const emptyForm = {
  title: "",
  description: "",
  tech_stack: "",
  category: "web",
  team_members: "",
  github_url: "",
  demo_url: "",
  image_url: "",
};

export default function MyProjects() {
  const { session } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    if (!session) return;
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("developer_id", session.user.id)
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [session]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setMessage("");
  };

  const update = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      tech_stack: form.tech_stack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category: form.category,
      team_members: form.team_members
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      github_url: form.github_url.trim() || null,
      demo_url: form.demo_url.trim() || null,
      image_url: form.image_url.trim() || null,
      developer_id: session.user.id,
    };

    if (editing) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editing);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Project updated ✅");
      resetForm();
      load();
    } else {
      const { error } = await supabase.from("projects").insert([payload]);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Project submitted for review ✅");
      resetForm();
      load();
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      tech_stack: (item.tech_stack || []).join(", "),
      category: item.category || "web",
      team_members: (item.team_members || []).join(", "),
      github_url: item.github_url || "",
      demo_url: item.demo_url || "",
      image_url: item.image_url || "",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this project submission?")) return;
    await supabase.from("projects").delete().eq("id", id);
    load();
  };

  const statusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
          <CheckCircle size={12} /> Approved
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
          <XCircle size={12} /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">
        <Clock size={12} /> Pending review
      </span>
    );
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="section-eyebrow">Showcase</p>
        <h1 className="section-title text-2xl md:text-3xl">My Projects</h1>
        <p className="text-gray-500 mt-2">
          Submit your projects to be featured on the public showcase.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="card-flat p-6 space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-nacos-blue text-lg">
            {editing ? "Edit Project" : "Submit a Project"}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-red-600 font-semibold flex items-center gap-1"
            >
              <X size={14} /> Cancel editing
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Title
          </label>
          <input
            className="input"
            placeholder="e.g. NACOS Portal"
            value={form.title}
            onChange={update("title")}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="input"
            placeholder="What does your project do? What problem does it solve?"
            rows="4"
            value={form.description}
            onChange={update("description")}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="input"
              value={form.category}
              onChange={update("category")}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tech Stack
            </label>
            <input
              className="input"
              placeholder="React, Node.js, MongoDB"
              value={form.tech_stack}
              onChange={update("tech_stack")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Members (optional)
          </label>
          <input
            className="input"
            placeholder="Comma-separated names"
            value={form.team_members}
            onChange={update("team_members")}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL (optional)
            </label>
            <input
              className="input"
              placeholder="https://github.com/..."
              value={form.github_url}
              onChange={update("github_url")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Live Demo URL (optional)
            </label>
            <input
              className="input"
              placeholder="https://..."
              value={form.demo_url}
              onChange={update("demo_url")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Screenshot URL (optional)
          </label>
          <input
            className="input"
            placeholder="https://... (image URL)"
            value={form.image_url}
            onChange={update("image_url")}
          />
          <p className="text-xs text-gray-400 mt-1">
            Paste a link to a screenshot image (Imgur, Google Drive direct link, etc.)
          </p>
        </div>

        {message && (
          <p
            className={`text-sm rounded-md p-3 ${
              message.startsWith("Error")
                ? "text-red-600 bg-red-50 border border-red-100"
                : "text-green-600 bg-green-50 border border-green-100"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full py-3 inline-flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          {saving
            ? "Saving..."
            : editing
            ? "Save Changes"
            : "Submit Project"}
        </button>
      </form>

      {/* My submissions */}
      <div>
        <h2 className="font-bold text-nacos-blue text-lg mb-4">
          My Submissions ({items.length})
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : items.length === 0 ? (
          <div className="card-flat p-10 text-center">
            <FolderKanban size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              You haven't submitted any projects yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((p) => (
              <div key={p.id} className="card p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {statusBadge(p.status)}
                      <span className="text-xs bg-blue-50 text-nacos-blue px-2.5 py-1 rounded-full font-semibold">
                        {p.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-nacos-blue text-lg">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                    {p.tech_stack && p.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.tech_stack.map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin notes if rejected */}
                {p.status === "rejected" && p.admin_notes && (
                  <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-3">
                    <p className="text-xs text-red-800">
                      <span className="font-semibold">Admin note: </span>
                      {p.admin_notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-gray-100">
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-600 hover:text-nacos-blue inline-flex items-center gap-1"
                    >
                      <Github size={12} /> GitHub
                    </a>
                  )}
                  {p.demo_url && (
                    <a
                      href={p.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-600 hover:text-nacos-blue inline-flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> Live Demo
                    </a>
                  )}

                  {p.status === "pending" && (
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => edit(p)}
                        className="text-xs text-nacos-blue font-semibold inline-flex items-center gap-1 hover:underline"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="text-xs text-red-600 font-semibold inline-flex items-center gap-1 hover:underline"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}