import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Wallet, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { DashPageStyles } from "./Announcements";

const DUES_AMOUNT = 2000; // ₦2,000

export default function Dues() {
  const { profile, session }  = useAuth();
  const [params]              = useSearchParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState({ text: "", type: "" });

  const loadPayments = async () => {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("member_id", session.user.id)
      .order("created_at", { ascending: false });
    setPayments(data || []);
  };

  useEffect(() => {
    if (session) loadPayments();
  }, [session]);

  /* Verify payment redirect */
  useEffect(() => {
    const ref = params.get("ref");
    if (!ref || !session) return;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("paystack-verify", {
        body: { reference: ref },
      });
      setLoading(false);
      if (error) {
        setMessage({ text: "Error verifying payment: " + error.message, type: "err" });
      } else if (data?.success) {
        setMessage({ text: "Payment successful! Your dues are paid.", type: "ok" });
        loadPayments();
      } else {
        setMessage({ text: "Payment could not be verified.", type: "err" });
      }
    })();
  }, [params, session]);

  const pay = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    const { data, error } = await supabase.functions.invoke("paystack-init", {
      body: { amount: DUES_AMOUNT, purpose: "dues" },
    });
    setLoading(false);
    if (error) {
      setMessage({ text: "Error: " + error.message, type: "err" });
      return;
    }
    if (data?.authorization_url) {
      window.location.href = data.authorization_url;
    } else {
      setMessage({ text: "Could not start payment. Please try again.", type: "err" });
    }
  };

  return (
    <div className="dp-wrap">
      <div className="dp-page-head">
        <div className="dp-page-icon" aria-hidden="true">
          <Wallet size={20} />
        </div>
        <div>
          <h1 className="dp-page-title">Chapter Dues</h1>
          <p className="dp-page-sub">Pay your session dues to remain an active member</p>
        </div>
      </div>

      {/* Status card */}
      <div className="dp-card">
        <div className="dp-dues-status-row">
          <div>
            <p className="dp-dues-label">Dues Status</p>
            <p className="dp-dues-sub">Current session</p>
          </div>
          <span
            className={`dp-dues-badge ${
              profile?.dues_paid ? "dp-dues-badge--paid" : "dp-dues-badge--unpaid"
            }`}
          >
            {profile?.dues_paid ? "Paid" : "Not paid"}
          </span>
        </div>

        {!profile?.dues_paid && (
          <>
            <p className="dp-dues-amount">
              Amount:{" "}
              <strong>₦{DUES_AMOUNT.toLocaleString()}</strong>
            </p>
            <button
              type="button"
              className="dp-pay-btn"
              onClick={pay}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="dp-pay-spinner" aria-hidden="true" />
                  Processing…
                </>
              ) : (
                <>
                  <Wallet size={15} aria-hidden="true" />
                  Pay ₦{DUES_AMOUNT.toLocaleString()} with Paystack
                </>
              )}
            </button>
          </>
        )}

        {profile?.dues_paid && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#059669", fontSize: "0.875rem" }}>
            <CheckCircle2 size={18} aria-hidden="true" />
            Dues paid for this session. Thank you!
          </div>
        )}

        {message.text && (
          <div
            className={`dp-pay-msg dp-pay-msg--${message.type}`}
            role="alert"
            aria-live="polite"
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {message.type === "ok"
                ? <CheckCircle2 size={15} aria-hidden="true" />
                : <AlertCircle  size={15} aria-hidden="true" />}
              {message.text}
            </span>
          </div>
        )}
      </div>

      {/* Payment history */}
      <div>
        <h2 className="dp-hist-title">Payment History</h2>
        {payments.length === 0 ? (
          <div className="dp-empty" style={{ padding: "32px 0" }}>
            <p className="dp-empty-text">No payments yet.</p>
          </div>
        ) : (
          <div className="dp-list">
            {payments.map((p) => (
              <div key={p.id} className="dp-card dp-hist-row">
                <div>
                  <p className="dp-hist-amount">₦{p.amount.toLocaleString()}</p>
                  <p className="dp-hist-ref">
                    {p.reference} ·{" "}
                    {new Date(p.created_at).toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <span
                  className={`dp-hist-status ${
                    p.status === "success"
                      ? "dp-hist-status--ok"
                      : p.status === "failed"
                      ? "dp-hist-status--err"
                      : "dp-hist-status--pend"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <DashPageStyles />
    </div>
  );
}
