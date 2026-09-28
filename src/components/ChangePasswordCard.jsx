import { useState } from "react";
import { Lock, Save } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function ChangePasswordCard() {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const change = async (e) => {
    e.preventDefault();
    setMsg("");

    if (pw1.length < 6) {
      return setMsg("Error: Password must be at least 6 characters.");
    }
    if (pw1 !== pw2) {
      return setMsg("Error: Passwords do not match.");
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    setSaving(false);

    if (error) return setMsg("Error: " + error.message);

    setMsg("Password updated ✅");
    setPw1("");
    setPw2("");
  };

  return (
    <div className="card-flat p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-nacos-blue/10 text-nacos-blue flex items-center justify-center shrink-0">
          <Lock size={18} />
        </div>
        <div>
          <h2 className="font-bold text-nacos-blue">Change Password</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Update the password used to log in to your account
          </p>
        </div>
      </div>

      <form onSubmit={change} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              type="password"
              className="input"
              placeholder="Min 6 characters"
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              className="input"
              placeholder="Re-enter password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              minLength={6}
              required
            />
          </div>
        </div>

        {msg && (
          <p
            className={`text-sm rounded-md p-2.5 ${
              msg.startsWith("Error")
                ? "text-red-600 bg-red-50 border border-red-100"
                : "text-green-600 bg-green-50 border border-green-100"
            }`}
          >
            {msg}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-outline inline-flex"
        >
          <Save size={16} />
          {saving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
