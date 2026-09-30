import { useEffect, useState } from "react";
import { Search, CheckCircle, XCircle, Shield, Users } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ManageMembers() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    await supabase.from("profiles").update({ status }).eq("id", id);
    load();
  };

  const setRole = async (id, role) => {
    if (
      !confirm(
        `Change this member's role to "${role}"? This affects their admin permissions.`
      )
    )
      return;
    await supabase.from("profiles").update({ role }).eq("id", id);
    load();
  };

  const filtered = items.filter((m) => {
    const q = filter.toLowerCase();
    const matchesSearch =
      m.full_name?.toLowerCase().includes(q) ||
      m.matric_no?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: items.length,
    approved: items.filter((m) => m.status === "approved").length,
    pending: items.filter((m) => m.status === "pending").length,
    rejected: items.filter((m) => m.status === "rejected").length,
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="input pl-10"
            placeholder="Search by name, matric, or email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { id: "all", label: "All", count: counts.all },
            { id: "approved", label: "Approved", count: counts.approved },
            { id: "pending", label: "Pending", count: counts.pending },
            { id: "rejected", label: "Rejected", count: counts.rejected },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                statusFilter === f.id
                  ? "bg-nacos-blue text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
              <span
                className={`text-xs ${
                  statusFilter === f.id ? "text-white/70" : "text-gray-500"
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading / empty states */}
      {loading ? (
        <p className="text-center text-gray-500 py-12">Loading members...</p>
      ) : filtered.length === 0 ? (
        <div className="card-flat p-10 text-center">
          <Users size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {items.length === 0
              ? "No members yet."
              : "No members match your filters."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block card-flat overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="p-4 font-semibold">Member</th>
                    <th className="p-4 font-semibold">Level</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr
                      key={m.id}
                      className="border-t border-gray-100 hover:bg-gray-50/50 transition"
                    >
                      {/* Member cell with avatar */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {m.avatar_url ? (
                            <img
                              src={m.avatar_url}
                              alt={m.full_name || "Member"}
                              className="h-11 w-11 rounded-full object-cover border-2 border-nacos-gold shrink-0"
                            />
                          ) : (
                            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-nacos-blue to-nacos-green text-white flex items-center justify-center text-sm font-bold shrink-0 border-2 border-nacos-gold">
                              {(m.full_name || m.email || "?")[0].toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-nacos-blue truncate">
                              {m.full_name || "—"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {m.email}
                            </p>
                            {m.matric_no && (
                              <p className="text-xs text-gray-400 font-mono truncate">
                                {m.matric_no}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Level */}
                      <td className="p-4 text-gray-700">
                        {m.level || "—"}
                      </td>

                      {/* Role */}
                      <td className="p-4">
                        <select
                          value={m.role || "member"}
                          onChange={(e) => setRole(m.id, e.target.value)}
                          className={`text-xs font-semibold border rounded-md px-2 py-1 cursor-pointer transition ${
                            m.role === "president" || m.role === "super_admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : m.role === "secretary" || m.role === "treasurer" || m.role === "ict" || m.role === "exec"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          <option value="member">member</option>
                          <option value="exec">exec</option>
                          <option value="secretary">secretary</option>
                          <option value="treasurer">treasurer</option>
                          <option value="ict">ict</option>
                          <option value="president">president</option>
                          <option value="super_admin">super_admin</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`badge ${
                            m.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : m.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {m.status || "pending"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 justify-end">
                          {m.status !== "approved" && (
                            <button
                              onClick={() => setStatus(m.id, "approved")}
                              className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-semibold px-2 py-1 rounded-md hover:bg-green-50 transition"
                              title="Approve"
                            >
                              <CheckCircle size={14} />
                              Approve
                            </button>
                          )}
                          {m.status !== "rejected" && (
                            <button
                              onClick={() => setStatus(m.id, "rejected")}
                              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded-md hover:bg-red-50 transition"
                              title="Reject"
                            >
                              <XCircle size={14} />
                              Reject
                            </button>
                          )}
                          {m.status === "approved" && (
                            <span className="text-xs text-gray-400 italic">
                              Active
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((m) => (
              <div key={m.id} className="card p-4">
                <div className="flex items-start gap-3">
                  {m.avatar_url ? (
                    <img
                      src={m.avatar_url}
                      alt={m.full_name || "Member"}
                      className="h-14 w-14 rounded-full object-cover border-2 border-nacos-gold shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-nacos-blue to-nacos-green text-white flex items-center justify-center text-lg font-bold shrink-0 border-2 border-nacos-gold">
                      {(m.full_name || m.email || "?")[0].toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-nacos-blue truncate">
                      {m.full_name || "—"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{m.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.matric_no && (
                        <span className="text-xs text-gray-600 font-mono">
                          {m.matric_no}
                        </span>
                      )}
                      {m.level && (
                        <span className="badge bg-gray-100 text-gray-600">
                          {m.level}
                        </span>
                      )}
                      <span
                        className={`badge ${
                          m.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : m.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {m.status || "pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-gray-400 shrink-0" />
                    <select
                      value={m.role || "member"}
                      onChange={(e) => setRole(m.id, e.target.value)}
                      className="text-xs border rounded-md px-2 py-1 flex-1"
                    >
                      <option value="member">member</option>
                      <option value="exec">exec</option>
                      <option value="secretary">secretary</option>
                      <option value="treasurer">treasurer</option>
                      <option value="ict">ict</option>
                      <option value="president">president</option>
                      <option value="super_admin">super_admin</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    {m.status !== "approved" && (
                      <button
                        onClick={() => setStatus(m.id, "approved")}
                        className="flex-1 inline-flex items-center justify-center gap-1 text-xs text-green-700 font-semibold py-2 rounded-md bg-green-50 hover:bg-green-100 transition"
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                    )}
                    {m.status !== "rejected" && (
                      <button
                        onClick={() => setStatus(m.id, "rejected")}
                        className="flex-1 inline-flex items-center justify-center gap-1 text-xs text-red-700 font-semibold py-2 rounded-md bg-red-50 hover:bg-red-100 transition"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
