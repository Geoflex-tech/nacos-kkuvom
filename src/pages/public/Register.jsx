import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    matric_no: "",
    level: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Create auth user
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Update profile row with extra info
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          matric_no: form.matric_no,
          level: form.level,
          phone: form.phone,
          full_name: form.full_name,
        })
        .eq("id", data.user.id);

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    navigate("/dashboard");
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-nacos-blue mb-2 text-center">Member Registration</h1>
      <p className="text-center text-gray-500 text-sm mb-6">
        Join NACOS KKU VOM Chapter
      </p>
      <form onSubmit={handleRegister} className="card p-6 space-y-4">
        <input
          className="input"
          placeholder="Full name"
          value={form.full_name}
          onChange={update("full_name")}
          required
        />
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={form.email}
          onChange={update("email")}
          required
        />
        <input
          type="password"
          className="input"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={update("password")}
          minLength={6}
          required
        />
        <input
          className="input"
          placeholder="Matric number (e.g. KKU/CS/22/001)"
          value={form.matric_no}
          onChange={update("matric_no")}
          required
        />
        <select className="input" value={form.level} onChange={update("level")} required>
          <option value="">Select level</option>
          <option value="100L">100L</option>
          <option value="200L">200L</option>
          <option value="300L">300L</option>
          <option value="400L">400L</option>
          <option value="500L">500L</option>
        </select>
        <input
          className="input"
          placeholder="Phone number"
          value={form.phone}
          onChange={update("phone")}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-nacos-blue font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}