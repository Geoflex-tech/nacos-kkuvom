import { useState } from "react";
import { Search, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PageHeader from "../../components/PageHeader";

export default function Verify() {
  const [code, setCode]       = useState("");
  const [result, setResult]   = useState(null);
  const [status, setStatus]   = useState("idle"); // idle | loading | found | notfound
  const [errorMsg, setErrorMsg] = useState("");

  const verify = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    const cleanCode = code.trim().toUpperCase();

    const { data, error } = await supabase.rpc("verify_certificate", {
      code: cleanCode,
    });

    if (error) {
      setStatus("notfound");
      setErrorMsg(error.message);
      return;
    }

    if (!data || data.length === 0) {
      setStatus("notfound");
    } else {
      setResult(data[0]);
      setStatus("found");
    }
  };

  const reset = () => {
    setCode("");
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
  };

  const isValid   = result?.status === "valid";
  const isRevoked = result?.status === "revoked";

  return (
    <>
      <PageHeader
        label="Authenticity Check"
        titleBold="CERTIFICATE"
        titleLight="VERIFICATION"
        description="Verify the authenticity of any certificate issued by NACOS KKU Vom Chapter."
      />

      <div className="vf-page">

        {/* ── Lookup form ─────────────────────────────── */}
        <section className="vf-card" aria-labelledby="vf-form-heading">
          <h2 id="vf-form-heading" className="vf-card-heading">Enter Certificate Number</h2>
          <p className="vf-card-sub">
            The certificate number is printed on the certificate document — it starts with{" "}
            <code className="vf-code-hint">NACOS-KKU-</code>
          </p>

          <form onSubmit={verify} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ position: "relative" }}>
              <input
                id="vf-code"
                className="input vf-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="NACOS-KKU-2026-000001"
                aria-label="Certificate number"
                required
                autoComplete="off"
                spellCheck={false}
                style={{ fontFamily: "monospace", letterSpacing: "0.5px", paddingRight: "48px" }}
              />
              <Search
                size={18}
                aria-hidden="true"
                style={{
                  position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                  color: "var(--color-text-muted)", pointerEvents: "none",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || !code.trim()}
              className="btn btn-primary vf-submit"
            >
              {status === "loading" ? (
                <>
                  <RefreshCw size={15} aria-hidden="true" className="vf-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <Search size={15} aria-hidden="true" />
                  Verify Certificate
                </>
              )}
            </button>
          </form>
        </section>

        {/* ── Not found ──────────────────────────────── */}
        {status === "notfound" && (
          <section
            className="vf-result vf-result--fail"
            role="alert"
            aria-live="polite"
            aria-labelledby="vf-fail-heading"
          >
            <div className="vf-result__icon vf-result__icon--fail" aria-hidden="true">
              <XCircle size={28} />
            </div>
            <div className="vf-result__body">
              <h2 id="vf-fail-heading" className="vf-result__heading vf-result__heading--fail">
                Not Verified
              </h2>
              <p className="vf-result__desc">
                No certificate found for that number. It may have been revoked, never existed,
                or you may have mistyped it.
              </p>
              {errorMsg && (
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-error)", marginTop: "6px" }}>
                  {errorMsg}
                </p>
              )}
              <p className="vf-result__desc" style={{ marginTop: "8px" }}>
                If you believe this is an error, contact us at{" "}
                <a href="mailto:nacoskkuvom@gmail.com" className="vf-link">
                  nacoskkuvom@gmail.com
                </a>
              </p>
              <button type="button" className="btn btn-secondary vf-retry" onClick={reset}>
                Try another code
              </button>
            </div>
          </section>
        )}

        {/* ── Found ─────────────────────────────────── */}
        {status === "found" && result && (
          <section
            className={`vf-result ${isValid ? "vf-result--pass" : "vf-result--warn"}`}
            role="status"
            aria-live="polite"
            aria-labelledby="vf-cert-heading"
          >
            <div className={`vf-result__icon ${isValid ? "vf-result__icon--pass" : "vf-result__icon--warn"}`} aria-hidden="true">
              {isValid ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
            </div>

            <div className="vf-result__body">
              <h2
                id="vf-cert-heading"
                className={`vf-result__heading ${isValid ? "vf-result__heading--pass" : "vf-result__heading--warn"}`}
              >
                {isValid ? "Certificate Verified" : "Certificate Revoked"}
              </h2>
              <p className="vf-result__sub">Issued by NACOS KKU Vom Chapter</p>

              {/* Certificate details */}
              <dl className="vf-dl">
                <div className="vf-dl__row">
                  <dt className="vf-dl__term">Recipient</dt>
                  <dd className="vf-dl__def vf-dl__def--name">{result.recipient_name}</dd>
                </div>

                <div className="vf-dl__row">
                  <dt className="vf-dl__term">Certificate</dt>
                  <dd className="vf-dl__def">{result.title}</dd>
                </div>

                <div className="vf-dl__two-col">
                  <div>
                    <dt className="vf-dl__term">Certificate No.</dt>
                    <dd className="vf-dl__def" style={{ fontFamily: "monospace", fontSize: "var(--text-sm)" }}>
                      {result.certificate_number}
                    </dd>
                  </div>
                  <div>
                    <dt className="vf-dl__term">Date Issued</dt>
                    <dd className="vf-dl__def">
                      {new Date(result.issued_date).toDateString()}
                    </dd>
                  </div>
                </div>

                <div className="vf-dl__row">
                  <dt className="vf-dl__term">Signed By</dt>
                  <dd className="vf-dl__def">{result.signed_by}</dd>
                </div>
              </dl>

              {/* Status note */}
              <p className={`vf-status-note ${isValid ? "vf-status-note--pass" : "vf-status-note--warn"}`}>
                {isValid
                  ? "This certificate is authentic and was issued by NACOS KKU Vom Chapter."
                  : "This certificate has been revoked by the issuing chapter and is no longer valid."}
              </p>

              <button type="button" className="btn btn-secondary vf-retry" onClick={reset}>
                Verify another
              </button>
            </div>
          </section>
        )}

      </div>

      <style>{`
        /* ── Page shell ── */
        .vf-page {
          max-width: 640px;
          margin-inline: auto;
          padding-inline: 24px;
          padding-top: 56px;
          padding-bottom: 80px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ── Lookup card ── */
        .vf-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 28px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .vf-card-heading {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-blue-dark);
          margin: 0;
        }
        .vf-card-sub {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          margin: 0;
        }
        .vf-code-hint {
          font-family: monospace;
          font-size: var(--text-xs);
          background: var(--color-bg-alt);
          padding: 1px 5px;
          border-radius: 4px;
          color: var(--color-blue-dark);
        }
        .vf-input { padding-right: 48px !important; }
        .vf-submit {
          width: 100%;
          height: 48px;
          justify-content: center;
          font-size: var(--text-base);
          gap: 8px;
        }

        /* Spin animation for loading */
        .vf-spin { animation: vf-spin 0.8s linear infinite; }
        @keyframes vf-spin { to { transform: rotate(360deg); } }

        /* ── Result cards ── */
        .vf-result {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          padding: 24px;
          display: flex;
          gap: 18px;
          align-items: flex-start;
        }
        .vf-result--pass { border-left: 4px solid var(--color-green); }
        .vf-result--fail { border-left: 4px solid var(--color-error); }
        .vf-result--warn { border-left: 4px solid var(--color-yellow); }

        .vf-result__icon {
          width: 52px; height: 52px; flex-shrink: 0;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .vf-result__icon--pass { background: var(--color-green-light); color: var(--color-green); }
        .vf-result__icon--fail { background: #FEE2E2; color: var(--color-error); }
        .vf-result__icon--warn { background: var(--color-yellow-light); color: var(--color-yellow); }

        .vf-result__body { flex: 1; display: flex; flex-direction: column; gap: 8px; }

        .vf-result__heading { font-size: 1.125rem; font-weight: 700; margin: 0; }
        .vf-result__heading--pass { color: var(--color-green); }
        .vf-result__heading--fail { color: var(--color-error); }
        .vf-result__heading--warn { color: var(--color-yellow); }

        .vf-result__sub {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          margin: 0;
        }
        .vf-result__desc {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: 1.65;
          margin: 0;
        }

        /* ── Definition list ── */
        .vf-dl {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px 0;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          margin: 8px 0;
        }
        .vf-dl__row { display: flex; flex-direction: column; gap: 2px; }
        .vf-dl__two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .vf-dl__term {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }
        .vf-dl__def {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          margin: 0;
        }
        .vf-dl__def--name {
          font-size: var(--text-md);
          font-weight: 700;
          color: var(--color-blue-dark);
        }

        /* ── Status footer note ── */
        .vf-status-note {
          font-size: var(--text-xs);
          line-height: 1.6;
          margin: 0;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
        }
        .vf-status-note--pass { background: var(--color-green-light); color: #065F46; }
        .vf-status-note--warn { background: var(--color-yellow-light); color: #92400E; }

        /* ── Helpers ── */
        .vf-link {
          color: var(--color-green);
          text-decoration: none;
          font-weight: var(--weight-medium);
        }
        .vf-link:hover { text-decoration: underline; }
        .vf-retry { margin-top: 8px; }

        /* ── Mobile ── */
        @media (max-width: 639px) {
          .vf-page { padding-inline: 16px; padding-top: 32px; }
          .vf-card { padding: 20px; }
          .vf-result { flex-direction: column; gap: 14px; }
          .vf-result__icon { width: 44px; height: 44px; }
          .vf-dl__two-col { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .vf-spin { animation: none; }
        }
      `}</style>
    </>
  );
}
