import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ManageResources() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const emptyForm = {
    title: "",
    description: "",
    course_code: "",
    level: "",
    file_url: "",
  };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const { data } = await supabase
      .from("resources")
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

    if (editing) {
      const { error } = await supabase
        .from("resources")
        .update(form)
        .eq("id", editing);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Resource updated ✅");
      resetForm();
      load();
    } else {
      const { error } = await supabase.from("resources").insert([form]);
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
      course_code: item.course_code || "",
      level: item.level || "",
      file_url: item.file_url || "",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this resource?")) return;
    await supabase.from("resources").delete().eq("id", id);
    load();
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card p-5 grid md:grid-cols-2 gap-3">
        <div className="md:col-span-2 flex items-center justify-between">
          <h3 className="font-bold text-nacos-blue">
            {editing ? "Edit Resource" : "Add Resource"}
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
        <input
          className="input"
          placeholder="Course code (e.g. CSC201)"
          value={form.course_code}
          onChange={update("course_code")}
        />
        <input
          className="input"
          placeholder="Level (e.g. 200L)"
          value={form.level}
          onChange={update("level")}
        />
        <input
          className="input md:col-span-2"
          placeholder="File URL (Google Drive, Dropbox, etc.)"
          value={form.file_url}
          onChange={update("file_url")}
          required
        />
        <textarea
          className="input md:col-span-2"
          placeholder="Description"
          rows="2"
          value={form.description}
          onChange={update("description")}
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

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No resources yet.</p>
        ) : (
          items.map((r) => (
            <div
              key={r.id}
              className={`card p-4 flex items-start justify-between gap-4 ${
                editing === r.id ? "ring-2 ring-nacos-blue" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-nacos-blue truncate">
                  {r.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {r.course_code}
                  {r.level ? ` · ${r.level}` : ""}
                </p>
                {r.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {r.description}
                  </p>
                )}
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
  );
}
