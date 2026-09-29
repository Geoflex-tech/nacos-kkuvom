import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

const DEPARTMENTS = [
  "Computer Science",
  "Cyber Security",
  "Information Technology",
];

const MATRIC_REGEX = /^KKU\/\d{4}\/SC\/\d{3}$/;

function validateMatric(value) {
  if (!value) return "Matric number is required.";
  const cleaned = value.trim().toUpperCase();
  if (!MATRIC_REGEX.test(cleaned)) {
    return "Invalid format. Use: KKU/YYYY/SC/NNN (e.g. KKU/2024/SC/001)";
  }
  return null;
}

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    matric_no: "",
    level: "",
    phone: "",
    department: "Computer Science",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate matric before anything else
    const matricError = validateMatric(form.matric_no);
    if (matricError) {
      setError(matricError);
      return;
    }

    setLoading(true);

    // 1. Create auth user with metadata
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          department: form.department,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Update profile with extra fields
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        matric_no: form.matric_no.trim().toUpperCase(),
        level: form.level,
        phone: form.phone,
        department: form.department,
        university: "Karl Kumm University",
      })
      .eq("id", data.user.id);

    setLoading(false);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    navigate("/dashboard");
  };

  const matricErr = form.matric_no ? validateMatric(form.matric_no) : null;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-nacos-blue via-nacos-blue to-nacos-blue-dark text-white p-10">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="NACOS KKU Vom"
            className="h-11 w-11 object-contain rounded-full"
          />
          <span className="font-bold text-lg">NACOS KKU Vom</span>
        </Link>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-nacos-gold font-bold mb-4">
            Member Portal
          </p>
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-5">
            Join the chapter.
          </h1>
          <p className="text-white/80 text-lg max-w-md leading-relaxed">
            Register as a member of NACOS KKU Vom Chapter. Open to Computing
            students only.
          </p>
        </div>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} NACOS KKU VOM Chapter
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex items-start justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-nacos-blue mb-6"
          >
            <ArrowLeft size={14} /> Back to website
          </Link>

          <h2 className="text-2xl font-bold text-nacos-blue mb-1">
            Create account
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-nacos-blue font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full name
              </label>
              <input
                className="input"
                placeholder="e.g. Your Full Name"
                value={form.full_name}
                onChange={update("full_name")}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input pr-10"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={update("password")}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Matric */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Matric number
              </label>
              <input
                className={`input ${
                  matricErr
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                    : ""
                }`}
                placeholder="KKU/2024/SC/001"
                value={form.matric_no}
                onChange={(e) =>
                  setForm({ ...form, matric_no: e.target.value.toUpperCase() })
                }
                required
              />
              {matricErr && (
                <p className="text-xs text-red-600 mt-1.5">{matricErr}</p>
              )}
              <p className="text-xs text-gray-400 mt-1.5">
                Format: KKU/YYYY/SC/NNN
              </p>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Department
              </label>
              <select
                className="input"
                value={form.department}
                onChange={update("department")}
                required
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Level
              </label>
              <select
                className="input"
                value={form.level}
                onChange={update("level")}
                required
              >
                <option value="">Select level</option>
                <option value="100L">100L</option>
                <option value="200L">200L</option>
                <option value="300L">300L</option>
                <option value="400L">400L</option>

              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone number
              </label>
              <input
                type="tel"
                className="input"
                placeholder="e.g. 09084850109"
                value={form.phone}
                onChange={update("phone")}
                required
              />
            </div>

            {/* Info note */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2">
              <span className="text-blue-600 shrink-0">ℹ️</span>
              <p className="text-xs text-blue-800 leading-relaxed">
                Registration is limited to students of{" "}
                <strong>Karl Kumm University</strong> in the Computing
                departments. You can add a profile photo later from your
                profile page.
              </p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md p-2.5">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!matricErr}
              className="btn-primary w-full py-3 inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}