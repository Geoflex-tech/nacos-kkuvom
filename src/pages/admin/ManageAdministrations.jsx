import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ManageAdministrations() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    session_label: "",
    administration_name: "",
    start_date: "",
    end_date: "",
    motto: "",
    description: "",
  });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("administrations")
      .select("*")
      .order("start_date", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => {
    load();
  }, []);

  const resetForm = () =>
    setForm({
      session_label: "",
      administration_name: "",
      start_date: "",
      end_date: "",
      motto: "",
      description: "",
    });

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (editing) {
      const { error } = await supabase
        .from("administrations")
        .update(form)
        .eq("id", editing);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Administration updated ✅");
      setEditing(null);
    } else {
      const { error } = await supabase.from("administrations").insert([form]);
      if (error) return setMessage("Error: " + error.message);
      setMessage("Administration created ✅");
    }

    resetForm();
    load();
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      session_label: item.session_label || "",
      administration_name: item.administration_name || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      motto: item.motto || "",
      description: item.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditing(null);
    resetForm();
  };

  const setCurrent = async (id) => {
    if (!confirm("Make this the current administration? The previous one will be archived.")) return;
    await supabase.from("administrations").update({ is_current: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("administrations").update({ is_current: true }).eq("id", id);
    setMessage("Current administration updated ✅");
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this administration? Content linked to it will remain but be unlinked.")) return;
    await supabase.from("administrations").delete().eq("id", id);
    load();
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card p-5 grid md:grid-cols-2 gap-3">
        <h3 className="md:col-span-2 font-bold text-nacos-blue">
          {editing ? "Edit Administration" : "Create New Administration"}
        </h3>

        <input
          className="input"
          placeholder="Session (e.g. 2027/2028)"
          value={form.session_label}
          onChange={update("session_label")}
          required
        />
        <input
          className="input"
          placeholder="Administration name (e.g. Second Administration)"
          value={form.administration_name}
          onChange={update("administration_name")}
          required
        />
        <input
          type="date"
          className="input"
          placeholder="Start date"
          value={form.start_date}
          onChange={update("start_date")}
        />
        <input
          type="date"
          className="input"
          placeholder="End date"
          value={form.end_date}
          onChange={update("end_date")}
        />
        <input
          className="input md:col-span-2"
          placeholder="Motto (optional)"
          value={form.motto}
          onChange={update("motto")}
        />
        <textarea
          className="input md:col-span-2"
          placeholder="Description"
          rows="3"
          value={form.description}
          onChange={update("description")}
        />

        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="btn-primary">
            {editing ? "Save Changes" : "Create Administration"}
          </button>
          {editing && (
            <button type="button" onClick={cancelEdit} className="btn-outline">
              Cancel
            </button>
          )}
        </div>

        {message && (
          <p
            className={`md:col-span-2 text-sm ${
              message.startsWith("Error") ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No administrations yet.</p>
        ) : (
          items.map((a) => (
            <div key={a.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="bg-nacos-blue text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {a.session_label}
                    </span>
                    {a.is_current && (
                      <span className="bg-nacos-gold text-nacos-blue text-xs font-bold px-2 py-0.5 rounded-full">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-nacos-blue">{a.administration_name}</p>
                  {a.motto && (
                    <p className="text-sm italic text-gray-500 mt-0.5">"{a.motto}"</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  {!a.is_current && (
                    <button
                      onClick={() => setCurrent(a.id)}
                      className="text-xs text-nacos-blue font-semibold hover:underline"
                    >
                      Set Current
                    </button>
                  )}
                  <button
                    onClick={() => edit(a)}
                    className="text-xs text-nacos-green font-semibold hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    className="text-xs text-red-600 font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
