import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import { getContactInfo, updateContactInfo } from "../../utils/api";

const FIELD_META = [
  { key: "location",    label: "Location",     placeholder: "Gazipur, Dhaka, Bangladesh", icon: "ti-map-pin" },
  { key: "email",       label: "Email",        placeholder: "iubat21103033@gmail.com",    icon: "ti-mail"    },
  { key: "github",      label: "GitHub (display text)", placeholder: "github.com/Khairulhub", icon: "ti-brand-github" },
  { key: "githubUrl",   label: "GitHub URL",   placeholder: "https://github.com/Khairulhub", icon: "ti-link" },
  { key: "linkedin",    label: "LinkedIn (display text)", placeholder: "linkedin.com/in/khairulhub", icon: "ti-brand-linkedin" },
  { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/khairulhub",  icon: "ti-link" },
  { key: "website",     label: "Website (display text)", placeholder: "engr-khairul.netlify.app", icon: "ti-world" },
  { key: "websiteUrl",  label: "Website URL",  placeholder: "https://engr-khairul.netlify.app",   icon: "ti-link" },
  { key: "availability",label: "Availability", placeholder: "Open for Work",                       icon: "ti-clock" },
];

const inp = {
  width: "100%",
  background: "#0a1628",
  border: "1px solid rgba(0,229,255,0.12)",
  borderRadius: 6,
  padding: "10px 14px",
  color: "#c8e8f8",
  fontFamily: "'Exo 2', sans-serif",
  fontSize: 13,
  outline: "none",
  transition: "border-color 0.2s",
};

const ContactInfoAdmin = () => {
  const [form, setForm]       = useState({
    location: "", email: "", github: "", githubUrl: "",
    linkedin: "", linkedinUrl: "", website: "", websiteUrl: "", availability: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getContactInfo();
        if (res.success && res.data) {
          const d = res.data;
          setForm({
            location:     d.location     || "",
            email:        d.email        || "",
            github:       d.github       || "",
            githubUrl:    d.githubUrl    || "",
            linkedin:     d.linkedin     || "",
            linkedinUrl:  d.linkedinUrl  || "",
            website:      d.website      || "",
            websiteUrl:   d.websiteUrl   || "",
            availability: d.availability || "",
          });
        }
      } catch {
        toast.error("Failed to load contact info");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateContactInfo(form);
      if (res.success) toast.success("Contact info updated!");
      else throw new Error(res.message);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>

        {/* header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 3, color: "#2a4a6a", marginBottom: 6 }}>
            // ADMIN.CONTACT_INFO
          </div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: "#00e5ff", letterSpacing: 3, margin: 0 }}>
            CONTACT INFO
          </h1>
          <div style={{ width: 50, height: 2, background: "linear-gradient(90deg,#00e5ff,transparent)", marginTop: 8 }} />
          <p style={{ marginTop: 12, fontSize: 12, color: "#4a7a9b", fontFamily: "'Share Tech Mono',monospace" }}>
            এই তথ্যগুলো Contact section এবং Footer এ দেখানো হয়।
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", padding: 40 }}>
            <i className="ti ti-loader-2" style={{ fontSize: 24, animation: "spin 1s linear infinite", display: "block", marginBottom: 12 }} />
            Loading...
          </div>
        ) : (
          <div
            style={{ background: "#0c1422", border: "1px solid rgba(0,229,255,0.1)", borderRadius: 12, padding: "28px 24px" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 20px" }}>
              {FIELD_META.map(({ key, label, placeholder, icon }) => (
                <div key={key} style={{ gridColumn: key === "location" || key === "email" || key === "availability" ? "1 / -1" : undefined }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 6 }}>
                    <i className={`ti ${icon}`} style={{ fontSize: 11, color: "#005577" }} />
                    {label.toUpperCase()}
                  </label>
                  <input
                    value={form[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    style={inp}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.4)")}
                    onBlur={(e)  => (e.target.style.borderColor = "rgba(0,229,255,0.12)")}
                  />
                </div>
              ))}
            </div>

            {/* Live Preview */}
            <div style={{ marginTop: 28, padding: "16px 20px", background: "#080e1a", borderRadius: 8, border: "1px solid rgba(0,229,255,0.06)" }}>
              <div style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 12 }}>
                // LIVE PREVIEW
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { icon: "ti-map-pin",        val: form.location,    href: null },
                  { icon: "ti-mail",           val: form.email,       href: `mailto:${form.email}` },
                  { icon: "ti-brand-github",   val: form.github,      href: form.githubUrl },
                  { icon: "ti-brand-linkedin", val: form.linkedin,    href: form.linkedinUrl },
                  { icon: "ti-world",          val: form.website,     href: form.websiteUrl },
                  { icon: "ti-clock",          val: `● ${form.availability}`, href: null, green: true },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <i className={`ti ${item.icon}`} style={{ fontSize: 13, color: "#00b8cc", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: item.green ? "#00ff88" : "#c8e8f8", fontFamily: "'Share Tech Mono',monospace" }}>
                      {item.val || <span style={{ opacity: 0.3 }}>—</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                marginTop: 24, width: "100%", padding: "12px 0",
                background: "rgba(0,60,110,0.8)",
                border: "1px solid #00e5ff",
                color: "#00e5ff",
                fontFamily: "'Orbitron',sans-serif", fontSize: 11, letterSpacing: 2,
                borderRadius: 4, cursor: saving ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: saving ? 0.7 : 1, transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = "rgba(0,80,140,0.9)"; }}
              onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = "rgba(0,60,110,0.8)"; }}
            >
              {saving
                ? <><i className="ti ti-loader-2" style={{ fontSize: 14, animation: "spin 1s linear infinite" }} /> SAVING...</>
                : <><i className="ti ti-device-floppy" style={{ fontSize: 14 }} /> SAVE CHANGES</>
              }
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContactInfoAdmin;
