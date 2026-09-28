import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const redirectTo = `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <section className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <div className="inline-flex h-14 w-14 rounded-2xl bg-nacos-blue/10 text-nacos-blue items-center justify-center mb-4">
          <Mail size={24} />
        </div>
        <h1 className="text-2xl font-bold text-nacos-blue mb-2">
          Reset your password
        </h1>
        <p className="text-gray-500 text-sm">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {sent ? (
        <div className="card-flat p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-nacos-blue mb-2">
            Check your email
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            We sent a password reset link to{" "}
            <span className="font-semibold text-nacos-blue">{email}</span>.
            Click the link in that email to set a new password.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Didn't get the email? Check spam, or try again.
          </p>
          <Link to="/login" className="btn-outline inline-flex">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="card-flat p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Remembered it?{" "}
            <Link
              to="/login"
              className="text-nacos-blue font-semibold hover:underline"
            >
              Back to login
            </Link>
          </p>
        </form>
      )}
    </section>
  );
}
