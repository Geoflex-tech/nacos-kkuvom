import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "../../components/AuthShell";

export default function Login() {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const navigate                  = useNavigate();
  const [searchParams]            = useSearchParams();
  const { profile, isMember }     = useAuth();

  const returnTo = searchParams.get("returnTo")
    ? decodeURIComponent(searchParams.get("returnTo"))
    : null;

  // Already logged in — redirect immediately
  useEffect(() => {
    if (isMember && profile) {
      const dest =
        returnTo ||
        (profile.role === "admin" ||
        profile.role === "super_admin" ||
        profile.role === "president"
          ? "/admin"
          : "/dashboard");
      navigate(dest, { replace: true });
    }
  }, [isMember, profile, navigate, returnTo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;           // prevent double submit
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // Never reveal which field is wrong
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
      return;
    }

    const { data: profileRow } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (returnTo) {
      navigate(returnTo, { replace: true });
    } else if (
      profileRow?.role === "admin" ||
      profileRow?.role === "super_admin" ||
      profileRow?.role === "president"
    ) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <AuthShell
      headline="Welcome back."
      subtext="Sign in to access your member portal, resources, and chapter updates."
    >
      {/* Heading */}
      <div className="af-head">
        <h1 className="af-title">Sign in</h1>
        <p className="af-sub">
          {returnTo
            ? "Sign in to continue to your destination."
            : "Enter your email and password to continue."}
        </p>
      </div>

      {/* Form-level error */}
      {error && (
        <div className="af-err-box" role="alert" aria-live="assertive">
          <AlertCircle size={15} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} noValidate>
        {/* Email */}
        <div className="af-field">
          <label htmlFor="login-email" className="af-label">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="af-input"
            required
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="af-field">
          <div className="af-label-row">
            <label htmlFor="login-password" className="af-label">
              Password
            </label>
            <Link to="/forgot-password" className="af-forgot">
              Forgot password?
            </Link>
          </div>
          <div className="af-pw-wrap">
            <input
              id="login-password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="af-input af-input--pw"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="af-pw-toggle"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              aria-pressed={showPw}
              tabIndex={0}
            >
              {showPw
                ? <EyeOff size={16} aria-hidden="true" />
                : <Eye    size={16} aria-hidden="true" />}
            </button>
          </div>
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
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="af-footer-text">
        New to the chapter?{" "}
        <Link to="/register" className="af-link">
          Create an account
        </Link>
      </p>

      <AuthFormStyles />
    </AuthShell>
  );
}

/* Shared form styles — injected once per page via this component.
   Kept here so they travel with the auth pages and don't pollute
   global CSS. Each page imports <AuthFormStyles /> at the bottom. */
export function AuthFormStyles() {
  return (
    <style>{`
      /* ── Heading ─────────────────────────────────────── */
      .af-head { margin-bottom: 28px; }
      .af-title {
        font-size: 1.375rem; font-weight: 500;
        color: #0F172A; margin: 0 0 6px;
      }
      .af-sub {
        font-size: 0.875rem; color: #64748B; margin: 0; line-height: 1.5;
      }

      /* ── Form-level error box ────────────────────────── */
      .af-err-box {
        display: flex; align-items: flex-start; gap: 8px;
        padding: 10px 14px; margin-bottom: 20px;
        background: #FEF2F2; border: 1px solid #FECACA;
        border-radius: 8px;
        font-size: 0.8125rem; color: #B91C1C; line-height: 1.5;
      }
      .af-err-box svg { flex-shrink: 0; margin-top: 1px; }

      /* ── Success box ─────────────────────────────────── */
      .af-ok-box {
        display: flex; align-items: flex-start; gap: 8px;
        padding: 10px 14px; margin-bottom: 20px;
        background: #F0FDF4; border: 1px solid #BBF7D0;
        border-radius: 8px;
        font-size: 0.8125rem; color: #166534; line-height: 1.5;
      }
      .af-ok-box svg { flex-shrink: 0; margin-top: 1px; }

      /* ── Fields ──────────────────────────────────────── */
      .af-field { margin-bottom: 18px; }

      .af-label-row {
        display: flex; align-items: center;
        justify-content: space-between; margin-bottom: 6px;
      }

      .af-label {
        display: block; margin-bottom: 6px;
        font-size: 0.8125rem; font-weight: 500; color: #374151;
      }
      .af-label-row .af-label { margin-bottom: 0; }

      .af-forgot {
        font-size: 0.8125rem; font-weight: 500;
        color: #1E40AF; text-decoration: none;
        transition: color 150ms ease-out;
      }
      .af-forgot:hover { color: #1D4ED8; text-decoration: underline; }
      .af-forgot:focus-visible {
        outline: 2px solid #1E40AF; outline-offset: 2px; border-radius: 4px;
      }

      /* Input */
      .af-input {
        width: 100%;
        height: 44px;
        padding: 0 12px;
        border: 1px solid #D3D9E8;
        border-radius: 8px;
        background: #fff;
        font-size: 0.875rem;
        color: #0F172A;
        font-family: inherit;
        box-sizing: border-box;
        transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
        outline: none;
      }
      .af-input::placeholder { color: #9CA3AF; }
      .af-input:focus {
        border-color: #1E40AF;
        box-shadow: 0 0 0 3px rgba(30,64,175,0.14);
      }
      .af-input:disabled { background: #F9FAFB; color: #9CA3AF; cursor: not-allowed; }

      /* Password wrapper */
      .af-pw-wrap { position: relative; }
      .af-input--pw { padding-right: 44px; }
      .af-pw-toggle {
        position: absolute; right: 0; top: 0;
        width: 44px; height: 44px;
        display: flex; align-items: center; justify-content: center;
        background: none; border: none; cursor: pointer;
        color: #9CA3AF;
        transition: color 150ms ease-out;
        border-radius: 0 8px 8px 0;
      }
      .af-pw-toggle:hover { color: #374151; }
      .af-pw-toggle:focus-visible {
        outline: 2px solid #1E40AF; outline-offset: -2px;
        border-radius: 0 8px 8px 0;
      }

      /* Select */
      .af-select {
        width: 100%; height: 44px;
        padding: 0 12px;
        border: 1px solid #D3D9E8; border-radius: 8px;
        background: #fff; font-size: 0.875rem;
        color: #0F172A; font-family: inherit;
        box-sizing: border-box;
        transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
        outline: none; cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 36px;
      }
      .af-select:focus {
        border-color: #1E40AF;
        box-shadow: 0 0 0 3px rgba(30,64,175,0.14);
      }
      .af-select:disabled { background-color: #F9FAFB; cursor: not-allowed; }

      /* Inline field error */
      .af-field-err {
        display: flex; align-items: center; gap: 5px;
        font-size: 0.75rem; color: #DC2626; margin-top: 5px;
      }

      /* ── Primary button ──────────────────────────────── */
      .af-btn {
        display: flex; align-items: center; justify-content: center;
        gap: 8px;
        width: 100%; height: 44px;
        margin-top: 8px;
        background: #1F3A9A; color: #fff;
        border: none; border-radius: 8px;
        font-size: 0.875rem; font-weight: 500;
        font-family: inherit; cursor: pointer;
        transition: background 150ms ease-out;
      }
      .af-btn:hover:not(:disabled) { background: #1A3286; }
      .af-btn:focus-visible {
        outline: 2px solid #1E40AF; outline-offset: 2px;
      }
      .af-btn:disabled {
        opacity: 0.65; cursor: not-allowed;
      }

      /* Spinner inside the button */
      .af-spinner {
        width: 16px; height: 16px;
        border: 2px solid rgba(255,255,255,0.35);
        border-top-color: #fff;
        border-radius: 50%;
        animation: af-spin 0.7s linear infinite;
        flex-shrink: 0;
      }
      @keyframes af-spin { to { transform: rotate(360deg); } }

      /* ── Footer text ─────────────────────────────────── */
      .af-footer-text {
        text-align: center;
        font-size: 0.875rem; color: #6B7280;
        margin-top: 24px;
      }
      .af-link {
        color: #1E40AF; font-weight: 500; text-decoration: none;
        transition: color 150ms ease-out;
      }
      .af-link:hover { color: #1D4ED8; text-decoration: underline; }
      .af-link:focus-visible {
        outline: 2px solid #1E40AF; outline-offset: 2px; border-radius: 4px;
      }

      /* ── Divider ─────────────────────────────────────── */
      .af-divider {
        display: flex; align-items: center; gap: 12px;
        margin-block: 20px;
        font-size: 0.8125rem; color: #9CA3AF;
      }
      .af-divider::before,
      .af-divider::after {
        content: ""; flex: 1; height: 1px; background: #E5E7EB;
      }

      /* ── Info banner ─────────────────────────────────── */
      .af-info {
        padding: 10px 14px; margin-bottom: 20px;
        background: #EFF6FF; border: 1px solid #BFDBFE;
        border-radius: 8px;
        font-size: 0.8125rem; color: #1E40AF; line-height: 1.5;
      }

      /* ── Avatar upload ───────────────────────────────── */
      .af-avatar-wrap {
        display: flex; flex-direction: column; align-items: center;
        margin-bottom: 24px;
      }
      .af-avatar-label {
        font-size: 0.8125rem; font-weight: 500;
        color: #374151; margin-bottom: 10px;
      }
      .af-avatar-ring {
        position: relative;
        width: 80px; height: 80px;
      }
      .af-avatar-img {
        width: 80px; height: 80px; border-radius: 50%;
        object-fit: cover;
        border: 3px solid #FDD04A;
      }
      .af-avatar-remove {
        position: absolute; top: -4px; right: -4px;
        width: 24px; height: 24px; border-radius: 50%;
        background: #DC2626; color: #fff; border: none;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        transition: background 150ms ease-out;
      }
      .af-avatar-remove:hover { background: #B91C1C; }
      .af-avatar-upload {
        width: 80px; height: 80px; border-radius: 50%;
        border: 2px dashed #D3D9E8;
        background: #F9FAFB;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        cursor: pointer; gap: 4px;
        color: #9CA3AF;
        transition: border-color 150ms ease-out, background 150ms ease-out;
      }
      .af-avatar-upload:hover { border-color: #1E40AF; background: #EFF6FF; color: #1E40AF; }
      .af-avatar-hint {
        font-size: 0.75rem; color: #9CA3AF; margin-top: 8px;
      }

      /* ── Password hint list ──────────────────────────── */
      .af-pw-rules {
        list-style: none; padding: 0; margin: 6px 0 0;
        display: flex; flex-direction: column; gap: 3px;
      }
      .af-pw-rule {
        display: flex; align-items: center; gap: 6px;
        font-size: 0.75rem; color: #9CA3AF;
        transition: color 150ms ease-out;
      }
      .af-pw-rule--ok  { color: #059669; }
      .af-pw-rule--dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: currentColor; flex-shrink: 0;
      }

      @media (prefers-reduced-motion: reduce) {
        .af-spinner { animation: none; }
        .af-btn, .af-input, .af-forgot, .af-link, .af-pw-toggle { transition: none; }
      }
    `}</style>
  );
}
