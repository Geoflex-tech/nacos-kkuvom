import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ManageAnnouncements() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", body: "", audience: "all" });

  const load = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("announcements").insert([form]);
    if (error) return alert(error.message);
    setForm({ title: "", body: "", audience: "all" });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card p-5 space-y-3">
        <input
          className="input"
          placeholder="Announcement title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="input"
          placeholder="Body"
          rows="4"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          required
        />
        <select
          className="input"
          value={form.audience}
          onChange={(e) => setForm({ ...form, audience: e.target.value })}
        >
          <option value="all">Everyone</option>
          <option value="members">Members only</option>
          <option value="execs">Execs only</option>
        </select>
        <button className="btn-primary">Post Announcement</button>
      </form>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No announcements yet.</p>
        ) : (
          items.map((a) => (
            <div key={a.id} className="card p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-nacos-blue">{a.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(a.created_at).toLocaleString()} · {a.audience}
                </p>
              </div>
              <button onClick={() => remove(a.id)} className="text-red-600 text-sm font-semibold">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
