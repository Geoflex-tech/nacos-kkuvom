import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  X,
  Plus,
  Star,
  Trophy,
  FolderKanban,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { compressImage } from "../../utils/compressImage";

const PROJECT_STATUSES = ["planned", "in-progress", "completed", "archived"];

export default function ManageAdministrations() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const emptyForm = {
    session_label: "",
    administration_name: "",
    start_date: "",
    end_date: "",
    motto: "",
    description: "",
    cover_image: "",
    achievements: [],
    projects: [],
    legacy_note: "",
  };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const { data } = await supabase
      .from("administrations")
      .select("*")
      .order("start_date", { ascending: false });
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

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // ============ Cover image ============
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage("Compressing image...");
    try {
      const compressed = await compressImage(file, 1400, 0.85);
      const fileName = `admin-cover-${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, compressed, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);
      setForm({ ...form, cover_image: data.publicUrl });
      setMessage("");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
    setUploading(false);
  };

  // ============ Achievements ============
  const addAchievement = () =>
    setForm({
      ...form,
      achievements: [
        ...form.achievements,
        { title: "", description: "", date: "" },
      ],
    });

  const updateAchievement = (index, key, value) => {
    const next = [...form.achievements];
    next[index] = { ...next[index], [key]: value };
    setForm({ ...form, achievements: next });
  };

  const removeAchievement = (index) =>
    setForm({
      ...form,
      achievements: form.achievements.filter((_, i) => i !== index),
    });

  // ============ Projects ============
  const addProject = () =>
    setForm({
      ...form,
      projects: [
        ...form.projects,
        { name: "", description: "", status: "planned", url: "" },
      ],
    });

  const updateProject = (index, key, value) => {
    const next = [...form.projects];
    next[index] = { ...next[index], [key]: value };
    setForm({ ...form, projects: next });
  };

  const removeProject = (index) =>
    setForm({
      ...form,
      projects: form.projects.filter((_, i) => i !== index),
    });

  // ============ Submit ============
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      session_label: form.session_label,
      administration_name: form.administration_name,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      motto: form.motto,
      description: form.description,
      cover_image: form.cover_image || null,
      achievements: form.achievements.filter((a) => a.title.trim()),
      projects: form.projects.filter((p) => p.name.trim()),
      legacy_note: form.legacy_note,
    };

    if (editing) {
      const { error } = await supabase
        .from("administrations")
        .update(payload)
        .eq("id", editing);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Administration updated ✅");
      resetForm();
      load();
    } else {
      const { error } = await supabase
        .from("administrations")
        .insert([payload]);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Administration created ✅");
      resetForm();
      load();
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      session_label: item.session_label || "",
      administration_name: item.administration_name || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      motto: item.motto || "",
      description: item.description || "",
      cover_image: item.cover_image || "",
      achievements: Array.isArray(item.achievements) ? item.achievements : [],
      projects: Array.isArray(item.projects) ? item.projects : [],
      legacy_note: item.legacy_note || "",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setCurrent = async (id) => {
    if (
      !confirm(
        "Make this the current administration? The previous one will be archived."
      )
    )
      return;
    await supabase
      .from("administrations")
      .update({ is_current: false })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("administrations").update({ is_current: true }).eq("id", id);
    setMessage("Current administration updated ✅");
    load();
  };

  const remove = async (id) => {
    if (
      !confirm(
        "Delete this administration? Content linked to it will remain but be unlinked."
      )
    )
      return;
    await supabase.from("administrations").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-nacos-blue text-lg">
            {editing ? "Edit Administration" : "Create New Administration"}
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

        {/* Cover image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image
          </label>
          <div className="flex items-center gap-4">
            {form.cover_image ? (
              <img
                src={form.cover_image}
                alt="Cover"
                className="h-20 w-32 object-cover rounded-lg border-2 border-nacos-gold"
              />
            ) : (
              <div className="h-20 w-32 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                <ImageIcon size={24} />
              </div>
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-nacos-blue bg-nacos-blue/5 hover:bg-nacos-blue/10 px-4 py-2 rounded-lg transition">
              {uploading ? "Uploading..." : "Upload cover"}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Basic fields */}
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="Session (e.g. 2026/2027)"
            value={form.session_label}
            onChange={update("session_label")}
            required
          />
          <input
            className="input"
            placeholder="Administration name (e.g. Pioneer Administration)"
            value={form.administration_name}
            onChange={update("administration_name")}
            required
          />
          <input
            type="date"
            className="input"
            value={form.start_date}
            onChange={update("start_date")}
          />
          <input
            type="date"
            className="input"
            value={form.end_date}
            onChange={update("end_date")}
          />
          <input
            className="input md:col-span-2"
            placeholder="Motto (optional)"
            value={form.motto}
            onChange={update("motto")}
          />
          <textarea
            className="input md:col-span-2"
            placeholder="Description — what was this administration about?"
            rows="3"
            value={form.description}
            onChange={update("description")}
          />
        </div>

        {/* Achievements */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-nacos-gold" />
              <h4 className="font-bold text-nacos-blue">Achievements</h4>
            </div>
            <button
              type="button"
              onClick={addAchievement}
              className="text-xs text-nacos-blue font-semibold flex items-center gap-1 hover:underline"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {form.achievements.length === 0 ? (
            <p className="text-xs text-gray-400 italic">
              No achievements yet. Click "Add" to record milestones.
            </p>
          ) : (
            <div className="space-y-2">
              {form.achievements.map((a, i) => (
                <div
                  key={i}
                  className="grid md:grid-cols-[1fr_2fr_auto_auto] gap-2 items-start bg-gray-50 rounded-lg p-3"
                >
                  <input
                    className="input text-sm"
                    placeholder="Title"
                    value={a.title}
                    onChange={(e) =>
                      updateAchievement(i, "title", e.target.value)
                    }
                  />
                  <input
                    className="input text-sm"
                    placeholder="Description"
                    value={a.description}
                    onChange={(e) =>
                      updateAchievement(i, "description", e.target.value)
                    }
                  />
                  <input
                    type="date"
                    className="input text-sm"
                    value={a.date || ""}
                    onChange={(e) =>
                      updateAchievement(i, "date", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeAchievement(i)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FolderKanban size={16} className="text-nacos-green" />
              <h4 className="font-bold text-nacos-blue">Projects</h4>
            </div>
            <button
              type="button"
              onClick={addProject}
              className="text-xs text-nacos-blue font-semibold flex items-center gap-1 hover:underline"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {form.projects.length === 0 ? (
            <p className="text-xs text-gray-400 italic">
              No projects yet. Click "Add" to record major initiatives.
            </p>
          ) : (
            <div className="space-y-2">
              {form.projects.map((p, i) => (
                <div
                  key={i}
                  className="grid md:grid-cols-[1fr_2fr_auto_1fr_auto] gap-2 items-start bg-gray-50 rounded-lg p-3"
                >
                  <input
                    className="input text-sm"
                    placeholder="Name"
                    value={p.name}
                    onChange={(e) => updateProject(i, "name", e.target.value)}
                  />
                  <input
                    className="input text-sm"
                    placeholder="Description"
                    value={p.description}
                    onChange={(e) =>
                      updateProject(i, "description", e.target.value)
                    }
                  />
                  <select
                    className="input text-sm"
                    value={p.status || "planned"}
                    onChange={(e) => updateProject(i, "status", e.target.value)}
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    className="input text-sm"
                    placeholder="URL (optional)"
                    value={p.url || ""}
                    onChange={(e) => updateProject(i, "url", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeProject(i)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legacy note */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Legacy Note (message to the next administration)
          </label>
          <textarea
            className="input"
            placeholder="A message from this administration to the one that follows..."
            rows="4"
            value={form.legacy_note}
            onChange={update("legacy_note")}
          />
        </div>

        <button type="submit" disabled={saving || uploading} className="btn-primary">
          {saving
            ? "Saving..."
            : editing
            ? "Save Changes"
            : "Create Administration"}
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
          <p className="text-gray-500 text-sm">No administrations yet.</p>
        ) : (
          items.map((a) => (
            <div
              key={a.id}
              className={`card p-4 flex items-start justify-between gap-4 ${
                editing === a.id ? "ring-2 ring-nacos-blue" : ""
              }`}
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {a.cover_image ? (
                  <img
                    src={a.cover_image}
                    alt={a.administration_name}
                    className="h-16 w-24 rounded-lg object-cover border-2 border-nacos-gold shrink-0"
                  />
                ) : (
                  <div className="h-16 w-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                    <ImageIcon size={20} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="badge bg-nacos-blue text-white font-mono">
                      {a.session_label}
                    </span>
                    {a.is_current && (
                      <span className="badge bg-nacos-gold text-nacos-blue">
                        ★ CURRENT
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-nacos-blue truncate">
                    {a.administration_name}
                  </p>
                  {a.motto && (
                    <p className="text-xs italic text-gray-500 truncate">
                      "{a.motto}"
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Trophy size={11} />
                      {Array.isArray(a.achievements)
                        ? a.achievements.length
                        : 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FolderKanban size={11} />
                      {Array.isArray(a.projects) ? a.projects.length : 0}
                    </span>
                    {a.legacy_note && (
                      <span className="flex items-center gap-1 text-nacos-green">
                        <Star size={11} />
                        Legacy set
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-end shrink-0">
                {!a.is_current && (
                  <button
                    onClick={() => setCurrent(a.id)}
                    className="text-xs text-nacos-blue font-semibold hover:underline"
                  >
                    Set Current
                  </button>
                )}
                <button
                  onClick={() => edit(a)}
                  className="text-nacos-blue hover:text-nacos-green transition p-1"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => remove(a.id)}
                  className="text-red-600 hover:text-red-700 transition p-1"
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