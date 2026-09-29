import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import AuthShell from "../../components/AuthShell";
import { AuthFormStyles } from "./Login";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [invalid, setInvalid]   = useState(false);
  const navigate                = useNavigate();

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
    if (loading) return;
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
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) { setError(err.message); return; }

    setDone(true);
    setTimeout(() => navigate("/login"), 2800);
  };

  /* ── Verifying ── */
  if (!sessionReady && !invalid) {
    return (
      <AuthShell headline="Reset your password." subtext="">
        <div style={{ textAlign: "center", color: "#6B7280", padding: "40px 0" }}>
          Verifying reset link…
        </div>
        <AuthFormStyles />
      </AuthShell>
    );
  }

  /* ── Invalid / expired ── */
  if (invalid) {
    return (
      <AuthShell headline="Link expired." subtext="This reset link is no longer valid.">
        <div className="af-head" style={{ textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "#FEF2F2", display: "flex",
            alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <AlertTriangle size={26} color="#DC2626" aria-hidden="true" />
          </div>
          <h1 className="af-title" style={{ textAlign: "center" }}>Link expired or invalid</h1>
          <p className="af-sub">
            This password reset link has expired or has already been used.
            Please request a new one.
          </p>
        </div>
        <Link
          to="/forgot-password"
          className="af-btn"
          style={{ display: "flex", marginTop: 24, textDecoration: "none" }}
        >
          Request a new link
        </Link>
        <AuthFormStyles />
      </AuthShell>
    );
  }

  /* ── Done ── */
  if (done) {
    return (
      <AuthShell headline="Password updated." subtext="">
        <div className="af-head" style={{ textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "#F0FDF4", display: "flex",
            alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <CheckCircle2 size={28} color="#059669" aria-hidden="true" />
          </div>
          <h1 className="af-title" style={{ textAlign: "center" }}>Password updated</h1>
          <p className="af-sub">
            Your password has been reset successfully. Redirecting you to
            sign in…
          </p>
        </div>
        <AuthFormStyles />
      </AuthShell>
    );
  }

  /* ── Form ── */
  return (
    <AuthShell
      headline="Set a new password."
      subtext="Choose a strong password you'll remember."
    >
      <div className="af-head">
        <h1 className="af-title">New password</h1>
        <p className="af-sub">Must be at least 6 characters.</p>
      </div>

      {error && (
        <div className="af-err-box" role="alert" aria-live="assertive">
          <AlertCircle size={15} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={submit} noValidate>
        <div className="af-field">
          <label htmlFor="rp-password" className="af-label">New password</label>
          <div className="af-pw-wrap">
            <input
              id="rp-password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <div className="af-field">
          <label htmlFor="rp-confirm" className="af-label">Confirm new password</label>
          <div className="af-pw-wrap">
            <input
              id="rp-confirm"
              type={showCf ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="af-input af-input--pw"
              minLength={6}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="af-pw-toggle"
              onClick={() => setShowCf((v) => !v)}
              aria-label={showCf ? "Hide password" : "Show password"}
              aria-pressed={showCf}
            >
              {showCf
                ? <EyeOff size={16} aria-hidden="true" />
                : <Eye    size={16} aria-hidden="true" />}
            </button>
          </div>
          {/* Mismatch hint */}
          {confirm.length > 0 && password !== confirm && (
            <p className="af-field-err">
              <AlertCircle size={12} aria-hidden="true" /> Passwords do not match
            </p>
          )}
        </div>

        <button
          type="submit"
          className="af-btn"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <><span className="af-spinner" aria-hidden="true" /> Updating password…</>
          ) : (
            "Update password"
          )}
        </button>
      </form>

      <AuthFormStyles />
    </AuthShell>
  );
}
