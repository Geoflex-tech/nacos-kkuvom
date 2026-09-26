import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ManageResources() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    course_code: "",
    level: "",
    file_url: "",
  });

  const load = async () => {
    const { data } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("resources").insert([form]);
    if (error) return alert(error.message);
    setForm({ title: "", description: "", course_code: "", level: "", file_url: "" });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this resource?")) return;
    await supabase.from("resources").delete().eq("id", id);
    load();
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card p-5 grid md:grid-cols-2 gap-3">
        <input className="input md:col-span-2" placeholder="Resource title" value={form.title} onChange={update("title")} required />
        <input className="input" placeholder="Course code (e.g. CSC201)" value={form.course_code} onChange={update("course_code")} />
        <input className="input" placeholder="Level (e.g. 200L)" value={form.level} onChange={update("level")} />
        <input className="input md:col-span-2" placeholder="File URL (Drive, Dropbox, etc.)" value={form.file_url} onChange={update("file_url")} required />
        <textarea className="input md:col-span-2" placeholder="Description" rows="2" value={form.description} onChange={update("description")} />
        <button className="btn-primary md:col-span-2">Add Resource</button>
      </form>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No resources yet.</p>
        ) : (
          items.map((r) => (
            <div key={r.id} className="card p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-nacos-blue">{r.title}</p>
                <p className="text-xs text-gray-500">
                  {r.course_code} {r.level && `· ${r.level}`}
                </p>
              </div>
              <button onClick={() => remove(r.id)} className="text-red-600 text-sm font-semibold">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}