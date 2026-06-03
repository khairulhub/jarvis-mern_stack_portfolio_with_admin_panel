import { useState } from "react";

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxdqIjl2AbydBxMDlqVXOV2h4mM4ZfsEoDmLuZio7mZkpqvs4J2pFmSPboeYRWca-3j/exec"; // ← replace this (see setup below)

const contactInfo = [
  { icon: "ti-map-pin",       label: "LOCATION",     val: "Gazipur, Dhaka, Bangladesh",       href: null,                                          color: "#c8e8f8" },
  { icon: "ti-mail",          label: "EMAIL",         val: "iubat21103033@gmail.com",           href: "mailto:iubat21103033@gmail.com",              color: "#c8e8f8" },
  { icon: "ti-brand-github",  label: "GITHUB",        val: "github.com/Khairulhub",             href: "https://github.com/Khairulhub",              color: "#c8e8f8" },
  { icon: "ti-brand-linkedin",label: "LINKEDIN",      val: "linkedin.com/in/khairulhub",        href: "https://linkedin.com/in/khairulhub",          color: "#c8e8f8" },
  { icon: "ti-world",         label: "WEBSITE",       val: "engr-khairul.netlify.app",          href: "https://engr-khairul.netlify.app",            color: "#c8e8f8" },
  { icon: "ti-clock",         label: "AVAILABILITY",  val: "● Open for Work",                  href: null,                                          color: "#00ff88" },
];

const inputStyle = {
  width: "100%",
  background: "#101c2e",
  border: "1px solid rgba(0,229,255,0.1)",
  borderRadius: 6,
  padding: "11px 14px",
  color: "#c8e8f8",
  fontFamily: "'Exo 2', sans-serif",
  fontSize: 13,
  outline: "none",
  transition: "border-color 0.2s",
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",                       // required for Apps Script
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          submittedAt: new Date().toLocaleString(),
        }),
      });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section
      id="contact"
      className="relative z-[2]"
      style={{ background: "#080e1a", minHeight: "100vh", padding: "80px 0 60px" }}
    >
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8">

        {/* ── header ── */}
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 3, color: "#2a4a6a", marginBottom: 10 }}>
          // CONTACT.INIT
        </div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 26, fontWeight: 700, color: "#00e5ff", letterSpacing: 4, marginBottom: 8 }}>
          CONTACT
        </div>
        <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,#00e5ff,transparent)", marginBottom: 36 }} />

        {/* ── grid: info + form ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LEFT: contact info ── */}
          <div className="flex flex-col gap-3">

            <p style={{ fontSize: 13, color: "#6a9bbf", lineHeight: 1.8, marginBottom: 8 }}>
              Have a project, opportunity, or just want to say hi? Fill the form or reach out directly through any channel below.
            </p>

            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                style={{ background: "#0c1422", border: "1px solid rgba(0,229,255,0.08)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,229,255,0.08)")}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.12)" }}
                >
                  <i className={`ti ${item.icon}`} style={{ fontSize: 17, color: "#00b8cc" }} />
                </div>
                <div className="overflow-hidden">
                  <div style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 2 }}>
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="no-underline transition-colors duration-200"
                      style={{ fontSize: 13, color: item.color, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = item.color)}
                    >
                      {item.val}
                    </a>
                  ) : (
                    <div style={{ fontSize: 13, color: item.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.val}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* terminal status box */}
            {/* <div
              className="rounded-xl p-4 mt-2"
              style={{ background: "#020408", border: "1px solid rgba(0,229,255,0.1)", fontFamily: "'Share Tech Mono',monospace" }}
            >
              <div style={{ fontSize: 9, color: "#2a4a6a", letterSpacing: 3, marginBottom: 8 }}>// SYSTEM.STATUS</div>
              {[
                { key: "RESPONSE_TIME", val: "< 24 hours",     color: "#00ff88" },
                { key: "STATUS",        val: "ONLINE",          color: "#00ff88" },
                { key: "TIMEZONE",      val: "BST (UTC+6)",     color: "#00e5ff" },
                { key: "LANGUAGE",      val: "Bengali, English",color: "#00e5ff" },
              ].map((s) => (
                <div key={s.key} className="flex items-center justify-between" style={{ marginBottom: 5 }}>
                  <span style={{ fontSize: 10, color: "#2a4a6a" }}>{s.key}</span>
                  <span style={{ fontSize: 10, color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div> */}
          </div>

          {/* ── RIGHT: form ── */}
          <div
            className="flex flex-col gap-3 rounded-xl p-5 sm:p-6"
            style={{ background: "#0c1422", border: "1px solid rgba(0,229,255,0.1)" }}
          >
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#2a4a6a", letterSpacing: 2, marginBottom: 4 }}>
              // SEND MESSAGE
            </div>

            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, display: "block", marginBottom: 5 }}>
                  YOUR NAME *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Md Khairul Islam"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.45)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.1)")}
                />
              </div>
              <div>
                <label style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, display: "block", marginBottom: 5 }}>
                  YOUR EMAIL *
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.45)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.1)")}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, display: "block", marginBottom: 5 }}>
                SUBJECT
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Project inquiry / Collaboration / Hire"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.45)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.1)")}
              />
            </div>

            {/* Message */}
            <div>
              <label style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, display: "block", marginBottom: 5 }}>
                MESSAGE *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project or how I can help..."
                rows={5}
                style={{ ...inputStyle, resize: "vertical", minHeight: 110 }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.45)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.1)")}
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              style={{
                width: "100%",
                padding: "11px 28px",
                background: status === "success" ? "rgba(0,255,136,0.1)" : "rgba(0,60,110,0.8)",
                border: `1px solid ${status === "success" ? "#00ff88" : status === "error" ? "#f87171" : "#00e5ff"}`,
                color: status === "success" ? "#00ff88" : status === "error" ? "#f87171" : "#00e5ff",
                fontFamily: "'Orbitron',sans-serif",
                fontSize: 11,
                letterSpacing: 2,
                borderRadius: 4,
                cursor: status === "loading" ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.3s",
                opacity: status === "loading" ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (status === "idle") {
                  e.currentTarget.style.background = "rgba(0,80,140,0.9)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,255,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (status === "idle") {
                  e.currentTarget.style.background = "rgba(0,60,110,0.8)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {status === "loading" && (
                <i className="ti ti-loader-2" style={{ fontSize: 14, animation: "spin 1s linear infinite" }} />
              )}
              {status === "success" && <i className="ti ti-check" style={{ fontSize: 14 }} />}
              {status === "error"   && <i className="ti ti-alert-circle" style={{ fontSize: 14 }} />}
              {status === "idle"    && <i className="ti ti-send" style={{ fontSize: 14 }} />}

              {status === "loading" ? "TRANSMITTING..."
                : status === "success" ? "MESSAGE SENT!"
                : status === "error"   ? "FAILED — RETRY"
                : "SEND MESSAGE"}
            </button>

            {/* success message */}
            {status === "success" && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg"
                style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.2)" }}
              >
                <i className="ti ti-circle-check" style={{ fontSize: 16, color: "#00ff88", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#00ff88", fontFamily: "'Share Tech Mono',monospace" }}>
                  Message received! I'll respond within 24 hours.
                </span>
              </div>
            )}

            {status === "error" && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg"
                style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.2)" }}
              >
                <i className="ti ti-alert-circle" style={{ fontSize: 16, color: "#f87171", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#f87171", fontFamily: "'Share Tech Mono',monospace" }}>
                  Submission failed. Please email directly at iubat21103033@gmail.com
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;