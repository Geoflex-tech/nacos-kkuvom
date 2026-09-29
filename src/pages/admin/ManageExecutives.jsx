/**
 * ManageExecutives — admin form for all 13 leadership positions.
 * Supports editing: name, position, rank, tier, status, slug,
 * level, department, bio, social_links, photo, email, phone.
 *
 * Vacant positions: admin fills in name/level/photo/bio and sets
 * status → "filled". The public site updates automatically.
 */
import { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { compressImage } from "../../utils/compressImage";

const TIERS = ["executive", "directors", "discipline"];
const STATUSES = ["filled", "vacant"];

const emptyForm = {
  name:          "",
  position:      "",
  rank:          "",
  tier:          "executive",
  status:        "vacant",
  slug:          "",
  level:         "",
  department:    "",
  bio:           "",
  social_links:  "",   // stored as JSON string in the textarea
  image_url:     "",
  email:         "",
  phone:         "",
  order_index:   0,
  administration_id: "",
};

export default function ManageExecutives() {
  const [items,           setItems]           = useState([]);
  const [administrations, setAdministrations] = useState([]);
  const [editing,         setEditing]         = useState(null);
  const [uploading,       setUploading]       = useState(false);
  const [message,         setMessage]         = useState("");
  const [saving,          setSaving]          = useState(false);
  const [form,            setForm]            = useState(emptyForm);
  const [socialError,     setSocialError]     = useState("");

  /* ── load data ──────────────────────────────────────────── */
  const load = async () => {
    const { data } = await supabase
      .from("executives")
      .select("*")
      .order("rank", { ascending: true });
    setItems(data || []);

    const { data: admins } = await supabase
      .from("administrations")
      .select("id, session_label, administration_name, is_current")
      .order("start_date", { ascending: false });
    setAdministrations(admins || []);

    if (admins?.length && !form.administration_id) {
      const current = admins.find((a) => a.is_current) || admins[0];
      setForm((f) => ({ ...f, administration_id: current.id }));
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  /* ── reset ──────────────────────────────────────────────── */
  const resetForm = () => {
    const current = administrations.find((a) => a.is_current) || administrations[0];
    setForm({ ...emptyForm, administration_id: current?.id || "" });
    setEditing(null);
    setMessage("");
    setSocialError("");
  };

  /* ── photo upload ───────────────────────────────────────── */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.82);
      setUploading(true);
      const ext = file.name.split(".").pop();
      const fileName = `exec-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, compressed, { upsert: true });
      setUploading(false);
      if (error) { alert("Upload failed: " + error.message); return; }
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
    } catch (err) {
      setUploading(false);
      alert("Could not process photo: " + err.message);
    }
  };

  /* ── submit ─────────────────────────────────────────────── */
  const submit = async (e) => {
    e.preventDefault();
    setSocialError("");

    // parse social_links JSON
    let social_links = null;
    if (form.social_links?.trim()) {
      try {
        social_links = JSON.parse(form.social_links);
      } catch {
        setSocialError("Social links must be valid JSON, e.g. {\"twitter\":\"https://...\"} or leave blank.");
        return;
      }
    }

    setSaving(true);
    setMessage("");

    const payload = {
      name:             form.name.trim()         || null,
      position:         form.position.trim(),
      rank:             form.rank !== "" ? Number(form.rank) : null,
      tier:             form.tier             || null,
      status:           form.status,
      slug:             form.slug.trim()         || null,
      level:            form.level.trim()        || null,
      department:       form.department.trim()   || null,
      bio:              form.bio.trim()          || null,
      social_links:     social_links,
      image_url:        form.image_url           || null,
      email:            form.email.trim()        || null,
      phone:            form.phone.trim()        || null,
      order_index:      Number(form.order_index) || 0,
      administration_id: form.administration_id  || null,
    };

    if (editing) {
      const { error } = await supabase.from("executives").update(payload).eq("id", editing);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Saved ✅");
      resetForm();
      load();
    } else {
      const { error } = await supabase.from("executives").insert([payload]);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Added ✅");
      resetForm();
      load();
    }
  };

  /* ── edit row ───────────────────────────────────────────── */
  const edit = (item) => {
    setEditing(item.id);
    setForm({
      name:             item.name          || "",
      position:         item.position      || "",
      rank:             item.rank          ?? "",
      tier:             item.tier          || "executive",
      status:           item.status        || "vacant",
      slug:             item.slug          || "",
      level:            item.level         || "",
      department:       item.department    || "",
      bio:              item.bio           || "",
      social_links:     item.social_links  ? JSON.stringify(item.social_links, null, 2) : "",
      image_url:        item.image_url     || "",
      email:            item.email         || "",
      phone:            item.phone         || "",
      order_index:      item.order_index   ?? 0,
      administration_id: item.administration_id || "",
    });
    setMessage("");
    setSocialError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const upd = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  /* ── tier label ─────────────────────────────────────────── */
  const tierBadge = (tier) => {
    if (!tier) return null;
    const map = { executive: "bg-blue-50 text-blue-700", directors: "bg-green-50 text-green-700", discipline: "bg-amber-50 text-amber-700" };
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${map[tier] || ""}`}>
        {tier}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Form ── */}
      <form onSubmit={submit} className="card p-5 grid md:grid-cols-2 gap-3">
        <div className="md:col-span-2 flex items-center justify-between">
          <h3 className="font-bold text-nacos-blue">
            {editing ? "Edit Position" : "Add Position"}
          </h3>
          {editing && (
            <button type="button" onClick={resetForm}
              className="text-xs text-red-600 font-semibold flex items-center gap-1">
              <X size={14} /> Cancel
            </button>
          )}
        </div>

        {/* Name — only required when status=filled */}
        <input className="input" placeholder="Full name (leave blank if vacant)"
          value={form.name} onChange={upd("name")} />

        <input className="input" placeholder="Position title *" required
          value={form.position} onChange={upd("position")} />

        <input type="number" min="1" max="13" className="input" placeholder="Rank (1–13)"
          value={form.rank} onChange={upd("rank")} />

        <select className="input" value={form.tier} onChange={upd("tier")} required>
          <option value="">— Tier —</option>
          {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select className="input" value={form.status} onChange={upd("status")} required>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <input className="input" placeholder="Slug (e.g. president)"
          value={form.slug} onChange={upd("slug")} />

        <input className="input" placeholder="Level (e.g. 400L)"
          value={form.level} onChange={upd("level")} />

        <input className="input" placeholder="Department (optional)"
          value={form.department} onChange={upd("department")} />

        <input className="input" placeholder="Email (optional)"
          value={form.email} onChange={upd("email")} />

        <input className="input" placeholder="Phone (optional)"
          value={form.phone} onChange={upd("phone")} />

        <input type="number" className="input" placeholder="Order index (for tie-breaking)"
          value={form.order_index}
          onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} />

        <select className="input" value={form.administration_id} onChange={upd("administration_id")} required>
          <option value="">— Administration —</option>
          {administrations.map((a) => (
            <option key={a.id} value={a.id}>
              {a.session_label} — {a.administration_name}
              {a.is_current ? " (current)" : ""}
            </option>
          ))}
        </select>

        {/* Bio — full width */}
        <textarea className="input md:col-span-2" rows={4}
          placeholder="Bio text (leave blank to show 'Bio coming soon')"
          value={form.bio} onChange={upd("bio")} style={{ resize: "vertical" }} />

        {/* Social links JSON — full width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Social links (JSON, optional)
          </label>
          <textarea className="input" rows={3}
            placeholder={'e.g. {"twitter":"https://x.com/handle","linkedin":"https://linkedin.com/in/..."}'}
            value={form.social_links} onChange={upd("social_links")}
            style={{ resize: "vertical", fontFamily: "monospace", fontSize: "12px" }} />
          {socialError && <p className="text-red-500 text-xs mt-1">{socialError}</p>}
        </div>

        {/* Photo upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <div className="flex items-center gap-3">
            {form.image_url && (
              <img src={form.image_url} alt="Preview"
                className="h-14 w-14 rounded-full object-cover border-2 border-nacos-gold shrink-0" />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-nacos-blue file:text-white file:font-semibold hover:file:opacity-90" />
            {uploading && <span className="text-xs text-gray-500 shrink-0">Uploading…</span>}
          </div>
        </div>

        <button type="submit" disabled={uploading || saving} className="btn-primary md:col-span-2">
          {saving ? "Saving…" : editing ? "Save Changes" : "Add Position"}
        </button>

        {message && (
          <p className={`md:col-span-2 text-sm ${message.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </form>

      {/* ── Positions list ── */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No positions yet. Run the migration SQL first.</p>
        ) : (
          items.map((x) => (
            <div key={x.id}
              className={`card p-3 flex items-center justify-between gap-4 ${editing === x.id ? "ring-2 ring-nacos-blue" : ""}`}>
              <div className="flex items-center gap-3 min-w-0">
                {x.image_url ? (
                  <img src={x.image_url} alt={x.name || x.position}
                    className="h-10 w-10 rounded-full object-cover border-2 border-nacos-gold shrink-0" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs shrink-0">
                    {x.rank || "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-nacos-blue truncate">
                    {x.name || <span className="text-gray-400 italic">Vacant</span>}
                  </p>
                  <p className="text-xs text-gray-500 truncate flex items-center gap-1 flex-wrap">
                    <span>#{x.rank}</span>
                    <span>·</span>
                    <span>{x.position}</span>
                    {x.tier && <>{" · "}{tierBadge(x.tier)}</>}
                    <span className={`ml-1 text-xs font-semibold ${x.status === "filled" ? "text-green-600" : "text-amber-600"}`}>
                      [{x.status}]
                    </span>
                  </p>
                </div>
              </div>
              <button onClick={() => edit(x)}
                className="text-nacos-blue hover:text-nacos-green transition shrink-0"
                title="Edit this position">
                <Pencil size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
