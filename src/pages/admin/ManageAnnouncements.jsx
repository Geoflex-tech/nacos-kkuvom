import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ManageAnnouncements() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const emptyForm = { title: "", body: "", audience: "all" };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const { data } = await supabase
      .from("announcements")
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
        .from("announcements")
        .update(form)
        .eq("id", editing);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Announcement updated ✅");
      resetForm();
      load();
    } else {
      const { error } = await supabase.from("announcements").insert([form]);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Announcement posted ✅");
      resetForm();
      load();
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title || "",
      body: item.body || "",
      audience: item.audience || "all",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    load();
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const audienceLabel = { all: "Everyone", members: "Members", execs: "Execs" };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-nacos-blue">
            {editing ? "Edit Announcement" : "Post Announcement"}
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
          placeholder="Announcement title"
          value={form.title}
          onChange={update("title")}
          required
        />

        <textarea
          className="input"
          placeholder="Body content"
          rows="5"
          value={form.body}
          onChange={update("body")}
          required
        />

        <select
          className="input"
          value={form.audience}
          onChange={update("audience")}
        >
          <option value="all">Everyone (public members)</option>
          <option value="members">Members only</option>
          <option value="execs">Execs only</option>
        </select>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving
            ? "Saving..."
            : editing
            ? "Save Changes"
            : "Post Announcement"}
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

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No announcements yet.</p>
        ) : (
          items.map((a) => (
            <div
              key={a.id}
              className={`card p-4 flex items-start justify-between gap-4 ${
                editing === a.id ? "ring-2 ring-nacos-blue" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-medium text-nacos-blue truncate">
                    {a.title}
                  </p>
                  <span
                    className={`badge ${
                      a.audience === "all"
                        ? "bg-blue-50 text-blue-700"
                        : a.audience === "members"
                        ? "bg-green-50 text-green-700"
                        : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    {audienceLabel[a.audience] || a.audience}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(a.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {a.body}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => edit(a)}
                  className="text-nacos-blue hover:text-nacos-green transition"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => remove(a.id)}
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