import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ManageExecutives() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
    image_url: "",
    email: "",
    phone: "",
    order_index: 0,
  });

  const load = async () => {
    const { data } = await supabase.from("executives").select("*").order("order_index");
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("executives").insert([form]);
    if (error) return alert(error.message);
    setForm({ name: "", position: "", level: "", image_url: "", email: "", phone: "", order_index: 0 });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Remove this executive?")) return;
    await supabase.from("executives").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card p-5 grid md:grid-cols-2 gap-3">
        <input
          className="input"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="input"
          placeholder="Position (e.g. President)"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          required
        />
        <input
          className="input"
          placeholder="Level (e.g. 400L)"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
        />
        <input
          className="input"
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />
        <input
          className="input"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="number"
          className="input"
          placeholder="Order (0 = first)"
          value={form.order_index}
          onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })}
        />
        <button type="submit" className="btn-primary md:col-span-2">Add Executive</button>
      </form>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No executives yet.</p>
        ) : (
          items.map((x) => (
            <div key={x.id} className="card p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-nacos-blue">{x.name}</p>
                <p className="text-xs text-gray-500">{x.position}</p>
              </div>
              <button onClick={() => remove(x.id)} className="text-red-600 text-sm font-semibold">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}