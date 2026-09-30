import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const DUES_AMOUNT = 2000; // ₦2,000 — change as needed

export default function Dues() {
  const { profile, session } = useAuth();
  const [params] = useSearchParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    const ref = params.get("ref");
    if (!ref || !session) return;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("paystack-verify", {
        body: { reference: ref },
      });
      setLoading(false);
      if (error) setMessage("Error verifying payment: " + error.message);
      else if (data?.success) {
        setMessage("Payment successful! Your dues are paid ✅");
        loadPayments();
      } else setMessage("Payment could not be verified.");
    })();
  }, [params, session]);

  const pay = async () => {
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.functions.invoke("paystack-init", {
      body: { amount: DUES_AMOUNT, purpose: "dues" },
    });
    setLoading(false);
    if (error) return setMessage("Error: " + error.message);
    if (data?.authorization_url) {
      window.location.href = data.authorization_url;
    } else {
      setMessage("Could not start payment. Try again.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-nacos-blue mb-2">Chapter Dues</h1>
      <p className="text-gray-500 mb-8">Pay your session dues to stay an active member</p>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-nacos-blue">Dues Status</h2>
            <p className="text-sm text-gray-500">Current session</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              profile?.dues_paid
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {profile?.dues_paid ? "Paid ✅" : "Not Paid"}
          </span>
        </div>

        {!profile?.dues_paid && (
          <>
            <p className="text-gray-700 mb-4">
              Amount:{" "}
              <span className="font-bold text-nacos-blue">
                ₦{DUES_AMOUNT.toLocaleString()}
              </span>
            </p>
            <button onClick={pay} disabled={loading} className="btn-primary w-full">
              {loading ? "Processing..." : `Pay ₦${DUES_AMOUNT.toLocaleString()} with Paystack`}
            </button>
          </>
        )}

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.toLowerCase().includes("successful")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <h2 className="text-xl font-bold text-nacos-blue mb-3">Payment History</h2>
      {payments.length === 0 ? (
        <p className="text-gray-500 text-sm">No payments yet.</p>
      ) : (
        <div className="space-y-2">
          {payments.map((p) => (
            <div key={p.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-nacos-blue">
                  ₦{p.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {p.reference} · {new Date(p.created_at).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  p.status === "success"
                    ? "text-green-600"
                    : p.status === "failed"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
