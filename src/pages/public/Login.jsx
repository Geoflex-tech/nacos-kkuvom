import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { profile, isMember } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isMember && profile) {
      navigate(profile.role === "exec" || profile.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [isMember, profile, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Fetch profile to check role
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    setLoading(false);
    if (profileRow?.role === "exec" || profileRow?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <section className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-nacos-blue mb-2 text-center">Login</h1>
      <p className="text-center text-gray-500 text-sm mb-6">
        Welcome back to NACOS KKU VOM Chapter
      </p>
      <form onSubmit={handleLogin} className="card p-6 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
        <div className="text-right">
  <Link
    to="/forgot-password"
    className="text-xs text-nacos-blue hover:underline font-medium"
  >
    Forgot password?
  </Link>
</div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-nacos-blue font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}
