import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
      else setInvalid(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setSessionReady(true);
        setInvalid(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
    setTimeout(() => navigate("/login"), 2500);
  };

  if (!sessionReady && !invalid) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-500">
        Verifying reset link...
      </div>
    );
  }

  if (invalid) {
    return (
      <section className="max-w-md mx-auto px-4 py-20">
        <div className="card-flat p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-nacos-blue mb-2">
            Link expired or invalid
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            This password reset link has expired or is not valid. Please
            request a new one.
          </p>
          <Link to="/forgot-password" className="btn-primary inline-flex">
            Request new link
          </Link>
        </div>
      </section>
    );
  }

  if (done) {
    return (
      <section className="max-w-md mx-auto px-4 py-20">
        <div className="card-flat p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-xl font-bold text-nacos-blue mb-2">
            Password updated
          </h1>
          <p className="text-gray-600 text-sm mb-2">
            Your password has been reset successfully.
          </p>
          <p className="text-xs text-gray-400">
            Redirecting you to login...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <div className="inline-flex h-14 w-14 rounded-2xl bg-nacos-blue/10 text-nacos-blue items-center justify-center mb-4">
          <Lock size={24} />
        </div>
        <h1 className="text-2xl font-bold text-nacos-blue mb-2">
          Set a new password
        </h1>
        <p className="text-gray-500 text-sm">
          Choose a strong password you'll remember.
        </p>
      </div>

      <form onSubmit={submit} className="card-flat p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New password
          </label>
          <input
            type="password"
            className="input"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={6}
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-md p-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </section>
  );
}