import { useEffect, useState } from "react";
import { Pencil, Trash2, X, MapPin, Clock } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ManageEvents() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const emptyForm = {
    title: "",
    description: "",
    location: "",
    event_date: "",
    cover_image: "",
  };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });
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

  const toLocalInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      ...form,
      event_date: form.event_date
        ? new Date(form.event_date).toISOString()
        : null,
    };

    if (editing) {
      const { error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", editing);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Event updated ✅");
      resetForm();
      load();
    } else {
      const { error } = await supabase.from("events").insert([payload]);
      setSaving(false);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Event added ✅");
      resetForm();
      load();
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      location: item.location || "",
      event_date: toLocalInput(item.event_date),
      cover_image: item.cover_image || "",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this event permanently?")) return;
    await supabase.from("events").delete().eq("id", id);
    load();
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const now = new Date();

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-nacos-blue">
            {editing ? "Edit Event" : "Create Event"}
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
          placeholder="Event title"
          value={form.title}
          onChange={update("title")}
          required
        />

        <input
          className="input"
          placeholder="Location (e.g. Main Auditorium, KKU Vom)"
          value={form.location}
          onChange={update("location")}
        />

        <input
          type="datetime-local"
          className="input"
          value={form.event_date}
          onChange={update("event_date")}
          required
        />

        <input
          className="input"
          placeholder="Cover image URL (optional)"
          value={form.cover_image}
          onChange={update("cover_image")}
        />

        <textarea
          className="input"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={update("description")}
        />

        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
        >
          {saving
            ? "Saving..."
            : editing
            ? "Save Changes"
            : "Add Event"}
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
          <p className="text-gray-500 text-sm">No events yet.</p>
        ) : (
          items.map((ev) => {
            const d = new Date(ev.event_date);
            const isPast = d < now;
            return (
              <div
                key={ev.id}
                className={`card p-4 flex items-start justify-between gap-4 ${
                  editing === ev.id ? "ring-2 ring-nacos-blue" : ""
                }`}
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div
                    className={`shrink-0 w-14 text-center rounded-lg overflow-hidden ${
                      isPast ? "bg-gray-100 text-gray-500" : "bg-nacos-blue text-white"
                    }`}
                  >
                    <div
                      className={`text-[10px] uppercase tracking-wide py-1 ${
                        isPast ? "bg-gray-200" : "bg-nacos-blue-dark"
                      }`}
                    >
                      {d.toLocaleString("default", { month: "short" })}
                    </div>
                    <div className="text-xl font-bold py-1">{d.getDate()}</div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-nacos-blue truncate">
                      {ev.title}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {d.toLocaleTimeString("default", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {ev.location && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin size={11} />
                          {ev.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => edit(ev)}
                    className="text-nacos-blue hover:text-nacos-green transition"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => remove(ev.id)}
                    className="text-red-600 hover:text-red-700 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}