import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ManageExecutives() {
  const [items, setItems] = useState([]);
  const [administrations, setAdministrations] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
    image_url: "",
    email: "",
    phone: "",
    order_index: 0,
    administration_id: "",
  });

  const load = async () => {
    const { data } = await supabase
      .from("executives")
      .select("*")
      .order("order_index");
    setItems(data || []);

    const { data: admins } = await supabase
      .from("administrations")
      .select("id, session_label, administration_name")
      .order("start_date", { ascending: false });
    setAdministrations(admins || []);

    // Default to the current administration
    if (admins && admins.length > 0 && !form.administration_id) {
      const current = admins.find((a) => a.is_current) || admins[0];
      setForm((f) => ({ ...f, administration_id: current.id }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const uploadImage = async (file) => {
    if (!file) return null;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `exec-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);
    setUploading(false);
    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      return null;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const url = await uploadImage(file);
    if (url) setForm({ ...form, image_url: url });
  };

  const add = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      administration_id: form.administration_id || null,
    };
    const { error } = await supabase.from("executives").insert([payload]);
    if (error) return alert(error.message);
    setForm({
      name: "",
      position: "",
      level: "",
      image_url: "",
      email: "",
      phone: "",
      order_index: 0,
      administration_id: form.administration_id,
    });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Remove this executive?")) return;
    await supabase.from("executives").delete().eq("id", id);
    load();
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card p-5 grid md:grid-cols-2 gap-3">
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
            </option>
          ))}
        </select>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo
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
            {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="btn-primary md:col-span-2"
        >
          {uploading ? "Uploading..." : "Add Executive"}
        </button>
      </form>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No executives yet.</p>
        ) : (
          items.map((x) => (
            <div
              key={x.id}
              className="card p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {x.image_url ? (
                  <img
                    src={x.image_url}
                    alt={x.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-nacos-gold"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-nacos-blue text-white flex items-center justify-center font-bold">
                    {x.name?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium text-nacos-blue">{x.name}</p>
                  <p className="text-xs text-gray-500">{x.position}</p>
                </div>
              </div>
              <button
                onClick={() => remove(x.id)}
                className="text-red-600 text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
