import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ManageEvents() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", location: "", event_date: "" });

  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date");
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("events").insert([form]);
    if (error) return alert(error.message);
    setForm({ title: "", description: "", location: "", event_date: "" });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card p-5 space-y-3">
        <input
          className="input"
          placeholder="Event title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="input"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          type="datetime-local"
          className="input"
          value={form.event_date}
          onChange={(e) => setForm({ ...form, event_date: e.target.value })}
          required
        />
        <textarea
          className="input"
          placeholder="Description"
          rows="3"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit" className="btn-primary">Add Event</button>
      </form>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No events yet.</p>
        ) : (
          items.map((ev) => (
            <div key={ev.id} className="card p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-nacos-blue">{ev.title}</p>
                <p className="text-xs text-gray-500">
                  {ev.location} · {new Date(ev.event_date).toLocaleString()}
                </p>
              </div>
              <button onClick={() => remove(ev.id)} className="text-red-600 text-sm font-semibold">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
