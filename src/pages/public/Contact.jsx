import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PageHeader from "../../components/PageHeader";

const CONTACT_ITEMS = [
  {
    Icon:    Mail,
    label:   "Email",
    value:   "nacoskkuvom@gmail.com",
    href:    "mailto:nacoskkuvom@gmail.com",
    accent:  "var(--color-blue)",
    bg:      "var(--color-blue-light)",
  },
  {
    Icon:    Phone,
    label:   "Phone",
    value:   "0908 485 0109",
    href:    "tel:09084850109",
    accent:  "var(--color-green)",
    bg:      "var(--color-green-light)",
  },
  {
    Icon:    MapPin,
    label:   "Location",
    value:   "Karl Kumm University, Vom",
    href:    null,
    accent:  "var(--color-yellow)",
    bg:      "var(--color-yellow-light)",
  },
];

/* ── Accessible label + input wrapper ──────────────────────── */
function Field({ label, id, required, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--weight-medium)",
          color: "var(--color-text-primary)",
          marginBottom: "6px",
        }}
      >
        {label}{required && <span aria-hidden="true" style={{ color: "var(--color-error)", marginLeft: "2px" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const { error } = await supabase.from("contact_messages").insert([form]);
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    setStatus("success");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <PageHeader
        label="Get in Touch"
        titleBold="CONTACT"
        titleLight="US"
        description="Questions, suggestions, or partnership ideas? We'd love to hear from you."
      />

      <div className="ct-page">

        {/* ── Contact info cards ─────────────────────────── */}
        <section aria-label="Contact information" className="ct-cards">
          {CONTACT_ITEMS.map(({ Icon, label, value, href, accent, bg }) => {
            const inner = (
              <>
                <div
                  aria-hidden="true"
                  style={{
                    width: "40px", height: "40px",
                    borderRadius: "var(--radius-sm)",
                    background: bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    marginBottom: "12px",
                  }}
                >
                  <Icon size={18} color={accent} strokeWidth={2} aria-hidden="true" />
                </div>
                <p style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  margin: "0 0 4px",
                }}>
                  {label}
                </p>
                <p style={{
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--weight-semibold)",
                  color: "var(--color-blue-dark)",
                  margin: 0,
                  wordBreak: "break-all",
                }}>
                  {value}
                </p>
              </>
            );

            const cardStyle = {
              display: "block",
              padding: "20px",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              textDecoration: "none",
            };

            return href ? (
              <a
                key={label}
                href={href}
                style={cardStyle}
                className="ct-info-card"
                data-accent={accent}
              >
                {inner}
              </a>
            ) : (
              <div key={label} style={{ ...cardStyle, cursor: "default" }}>
                {inner}
              </div>
            );
          })}
        </section>

        {/* ── Message form ──────────────────────────────── */}
        <section className="ct-form-wrap" aria-labelledby="ct-form-heading">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <p style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "var(--color-green)",
              margin: "0 0 8px",
            }}>
              Send a Message
            </p>
            <h2
              id="ct-form-heading"
              style={{
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                fontWeight: 700,
                color: "var(--color-blue-dark)",
                margin: 0,
              }}
            >
              We'll get back to you
            </h2>
          </div>

          {status === "success" ? (
            /* ── Success state ── */
            <div className="ct-success">
              <div className="ct-success__icon" aria-hidden="true">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="ct-success__heading">Message Sent</h3>
              <p className="ct-success__body">
                Thank you for reaching out. We'll respond as soon as possible.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStatus("idle")}
              >
                Send another message
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={submit} className="ct-form" noValidate>
              <div className="ct-form__row">
                <Field label="Your Name" id="ct-name" required>
                  <input
                    id="ct-name"
                    className="input"
                    value={form.name}
                    onChange={update("name")}
                    required
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email Address" id="ct-email" required>
                  <input
                    id="ct-email"
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={update("email")}
                    required
                    autoComplete="email"
                  />
                </Field>
              </div>

              <Field label="Subject" id="ct-subject">
                <input
                  id="ct-subject"
                  className="input"
                  value={form.subject}
                  onChange={update("subject")}
                />
              </Field>

              <Field label="Message" id="ct-message" required>
                <textarea
                  id="ct-message"
                  className="input"
                  rows="5"
                  value={form.message}
                  onChange={update("message")}
                  required
                  style={{ resize: "vertical", minHeight: "120px" }}
                />
              </Field>

              {status === "error" && (
                <p
                  role="alert"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-error)",
                    padding: "10px 14px",
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  Error: {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn btn-primary ct-submit"
              >
                {status === "sending" ? (
                  "Sending…"
                ) : (
                  <>
                    <Send size={15} aria-hidden="true" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </section>

      </div>

      <style>{`
        /* ── Page shell ── */
        .ct-page {
          max-width: 880px;
          margin-inline: auto;
          padding-inline: 24px;
          padding-top: 56px;
          padding-bottom: 80px;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        /* ── Info cards ── */
        .ct-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        @media (hover: hover) {
          .ct-info-card:hover {
            border-color: var(--color-blue);
            box-shadow: var(--shadow-md);
          }
        }
        .ct-info-card {
          transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
        }
        .ct-info-card:focus-visible {
          outline: 2px solid var(--color-blue);
          outline-offset: 2px;
          border-radius: var(--radius-lg);
        }

        /* ── Form section ── */
        .ct-form-wrap {
          max-width: 640px;
          margin-inline: auto;
          width: 100%;
        }

        .ct-form {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .ct-form__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .ct-submit {
          width: 100%;
          justify-content: center;
          height: 48px;
          font-size: var(--text-base);
        }

        /* ── Success ── */
        .ct-success {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 48px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .ct-success__icon {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: var(--color-green-light);
          color: var(--color-green);
          display: flex; align-items: center; justify-content: center;
        }
        .ct-success__heading {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--color-blue-dark);
          margin: 0;
        }
        .ct-success__body {
          font-size: var(--text-base);
          color: var(--color-text-muted);
          max-width: 36ch;
          line-height: 1.65;
          margin: 0;
        }

        /* ── Tablet ── */
        @media (max-width: 768px) {
          .ct-page { padding-top: 40px; padding-bottom: 60px; gap: 40px; }
          .ct-cards { grid-template-columns: 1fr; gap: 10px; }
        }
        /* ── Mobile ── */
        @media (max-width: 639px) {
          .ct-page { padding-inline: 16px; padding-top: 32px; }
          .ct-form { padding: 20px; }
          .ct-form__row { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          a[href] { transition: none !important; }
        }
      `}</style>
    </>
  );
}
