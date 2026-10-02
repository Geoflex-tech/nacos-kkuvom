import { useEffect, useState } from "react";
import { Pencil, Trash2, X, Star, Search } from "lucide-react";
import { supabase } from "../../lib/supabase";

const CATEGORIES = [
  "scholarship", "internship", "siwes", "hackathon", "competition",
  "fellowship", "job", "training", "event",
];

const emptyForm = {
  title: "", organization: "", description: "", category: "scholarship",
  location: "", deadline: "", apply_url: "", eligibility: "", benefits: "",
  is_featured: false, status: "open",
};

export default function ManageOpportunities() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const { data } = await supabase
      .from("opportunities")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditing(null); setMessage(""); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const payload = {
      ...form,
      deadline: form.deadline || null,
      apply_url: form.apply_url || null,
    };

    if (editing) {
      const { error } = await supabase.from("opportunities").update(payload).eq("id", editing);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Opportunity updated ✅");
      resetForm(); load();
    } else {
      const { error } = await supabase.from("opportunities").insert([payload]);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Opportunity added ✅");
      resetForm(); load();
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title || "", organization: item.organization || "",
      description: item.description || "", category: item.category || "scholarship",
      location: item.location || "", deadline: item.deadline || "",
      apply_url: item.apply_url || "", eligibility: item.eligibility || "",
      benefits: item.benefits || "", is_featured: item.is_featured || false,
      status: item.status || "open",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this opportunity permanently?")) return;
    await supabase.from("opportunities").delete().eq("id", id);
    load();
  };

  const toggleFeatured = async (item) => {
    await supabase.from("opportunities").update({ is_featured: !item.is_featured }).eq("id", item.id);
    load();
  };

  const toggleStatus = async (item) => {
    const next = item.status === "open" ? "closed" : "open";
    await supabase.from("opportunities").update({ status: next }).eq("id", item.id);
    load();
  };

  const update = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [key]: value });
  };

  const filtered = items.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || o.title?.toLowerCase().includes(q) || o.organization?.toLowerCase().includes(q);
    const matchesFilter = filter === "all" || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: items.length,
    open: items.filter((o) => o.status === "open").length,
    closed: items.filter((o) => o.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-nacos-blue text-lg">
            {editing ? "Edit Opportunity" : "Add New Opportunity"}
          </h3>
          {editing && (
            <button type="button" onClick={resetForm} className="text-xs text-red-600 font-semibold flex items-center gap-1">
              <X size={14} /> Cancel editing
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input className="input md:col-span-2" placeholder="Title" value={form.title} onChange={update("title")} required />
          <input className="input" placeholder="Organization" value={form.organization} onChange={update("organization")} />
          <select className="input" value={form.category} onChange={update("category")} required>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="input" placeholder="Location" value={form.location} onChange={update("location")} />
          <input type="date" className="input" value={form.deadline} onChange={update("deadline")} />
          <input className="input md:col-span-2" placeholder="Apply URL (https://...)" type="url" value={form.apply_url} onChange={update("apply_url")} />
          <textarea className="input md:col-span-2" placeholder="Description" rows="3" value={form.description} onChange={update("description")} />
          <textarea className="input md:col-span-2" placeholder="Eligibility requirements" rows="2" value={form.eligibility} onChange={update("eligibility")} />
          <input className="input md:col-span-2" placeholder="Benefits" value={form.benefits} onChange={update("benefits")} />
          <select className="input" value={form.status} onChange={update("status")}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={update("is_featured")} className="h-4 w-4 accent-nacos-gold" />
            <span className="text-sm text-gray-700">Feature on top</span>
          </label>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto">
          {saving ? "Saving..." : editing ? "Save Changes" : "Add Opportunity"}
        </button>

        {message && (
          <p className={`text-sm ${message.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </form>

      <div>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-10" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {[
              { id: "all", label: "All", count: counts.all },
              { id: "open", label: "Open", count: counts.open },
              { id: "closed", label: "Closed", count: counts.closed },
            ].map((f) => (
              <button key={f.id} type="button" onClick={() => setFilter(f.id)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                  filter === f.id ? "bg-nacos-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {f.label}
                <span className={`text-xs ${filter === f.id ? "text-white/70" : "text-gray-500"}`}>{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">{items.length === 0 ? "No opportunities yet." : "No results match."}</p>
          ) : (
            filtered.map((o) => (
              <div key={o.id} className={`card p-4 flex items-start justify-between gap-4 ${editing === o.id ? "ring-2 ring-nacos-blue" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="badge bg-nacos-green/10 text-nacos-green">{o.category}</span>
                    <span className={`badge ${o.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{o.status}</span>
                    {o.is_featured && (
                      <span className="badge bg-nacos-gold text-nacos-blue flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> FEATURED
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-nacos-blue truncate">{o.title}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {o.organization}{o.location ? ` · ${o.location}` : ""}{o.deadline ? ` · Deadline ${new Date(o.deadline).toLocaleDateString()}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={() => toggleFeatured(o)}
                    className={`p-1.5 rounded transition ${o.is_featured ? "text-nacos-gold" : "text-gray-300 hover:text-nacos-gold"}`}>
                    <Star size={16} fill={o.is_featured ? "currentColor" : "none"} />
                  </button>
                  <button type="button" onClick={() => toggleStatus(o)} className="text-xs text-nacos-blue font-semibold hover:underline">
                    {o.status === "open" ? "Close" : "Open"}
                  </button>
                  <button type="button" onClick={() => edit(o)} className="text-nacos-blue hover:text-nacos-green transition p-1">
                    <Pencil size={16} />
                  </button>
                  <button type="button" onClick={() => remove(o.id)} className="text-red-600 hover:text-red-700 transition p-1">
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