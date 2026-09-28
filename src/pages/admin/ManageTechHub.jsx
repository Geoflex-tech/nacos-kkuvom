import { useEffect, useState } from "react";
import { Pencil, Trash2, X, ExternalLink } from "lucide-react";
import { supabase } from "../../lib/supabase";

const CATEGORIES = [
  "programming",
  "web-dev",
  "cybersecurity",
  "data",
  "ai-ml",
  "ui-ux",
  "networking",
  "git",
  "career",
  "mobile",
  "devops",
];

const RESOURCE_TYPES = [
  "course",
  "video",
  "article",
  "docs",
  "book",
  "tool",
  "repo",
  "tutorial",
];

const LEVELS = ["beginner", "intermediate", "advanced", "all"];

export default function ManageTechHub() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    title: "",
    description: "",
    category: "programming",
    resource_type: "course",
    url: "",
    level: "beginner",
    tags: "",
  };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const { data } = await supabase
      .from("tech_hub_resources")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setMessage("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      ...form,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean)
        : [],
    };

    if (editing) {
      const { error } = await supabase
        .from("tech_hub_resources")
        .update(payload)
        .eq("id", editing);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Resource updated ✅");
      resetForm();
      load();
    } else {
      const { error } = await supabase
        .from("tech_hub_resources")
        .insert([payload]);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Resource added ✅");
      resetForm();
      load();
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "programming",
      resource_type: item.resource_type || "course",
      url: item.url || "",
      level: item.level || "beginner",
      tags: (item.tags || []).join(", "),
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this resource?")) return;
    await supabase.from("tech_hub_resources").delete().eq("id", id);
    load();
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const filtered = items.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.title?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q) ||
      (r.tags || []).join(" ").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card p-5 grid md:grid-cols-2 gap-3">
        <div className="md:col-span-2 flex items-center justify-between">
          <h3 className="font-bold text-nacos-blue">
            {editing ? "Edit Tech Hub Resource" : "Add Tech Hub Resource"}
          </h3>
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

        <input
          className="input md:col-span-2"
          placeholder="Resource title"
          value={form.title}
          onChange={update("title")}
          required
        />

        <textarea
          className="input md:col-span-2"
          placeholder="Description — what is this and why is it useful?"
          rows="2"
          value={form.description}
          onChange={update("description")}
        />

        <input
          className="input md:col-span-2"
          placeholder="URL (https://...)"
          type="url"
          value={form.url}
          onChange={update("url")}
          required
        />

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

        <select
          className="input"
          value={form.resource_type}
          onChange={update("resource_type")}
        >
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select className="input" value={form.level} onChange={update("level")}>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Tags (comma-separated: javascript, react)"
          value={form.tags}
          onChange={update("tags")}
        />

        <button
          type="submit"
          disabled={saving}
          className="btn-primary md:col-span-2"
        >
          {saving
            ? "Saving..."
            : editing
            ? "Save Changes"
            : "Add Resource"}
        </button>

        {message && (
          <p
            className={`md:col-span-2 text-sm ${
              message.startsWith("Error") ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-nacos-blue">
            Resources ({items.length})
          </h3>
        </div>

        <input
          className="input mb-3"
          placeholder="Search by title, description, category, tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">
              {items.length === 0
                ? "No resources yet."
                : "No results match your search."}
            </p>
          ) : (
            filtered.map((r) => (
              <div
                key={r.id}
                className={`card p-4 flex items-start justify-between gap-4 ${
                  editing === r.id ? "ring-2 ring-nacos-blue" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="badge bg-nacos-green/10 text-nacos-green">
                      {r.category}
                    </span>
                    {r.level && (
                      <span className="badge bg-gray-100 text-gray-600">
                        {r.level}
                      </span>
                    )}
                    {r.resource_type && (
                      <span className="badge bg-gray-100 text-gray-600">
                        {r.resource_type}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-nacos-blue truncate">
                    {r.title}
                  </p>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-nacos-green hover:underline truncate flex items-center gap-1"
                  >
                    {r.url} <ExternalLink size={10} />
                  </a>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => edit(r)}
                    className="text-nacos-blue hover:text-nacos-green transition"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="text-red-600 hover:text-red-700 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}