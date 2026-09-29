import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";
import AuthShell from "../../components/AuthShell";
import { AuthFormStyles } from "./Login";

export default function ForgotPassword() {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  };

  return (
    <AuthShell
      headline="Reset your password."
      subtext="Enter your email and we'll send you a link to set a new password."
    >
      {sent ? (
        /* ── Success state ── */
        <div>
          <div className="af-head" style={{ textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#F0FDF4", display: "flex",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <CheckCircle2 size={28} color="#059669" aria-hidden="true" />
            </div>
            <h1 className="af-title" style={{ textAlign: "center" }}>Check your email</h1>
            <p className="af-sub">
              We sent a password reset link to{" "}
              <strong style={{ color: "#0F172A" }}>{email}</strong>.
              Click the link in that email to set a new password.
            </p>
            <p style={{
              fontSize: "0.8125rem", color: "#9CA3AF",
              marginTop: 12,
            }}>
              Didn't get it? Check your spam folder, or{" "}
              <button
                type="button"
                onClick={() => setSent(false)}
                style={{
                  background: "none", border: "none",
                  color: "#1E40AF", fontSize: "inherit",
                  fontWeight: 500, cursor: "pointer", padding: 0,
                }}
              >
                try again
              </button>.
            </p>
          </div>
          <Link
            to="/login"
            className="af-btn"
            style={{ display: "flex", marginTop: 24, textDecoration: "none" }}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to sign in
          </Link>
        </div>
      ) : (
        /* ── Form state ── */
        <div>
          <div className="af-head">
            <h1 className="af-title">Forgot password?</h1>
            <p className="af-sub">
              Enter the email you registered with and we'll send a reset link.
            </p>
          </div>

          {error && (
            <div className="af-err-box" role="alert" aria-live="assertive">
              <AlertCircle size={15} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} noValidate>
            <div className="af-field">
              <label htmlFor="fp-email" className="af-label">Email address</label>
              <input
                id="fp-email"
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

            <button
              type="submit"
              className="af-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <><span className="af-spinner" aria-hidden="true" /> Sending link…</>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <p className="af-footer-text">
            Remembered it?{" "}
            <Link to="/login" className="af-link">Sign in</Link>
          </p>
        </div>
      )}

      <AuthFormStyles />
    </AuthShell>
  );
}
