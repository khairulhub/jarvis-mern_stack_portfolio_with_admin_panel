import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import { getFooterBrand, updateFooterBrand } from "../../utils/api";

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

const DEFAULT = {
  logoText:      "K",
  brandName:     "KHAIRULHUB",
  taglineText:   "Full Stack Developer & Network Engineer based in Dhaka, Bangladesh. Building robust apps & networks.",
  copyrightText: "© 2025 KhairulHub. All rights reserved.",
  imageUrl:      "",
  showImage:     false,
  imageOnly:     false,
};

/* ── Logo preview — component এর বাইরে define করা ── */
const LogoPreview = ({ form }) => {
  if (form.imageOnly && form.imageUrl) {
    return (
      <img
        src={form.imageUrl}
        alt="logo preview"
        style={{ maxHeight: 44, maxWidth: 180, objectFit: "contain" }}
      />
    );
  }

  const icon =
    form.showImage && form.imageUrl ? (
      <img
        src={form.imageUrl}
        alt="logo"
        style={{
          width: 36, height: 36, borderRadius: "50%",
          objectFit: "cover", border: "2px solid #00e5ff", flexShrink: 0,
        }}
      />
    ) : (
      <div
        style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "2px solid #00e5ff", color: "#00e5ff",
          fontSize: 13, fontWeight: 900,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Orbitron', sans-serif", flexShrink: 0,
        }}
      >
        {form.logoText || "K"}
      </div>
    );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {icon}
      <span
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 16, fontWeight: 900,
          color: "#00e5ff", letterSpacing: 3,
        }}
      >
        {form.brandName || "KHAIRULHUB"}
      </span>
    </div>
  );
};

/* ── Toggle — component এর বাইরে define করা ── */
const Toggle = ({ label, fieldKey, note, value, onChange }) => (
  <div
    style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      padding: "12px 16px",
      background: "#0a1628",
      border: `1px solid ${value ? "rgba(0,229,255,0.35)" : "rgba(0,229,255,0.12)"}`,
      borderRadius: 8, cursor: "pointer", transition: "border-color 0.2s",
    }}
    onClick={() => onChange(fieldKey, !value)}
  >
    <div>
      <div style={{ fontSize: 12, color: "#c8e8f8", fontFamily: "'Exo 2', sans-serif", marginBottom: 2 }}>
        {label}
      </div>
      {note && (
        <div style={{ fontSize: 10, color: "#4a7a9b", fontFamily: "'Share Tech Mono', monospace" }}>
          {note}
        </div>
      )}
    </div>
    <div
      style={{
        width: 42, height: 24, borderRadius: 12,
        background: value ? "#00e5ff" : "#1a2a3a",
        border: "1px solid rgba(0,229,255,0.3)",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute", top: 3,
          left: value ? 20 : 3,
          width: 16, height: 16, borderRadius: "50%",
          background: value ? "#080e1a" : "#2a4a6a",
          transition: "left 0.2s",
        }}
      />
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════ */
const FooterBrandAdmin = () => {
  const [form,    setForm]    = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getFooterBrand();
        if (res.success && res.data) {
          const d = res.data;
          setForm({
            logoText:      d.logoText      || "",
            brandName:     d.brandName     || "",
            taglineText:   d.taglineText   || "",
            copyrightText: d.copyrightText || "",
            imageUrl:      d.imageUrl      || "",
            showImage:     !!d.showImage,
            imageOnly:     !!d.imageOnly,
          });
        }
      } catch {
        toast.error("Failed to load footer brand");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateFooterBrand(form);
      if (res.success) toast.success("Footer brand updated!");
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
            // ADMIN.FOOTER_BRAND
          </div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: "#00e5ff", letterSpacing: 3, margin: 0 }}>
            FOOTER & NAVBAR BRAND
          </h1>
          <div style={{ width: 50, height: 2, background: "linear-gradient(90deg,#00e5ff,transparent)", marginTop: 8 }} />
          <p style={{ marginTop: 12, fontSize: 12, color: "#4a7a9b", fontFamily: "'Share Tech Mono',monospace" }}>
            Footer এবং Navbar এর logo, brand name, tagline ও copyright text এখান থেকে edit করা যাবে।
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", padding: 40 }}>
            <i className="ti ti-loader-2" style={{ fontSize: 24, animation: "spin 1s linear infinite", display: "block", marginBottom: 12 }} />
            Loading...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* ─ Text fields ─ */}
            <div style={{ background: "#0c1422", border: "1px solid rgba(0,229,255,0.1)", borderRadius: 12, padding: "24px 20px" }}>
              <div style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 16 }}>
                // LOGO TEXT & BRAND NAME
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>

                <div>
                  <label style={{ display: "block", fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 6 }}>
                    CIRCLE LETTER (LOGO TEXT)
                  </label>
                  <input
                    value={form.logoText}
                    onChange={(e) => set("logoText", e.target.value)}
                    placeholder="K"
                    maxLength={3}
                    style={inp}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.4)")}
                    onBlur={(e)  => (e.target.style.borderColor = "rgba(0,229,255,0.12)")}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 6 }}>
                    BRAND NAME
                  </label>
                  <input
                    value={form.brandName}
                    onChange={(e) => set("brandName", e.target.value)}
                    placeholder="KHAIRULHUB"
                    style={inp}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.4)")}
                    onBlur={(e)  => (e.target.style.borderColor = "rgba(0,229,255,0.12)")}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 6 }}>
                    TAGLINE (FOOTER DESCRIPTION)
                  </label>
                  <textarea
                    value={form.taglineText}
                    onChange={(e) => set("taglineText", e.target.value)}
                    placeholder="Full Stack Developer..."
                    rows={3}
                    style={{ ...inp, resize: "vertical" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.4)")}
                    onBlur={(e)  => (e.target.style.borderColor = "rgba(0,229,255,0.12)")}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 6 }}>
                    COPYRIGHT TEXT
                  </label>
                  <input
                    value={form.copyrightText}
                    onChange={(e) => set("copyrightText", e.target.value)}
                    placeholder="© 2025 KhairulHub. All rights reserved."
                    style={inp}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.4)")}
                    onBlur={(e)  => (e.target.style.borderColor = "rgba(0,229,255,0.12)")}
                  />
                </div>
              </div>
            </div>

            {/* ─ Image options ─ */}
            <div style={{ background: "#0c1422", border: "1px solid rgba(0,229,255,0.1)", borderRadius: 12, padding: "24px 20px" }}>
              <div style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 16 }}>
                // IMAGE OPTIONS
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 6 }}>
                  IMAGE URL (OPTIONAL)
                </label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => set("imageUrl", e.target.value)}
                  placeholder="https://example.com/logo.png"
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.4)")}
                  onBlur={(e)  => (e.target.style.borderColor = "rgba(0,229,255,0.12)")}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Toggle
                  label="Circle এর বদলে Image দেখাও"
                  fieldKey="showImage"
                  note="Logo circle এর জায়গায় image দেখাবে, পাশে brand name থাকবে"
                  value={form.showImage}
                  onChange={set}
                />
                <Toggle
                  label="পুরো Logo section এর বদলে শুধু Image"
                  fieldKey="imageOnly"
                  note="Brand name ও circle সব বাদ — শুধু image দেখাবে"
                  value={form.imageOnly}
                  onChange={set}
                />
              </div>
            </div>

            {/* ─ Live Preview ─ */}
            <div style={{ background: "#080e1a", border: "1px solid rgba(0,229,255,0.07)", borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 16 }}>
                // LIVE PREVIEW
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, color: "#4a7a9b", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, marginBottom: 8 }}>
                  Navbar logo:
                </div>
                <div
                  style={{
                    display: "inline-flex", alignItems: "center",
                    background: "rgba(4,8,15,0.95)",
                    padding: "10px 16px", borderRadius: 8,
                    border: "1px solid rgba(0,229,255,0.2)",
                  }}
                >
                  <LogoPreview form={form} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 9, color: "#4a7a9b", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, marginBottom: 8 }}>
                  Footer copyright:
                </div>
                <p style={{ fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, margin: 0 }}>
                  {form.copyrightText}
                </p>
              </div>
            </div>

            {/* ─ Save ─ */}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: "100%", padding: "12px 0",
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

export default FooterBrandAdmin;