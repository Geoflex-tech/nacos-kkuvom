import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PageHeader from "../../components/PageHeader";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const { error } = await supabase.from("contact_messages").insert([form]);
    if (error) { setStatus("error"); setErrorMsg(error.message); return; }
    setStatus("success");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const contactCards = [
    { Icon: Mail,   label: "Email",    value: "nacoskkuvom@gmail.com",  href: "mailto:nacoskkuvom@gmail.com", color: "bg-blue-50 text-nacos-blue"    },
    { Icon: Phone,  label: "Phone",    value: "0908 485 0109",           href: "tel:09084850109",              color: "bg-green-50 text-nacos-green"  },
    { Icon: MapPin, label: "Location", value: "Karl Kumm University, Vom",                                     color: "bg-yellow-50 text-yellow-700"  },
  ];

  return (
    <>
      <PageHeader
        label="Get in Touch"
        titleBold="CONTACT"
        titleLight="US"
        description="Questions, suggestions, or partnership ideas? We'd love to hear from you."
      />

      <section className="max-w-5xl mx-auto px-4 py-12" style={{ marginTop: "48px" }}>
        {/* Contact cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {contactCards.map(({ Icon, label, value, href, color }) => {
            const content = (
              <>
                <div
                  className={`flex items-center justify-center mb-3 ${color}`}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} />
                </div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                  {label}
                </p>
                <p className="font-semibold text-nacos-blue break-all">
                  {value}
                </p>
              </>
            );
            return href ? (
              <a
                key={label}
                href={href}
                style={{
                  display: "block",
                  padding: "20px",
                  border: "1px solid #E6EAF2",
                  borderRadius: "12px",
                  background: "#fff",
                  textDecoration: "none",
                  transition: "border-color 150ms ease-out",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-blue)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E6EAF2"; }}
              >
                {content}
              </a>
            ) : (
              <div
                key={label}
                style={{
                  padding: "20px",
                  border: "1px solid #E6EAF2",
                  borderRadius: "12px",
                  background: "#fff",
                }}
              >
                {content}
              </div>
            );
          })}
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="section-eyebrow">Send a Message</p>
            <h2 className="section-title text-2xl md:text-3xl">
              We'll get back to you
            </h2>
          </div>

          {status === "success" ? (
            <div className="card-flat p-10 text-center">
              <div className="h-16 w-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-nacos-blue mb-2">
                Message Sent
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for reaching out. We'll respond as soon as possible.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="btn-outline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="card-flat p-6 md:p-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={update("name")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={update("email")}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject
                </label>
                <input
                  className="input"
                  value={form.subject}
                  onChange={update("subject")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  className="input"
                  rows="5"
                  value={form.message}
                  onChange={update("message")}
                  required
                />
              </div>

              {status === "error" && (
                <p className="text-red-500 text-sm">Error: {errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary w-full py-3"
              >
                {status === "sending" ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
