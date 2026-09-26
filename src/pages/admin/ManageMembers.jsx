import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ManageMembers() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await supabase.from("profiles").update({ status }).eq("id", id);
    load();
  };

  const setRole = async (id, role) => {
    await supabase.from("profiles").update({ role }).eq("id", id);
    load();
  };

  const filtered = items.filter(
    (m) =>
      m.full_name?.toLowerCase().includes(filter.toLowerCase()) ||
      m.matric_no?.toLowerCase().includes(filter.toLowerCase()) ||
      m.email?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        className="input"
        placeholder="Search by name, matric, or email..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Matric</th>
              <th className="p-3">Level</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b">
                <td className="p-3">
                  <p className="font-medium">{m.full_name || "—"}</p>
                  <p className="text-xs text-gray-500">{m.email}</p>
                </td>
                <td className="p-3">{m.matric_no || "—"}</td>
                <td className="p-3">{m.level || "—"}</td>
                <td className="p-3">
                  <select
                    value={m.role}
                    onChange={(e) => setRole(m.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="member">member</option>
                    <option value="exec">exec</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <span
                    className={
                      m.status === "approved"
                        ? "text-green-600"
                        : m.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {m.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  {m.status !== "approved" && (
                    <button
                      onClick={() => setStatus(m.id, "approved")}
                      className="text-xs text-green-600 font-semibold"
                    >
                      Approve
                    </button>
                  )}
                  {m.status !== "rejected" && (
                    <button
                      onClick={() => setStatus(m.id, "rejected")}
                      className="text-xs text-red-600 font-semibold"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center py-6">No members found.</p>
      )}
    </div>
  );
}