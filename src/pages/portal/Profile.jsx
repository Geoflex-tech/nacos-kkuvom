import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { profile, session } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    matric_no: "",
    level: "",
    phone: "",
    department: "Computer Science",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        matric_no: profile.matric_no || "",
        level: profile.level || "",
        phone: profile.phone || "",
        department: profile.department || "Computer Science",
      });
    }
  }, [profile]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const { error } = await supabase
      .from("profiles")
      .update(form)
      .eq("id", session.user.id);
    setSaving(false);
    setMessage(error ? "Error: " + error.message : "Profile updated ✅");
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-nacos-blue mb-2">My Profile</h1>
      <p className="text-gray-500 mb-6">Update your personal information</p>

      <form onSubmit={save} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input className="input" value={form.full_name} onChange={update("full_name")} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Matric Number</label>
          <input className="input" value={form.matric_no} onChange={update("matric_no")} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select className="input" value={form.level} onChange={update("level")} required>
            <option value="">Select level</option>
            <option value="100L">100L</option>
            <option value="200L">200L</option>
            <option value="300L">300L</option>
            <option value="400L">400L</option>
            <option value="500L">500L</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input className="input" value={form.phone} onChange={update("phone")} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <input className="input" value={form.department} onChange={update("department")} />
        </div>

        {message && (
          <p className={message.startsWith("Error") ? "text-red-500 text-sm" : "text-green-600 text-sm"}>
            {message}
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
