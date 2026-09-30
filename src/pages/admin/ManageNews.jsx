import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ManageNews() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    body: "",
    cover_image: "",
    author: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ title: "", slug: "", body: "", cover_image: "", author: "" });
    setEditing(null);
    setMessage("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    if (editing) {
      const { error } = await supabase
        .from("news")
        .update({
          title: form.title,
          slug: form.slug,
          body: form.body,
          cover_image: form.cover_image,
          author: form.author,
        })
        .eq("id", editing);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("News updated ✅");
      resetForm();
      load();
    } else {
      const { error } = await supabase.from("news").insert([form]);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("News published ✅");
      resetForm();
      load();
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      body: item.body || "",
      cover_image: item.cover_image || "",
      author: item.author || "",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this news item permanently?")) return;
    await supabase.from("news").delete().eq("id", id);
    load();
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm({
      ...form,
      title,
      // Only auto-generate slug when creating a new item
      slug: editing
        ? form.slug
        : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    });
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={submit} className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-nacos-blue">
            {editing ? "Edit News Post" : "Create News Post"}
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
          className="input"
          placeholder="Title"
          value={form.title}
          onChange={handleTitleChange}
          required
        />

        <input
          className="input"
          placeholder="Slug (URL-friendly, auto-generated from title)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
        />

        <input
          className="input"
          placeholder="Cover image URL (optional)"
          value={form.cover_image}
          onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
        />

        <input
          className="input"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <textarea
          className="input"
          placeholder="Body content"
          rows="6"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          required
        />

        <button type="submit" disabled={saving} className="btn-primary">
          {saving
            ? "Saving..."
            : editing
            ? "Save Changes"
            : "Publish News"}
        </button>

        {message && (
          <p
            className={`text-sm ${
              message.startsWith("Error") ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      {/* List */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No news yet.</p>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className={`card p-4 flex items-center justify-between gap-4 ${
                editing === n.id ? "ring-2 ring-nacos-blue" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-nacos-blue truncate">
                  {n.title}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(n.published_at).toLocaleDateString()} ·{" "}
                  <span className="font-mono">{n.slug}</span>
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => edit(n)}
                  className="text-nacos-blue hover:text-nacos-green transition"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => remove(n.id)}
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
  );
}
