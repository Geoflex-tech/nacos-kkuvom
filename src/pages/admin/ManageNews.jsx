import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ManageNews() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", slug: "", body: "", cover_image: "", author: "" });

  const load = async () => {
    const { data } = await supabase.from("news").select("*").order("published_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("news").insert([form]);
    if (error) return alert(error.message);
    setForm({ title: "", slug: "", body: "", cover_image: "", author: "" });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this news item?")) return;
    await supabase.from("news").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card p-5 space-y-3">
        <input
          className="input"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
              slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
            })
          }
          required
        />
        <input
          className="input"
          placeholder="Cover image URL (optional)"
          value={form.cover_image}
          onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
        />
        <input
          className="input"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <textarea
          className="input"
          placeholder="Body"
          rows="4"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          required
        />
        <button type="submit" className="btn-primary">Publish</button>
      </form>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No news yet.</p>
        ) : (
          items.map((n) => (
            <div key={n.id} className="card p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-nacos-blue">{n.title}</p>
                <p className="text-xs text-gray-500">{new Date(n.published_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => remove(n.id)} className="text-red-600 text-sm font-semibold">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
