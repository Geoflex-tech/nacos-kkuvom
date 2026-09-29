import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, X, UserCircle2, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { compressImage } from "../../utils/compressImage";
import AuthShell from "../../components/AuthShell";
import { AuthFormStyles } from "./Login";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    matric_no: "",
    level: "",
    phone: "",
  });
  const [avatar, setAvatar]           = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPw, setShowPw]           = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const navigate                      = useNavigate();

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  /* ── Password rule checks ─────────────────────────── */
  const pwLen  = form.password.length >= 6;
  const pwMix  = /[A-Za-z]/.test(form.password) && /[0-9]/.test(form.password);

  /* ── Avatar handlers ──────────────────────────────── */
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Profile photo must be a JPG or PNG image.");
      return;
    }
    setError("");
    try {
      const compressed = await compressImage(file, 800, 0.82);
      setAvatar(compressed);
      setAvatarPreview(URL.createObjectURL(compressed));
    } catch (err) {
      setError("Could not process photo: " + err.message);
    }
  };

  const clearAvatar = () => {
    setAvatar(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
  };

  /* ── Submit ───────────────────────────────────────── */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!avatar) {
      setError("A profile photo is required.");
      return;
    }
    if (!pwLen) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // 1. Create auth user
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
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

    // 2. Upload avatar
    const ext      = avatar.name.split(".").pop().toLowerCase();
    const fileName = `member-${data.user.id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar, { upsert: true });

    if (uploadError) {
      setError("Photo upload failed: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    // 3. Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name:  form.full_name,
        matric_no:  form.matric_no,
        level:      form.level,
        phone:      form.phone,
        department: "Computer Science",
        avatar_url: urlData.publicUrl,
      })
      .eq("id", data.user.id);

    setLoading(false);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <AuthShell
      headline="Join the chapter."
      subtext="Register as a member of NACOS KKU Vom Chapter. Open to Computing students only."
    >
      {/* Heading */}
      <div className="af-head">
        <h1 className="af-title">Create account</h1>
        <p className="af-sub">
          Already a member?{" "}
          <Link to="/login" className="af-link">
            Sign in
          </Link>
        </p>
      </div>

      {/* Form-level error */}
      {error && (
        <div className="af-err-box" role="alert" aria-live="assertive">
          <AlertCircle size={15} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} noValidate>

        {/* ── Avatar ──────────────────────────────────── */}
        <div className="af-avatar-wrap">
          <span className="af-avatar-label">
            Profile photo <span aria-hidden="true" style={{ color: "#DC2626" }}>*</span>
          </span>
          {avatarPreview ? (
            <div className="af-avatar-ring">
              <img src={avatarPreview} alt="Preview" className="af-avatar-img" />
              <button
                type="button"
                className="af-avatar-remove"
                onClick={clearAvatar}
                aria-label="Remove profile photo"
              >
                <X size={12} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <label className="af-avatar-upload" aria-label="Upload profile photo">
              <UserCircle2 size={26} aria-hidden="true" />
              <span style={{ fontSize: "0.6875rem" }}>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="sr-only"
                style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}
                tabIndex={-1}
              />
            </label>
          )}
          <p className="af-avatar-hint">JPG or PNG · Max 2 MB</p>
        </div>

        {/* ── Personal info ────────────────────────────── */}
        <div className="af-field">
          <label htmlFor="reg-name" className="af-label">Full name</label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Your Full Name"
            value={form.full_name}
            onChange={update("full_name")}
            className="af-input"
            required
            disabled={loading}
          />
        </div>

        <div className="af-field">
          <label htmlFor="reg-email" className="af-label">Email address</label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            className="af-input"
            required
            disabled={loading}
          />
        </div>

        <div className="af-field">
          <label htmlFor="reg-password" className="af-label">Password</label>
          <div className="af-pw-wrap">
            <input
              id="reg-password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={update("password")}
              className="af-input af-input--pw"
              minLength={6}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="af-pw-toggle"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              aria-pressed={showPw}
            >
              {showPw
                ? <EyeOff size={16} aria-hidden="true" />
                : <Eye    size={16} aria-hidden="true" />}
            </button>
          </div>
          {/* Inline password rules */}
          {form.password.length > 0 && (
            <ul className="af-pw-rules" aria-label="Password requirements">
              <li className={`af-pw-rule${pwLen ? " af-pw-rule--ok" : ""}`}>
                <span className="af-pw-rule--dot" aria-hidden="true" />
                At least 6 characters
                {pwLen && <CheckCircle2 size={11} aria-label="met" />}
              </li>
              <li className={`af-pw-rule${pwMix ? " af-pw-rule--ok" : ""}`}>
                <span className="af-pw-rule--dot" aria-hidden="true" />
                Mix of letters and numbers (recommended)
                {pwMix && <CheckCircle2 size={11} aria-label="met" />}
              </li>
            </ul>
          )}
        </div>

        {/* ── Academic info ────────────────────────────── */}
        <div className="af-field">
          <label htmlFor="reg-matric" className="af-label">Matric number</label>
          <input
            id="reg-matric"
            type="text"
            placeholder="e.g. KKU/2023/SC/003"
            value={form.matric_no}
            onChange={update("matric_no")}
            className="af-input"
            required
            disabled={loading}
          />
        </div>

        <div className="af-field">
          <label htmlFor="reg-level" className="af-label">Level</label>
          <select
            id="reg-level"
            value={form.level}
            onChange={update("level")}
            className="af-select"
            required
            disabled={loading}
          >
            <option value="">Select level</option>
            <option value="100L">100L</option>
            <option value="200L">200L</option>
            <option value="300L">300L</option>
            <option value="400L">400L</option>
            <option value="500L">500L</option>
          </select>
        </div>

        <div className="af-field">
          <label htmlFor="reg-phone" className="af-label">Phone number</label>
          <input
            id="reg-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="e.g. 09084850109"
            value={form.phone}
            onChange={update("phone")}
            className="af-input"
            required
            disabled={loading}
          />
        </div>

        {/* Info note */}
        <div className="af-info">
          Registration is limited to students of the{" "}
          <strong>Computer Science Department</strong>, Karl Kumm University,
          Vom. Your application will be reviewed by an executive before approval.
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="af-btn"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className="af-spinner" aria-hidden="true" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="af-footer-text">
        Already a member?{" "}
        <Link to="/login" className="af-link">
          Sign in
        </Link>
      </p>

      <AuthFormStyles />
    </AuthShell>
  );
}
