import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ManageCertificates() {
  const [members, setMembers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    member_id: "",
    title: "",
    description: "",
    issued_date: new Date().toISOString().slice(0, 10),
    signed_by: "NACOS KKU VOM Chapter",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadAll = async () => {
    const { data: m } = await supabase
      .from("profiles")
      .select("id, full_name, email, matric_no, level")
      .eq("status", "approved")
      .order("full_name");
    setMembers(m || []);

    const { data: c } = await supabase
      .from("certificates")
      .select(
        "id, certificate_number, title, issued_date, status, member_id, profiles(full_name, email, matric_no)"
      )
      .order("created_at", { ascending: false });
    setCertificates(c || []);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const issue = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const { error } = await supabase.from("certificates").insert([form]);
    setLoading(false);

    if (error) return setMessage("Error: " + error.message);

    setMessage("Certificate issued ✅");
    setForm({
      member_id: "",
      title: "",
      description: "",
      issued_date: new Date().toISOString().slice(0, 10),
      signed_by: "NACOS KKU VOM Chapter",
    });
    loadAll();
  };

  const revoke = async (id) => {
    if (!confirm("Revoke this certificate? It will show as revoked on /verify.")) return;
    await supabase.from("certificates").update({ status: "revoked" }).eq("id", id);
    loadAll();
  };

  const restore = async (id) => {
    await supabase.from("certificates").update({ status: "valid" }).eq("id", id);
    loadAll();
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const filtered = certificates.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.certificate_number?.toLowerCase().includes(q) ||
      c.title?.toLowerCase().includes(q) ||
      c.profiles?.full_name?.toLowerCase().includes(q) ||
      c.profiles?.matric_no?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <form onSubmit={issue} className="card p-5 grid md:grid-cols-2 gap-3">
        <h3 className="md:col-span-2 font-bold text-nacos-blue">
          Issue New Certificate
        </h3>

        <select
          className="input md:col-span-2"
          value={form.member_id}
          onChange={update("member_id")}
          required
        >
          <option value="">— Select member —</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name || m.email}
              {m.matric_no ? ` (${m.matric_no})` : ""}
            </option>
          ))}
        </select>

        <input
          className="input md:col-span-2"
          placeholder="Certificate title (e.g. Web Development Workshop)"
          value={form.title}
          onChange={update("title")}
          required
        />

        <textarea
          className="input md:col-span-2"
          placeholder="Description (optional — e.g. Completed 3-day intensive workshop)"
          rows="2"
          value={form.description}
          onChange={update("description")}
        />

        <input
          type="date"
          className="input"
          value={form.issued_date}
          onChange={update("issued_date")}
        />

        <input
          className="input"
          placeholder="Signed by (e.g. Chapter President, Acting President)"
          value={form.signed_by}
          onChange={update("signed_by")}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary md:col-span-2"
        >
          {loading ? "Issuing..." : "Issue Certificate"}
        </button>

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

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-nacos-blue">
            Issued Certificates ({certificates.length})
          </h3>
        </div>

        <input
          className="input mb-3"
          placeholder="Search by number, title, name, or matric..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">
              {certificates.length === 0
                ? "No certificates issued yet."
                : "No results match your search."}
            </p>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="card p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {c.certificate_number}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        c.status === "valid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="font-semibold text-nacos-blue">{c.title}</p>
                  <p className="text-sm text-gray-600">
                    {c.profiles?.full_name || c.profiles?.email}
                    {c.profiles?.matric_no ? ` · ${c.profiles.matric_no}` : ""}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Issued {c.issued_date}
                  </p>
                </div>

                <div className="flex flex-col gap-1 items-end">
                  {c.status === "valid" ? (
                    <button
                      onClick={() => revoke(c.id)}
                      className="text-xs text-red-600 font-semibold hover:underline"
                    >
                      Revoke
                    </button>
                  ) : (
                    <button
                      onClick={() => restore(c.id)}
                      className="text-xs text-green-600 font-semibold hover:underline"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
