import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Messages() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">No messages yet.</p>
      ) : (
        items.map((m) => (
          <div key={m.id} className="card p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-nacos-blue">{m.subject || "(no subject)"}</p>
                <p className="text-xs text-gray-500">
                  From {m.name} · {m.email} · {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => remove(m.id)} className="text-red-600 text-xs font-semibold">
                Delete
              </button>
            </div>
            <p className="mt-3 text-gray-700 whitespace-pre-line">{m.message}</p>
          </div>
        ))
      )}
    </div>
  );
}
