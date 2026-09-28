import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { compressImage } from "../../utils/compressImage";
export default function ManageExecutives() {
  const [items, setItems] = useState([]);
  const [administrations, setAdministrations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    name: "",
    position: "",
    level: "",
    image_url: "",
    email: "",
    phone: "",
    order_index: 0,
    administration_id: "",
  };

  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const { data } = await supabase
      .from("executives")
      .select("*")
      .order("order_index");
    setItems(data || []);

    const { data: admins } = await supabase
      .from("administrations")
      .select("id, session_label, administration_name, is_current")
      .order("start_date", { ascending: false });
    setAdministrations(admins || []);

    if (admins && admins.length > 0 && !form.administration_id) {
      const current = admins.find((a) => a.is_current) || admins[0];
      setForm((f) => ({ ...f, administration_id: current.id }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    const current = administrations.find((a) => a.is_current) || administrations[0];
    setForm({ ...emptyForm, administration_id: current?.id || "" });
    setEditing(null);
    setMessage("");
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `exec-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });
    setUploading(false);
    if (error) {
      alert("Upload failed: " + error.message);
      return null;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const compressed = await compressImage(file, 800, 0.82);
    const url = await uploadImage(compressed);
    if (url) setForm({ ...form, image_url: url });
  } catch (err) {
    alert("Could not process photo: " + err.message);
  }
};

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      ...form,
      order_index: Number(form.order_index) || 0,
      administration_id: form.administration_id || null,
    };

    if (editing) {
      const { error } = await supabase
        .from("executives")
        .update(payload)
        .eq("id", editing);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Executive updated ✅");
      resetForm();
      load();
    } else {
      const { error } = await supabase.from("executives").insert([payload]);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Executive added ✅");
      resetForm();
      load();
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      name: item.name || "",
      position: item.position || "",
      level: item.level || "",
      image_url: item.image_url || "",
      email: item.email || "",
      phone: item.phone || "",
      order_index: item.order_index || 0,
      administration_id: item.administration_id || "",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Remove this executive?")) return;
    await supabase.from("executives").delete().eq("id", id);
    load();
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card p-5 grid md:grid-cols-2 gap-3">
        <div className="md:col-span-2 flex items-center justify-between">
          <h3 className="font-bold text-nacos-blue">
            {editing ? "Edit Executive" : "Add Executive"}
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
          placeholder="Full name"
          value={form.name}
          onChange={update("name")}
          required
        />
        <input
          className="input"
          placeholder="Position (e.g. President)"
          value={form.position}
          onChange={update("position")}
          required
        />
        <input
          className="input"
          placeholder="Level (e.g. 400L)"
          value={form.level}
          onChange={update("level")}
        />
        <input
          className="input"
          placeholder="Email"
          value={form.email}
          onChange={update("email")}
        />
        <input
          className="input"
          placeholder="Phone"
          value={form.phone}
          onChange={update("phone")}
        />
        <input
          type="number"
          className="input"
          placeholder="Order (0 = first)"
          value={form.order_index}
          onChange={(e) =>
            setForm({ ...form, order_index: Number(e.target.value) })
          }
        />
        <select
          className="input md:col-span-2"
          value={form.administration_id}
          onChange={update("administration_id")}
        >
          <option value="">— Select administration —</option>
          {administrations.map((a) => (
            <option key={a.id} value={a.id}>
              {a.session_label} — {a.administration_name}
              {a.is_current ? " (current)" : ""}
            </option>
          ))}
        </select>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo {editing ? "" : "(recommended)"}
          </label>
          <div className="flex items-center gap-3">
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Preview"
                className="h-14 w-14 rounded-full object-cover border-2 border-nacos-gold"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-nacos-blue file:text-white file:font-semibold hover:file:opacity-90"
            />
            {uploading && (
              <span className="text-xs text-gray-500">Uploading...</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading || saving}
          className="btn-primary md:col-span-2"
        >
          {saving
            ? "Saving..."
            : editing
            ? "Save Changes"
            : "Add Executive"}
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
          <p className="text-gray-500 text-sm">No executives yet.</p>
        ) : (
          items.map((x) => (
            <div
              key={x.id}
              className={`card p-3 flex items-center justify-between gap-4 ${
                editing === x.id ? "ring-2 ring-nacos-blue" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {x.image_url ? (
                  <img
                    src={x.image_url}
                    alt={x.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-nacos-gold shrink-0"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-nacos-blue text-white flex items-center justify-center font-bold shrink-0">
                    {x.name?.[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-nacos-blue truncate">
                    {x.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {x.position}
                    {x.level ? ` · ${x.level}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => edit(x)}
                  className="text-nacos-blue hover:text-nacos-green transition"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => remove(x.id)}
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