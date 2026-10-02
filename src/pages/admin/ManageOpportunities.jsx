import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const CATEGORIES = [
  "scholarship", "internship", "siwes", "hackathon", "competition",
  "fellowship", "job", "training", "event",
];

export default function ManageOpportunities() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "", organization: "", description: "", category: "scholarship",
    location: "", deadline: "", apply_url: "", eligibility: "", benefits: "",
    is_featured: false, status: "open",
  });

  const load = async () => {
    const { data } = await supabase
      .from("opportunities")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });
    setItems(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      title: "", organization: "", description: "", category: "scholarship",
      location: "", deadline: "", apply_url: "", eligibility: "", benefits: "",
      is_featured: false, status: "open",
    });
    setEditing(null);
    setMessage("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    const payload = {
      ...form,
      deadline: form.deadline || null,
      apply_url: form.apply_url || null,
    };

    if (editing) {
      const { error } = await supabase
        .from("opportunities")
        .update(payload)
        .eq("id", editing);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Updated successfully");
      resetForm();
      load();
    } else {
      const { error } = await supabase.from("opportunities").insert([payload]);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Added successfully");
      resetForm();
      load();
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title || "",
      organization: item.organization || "",
      description: item.description || "",
      category: item.category || "scholarship",
      location: item.location || "",
      deadline: item.deadline || "",
      apply_url: item.apply_url || "",
      eligibility: item.eligibility || "",
      benefits: item.benefits || "",
      is_featured: item.is_featured || false,
      status: item.status || "open",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this opportunity?")) return;
    await supabase.from("opportunities").delete().eq("id", id);
    load();
  };

  const toggleFeatured = async (item) => {
    await supabase
      .from("opportunities")
      .update({ is_featured: !item.is_featured })
      .eq("id", item.id);
    load();
  };

  const toggleStatus = async (item) => {
    await supabase
      .from("opportunities")
      .update({ status: item.status === "open" ? "closed" : "open" })
      .eq("id", item.id);
    load();
  };

  const update = (key, value) => setForm({ ...form, [key]: value });

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={submit} className="card p-5 space-y-3">
        <h3 className="font-bold text-nacos-blue text-lg">
          {editing ? "Edit Opportunity" : "Add Opportunity"}
        </h3>

        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="input md:col-span-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Organization"
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
          />
          <select
            className="input"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Location"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />
          <input
            type="date"
            className="input"
            value={form.deadline}
            onChange={(e) => update("deadline", e.target.value)}
          />
          <input
            className="input md:col-span-2"
            placeholder="Apply URL (https://...)"
            value={form.apply_url}
            onChange={(e) => update("apply_url", e.target.value)}
          />
          <textarea
            className="input md:col-span-2"
            placeholder="Description"
            rows="3"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
          <textarea
            className="input md:col-span-2"
            placeholder="Eligibility requirements"
            rows="2"
            value={form.eligibility}
            onChange={(e) => update("eligibility", e.target.value)}
          />
          <input
            className="input md:col-span-2"
            placeholder="Benefits"
            value={form.benefits}
            onChange={(e) => update("benefits", e.target.value)}
          />
          <select
            className="input"
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => update("is_featured", e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-700">Feature on top</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            {editing ? "Save Changes" : "Add Opportunity"}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="btn-outline">
              Cancel
            </button>
          )}
        </div>

        {message && (
          <p className={`text-sm ${message.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </form>

      {/* List */}
      <div>
        <h3 className="font-bold text-nacos-blue mb-3">
          All Opportunities ({items.length})
        </h3>
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">No opportunities yet.</p>
          ) : (
            items.map((o) => (
              <div
                key={o.id}
                className="card p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-semibold">
                      {o.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        o.status === "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {o.status}
                    </span>
                    {o.is_featured && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-semibold">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-nacos-blue">{o.title}</p>
                  <p className="text-xs text-gray-500">
                    {o.organization}
                    {o.deadline && ` · Deadline ${new Date(o.deadline).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(o)}
                    className="text-xs text-amber-600 font-semibold hover:underline"
                  >
                    {o.is_featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleStatus(o)}
                    className="text-xs text-nacos-blue font-semibold hover:underline"
                  >
                    {o.status === "open" ? "Close" : "Open"}
                  </button>
                  <button
                    type="button"
                    onClick={() => edit(o)}
                    className="text-xs text-green-600 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(o.id)}
                    className="text-xs text-red-600 font-semibold hover:underline"
                  >
                    Delete
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