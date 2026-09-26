import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

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

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-nacos-blue mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">
        Have a question, suggestion, or want to partner with NACOS KKU VOM? Send us a message.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card p-4">
          <h3 className="text-sm text-gray-500">Email</h3>
          <p className="text-sm font-medium text-nacos-blue mt-1 break-all">
            nacoskkuvom@gmail.com
          </p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm text-gray-500">Phone</h3>
          <p className="text-sm font-medium text-nacos-blue mt-1">
            +234 908 485 0109
          </p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm text-gray-500">Location</h3>
          <p className="text-sm font-medium text-nacos-blue mt-1">
            Karl Kumm University, Vom
          </p>
        </div>
      </div>

      {status === "success" ? (
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-nacos-blue mb-2">Message Sent</h2>
          <p className="text-gray-600 mb-4">
            Thank you for reaching out. We'll get back to you soon.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="btn-outline"
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="card p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input className="input" value={form.name} onChange={update("name")} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input className="input" value={form.subject} onChange={update("subject")} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
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
            className="btn-primary w-full"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </section>
  );
}