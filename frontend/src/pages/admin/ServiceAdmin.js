import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getAdminServices,
  createService,
  updateService,
  deleteService,
  toggleService,
} from "../../utils/api";

// ── Color presets ─────────────────────────────────────────────
const COLOR_PRESETS = [
  { label: "Cyan",   color: "#00e5ff", colorBg: "rgba(0,229,255,0.08)",   colorBorder: "rgba(0,229,255,0.25)"   },
  { label: "Sky",    color: "#38bdf8", colorBg: "rgba(56,189,248,0.08)",  colorBorder: "rgba(56,189,248,0.25)"  },
  { label: "Purple", color: "#c084fc", colorBg: "rgba(168,85,247,0.08)",  colorBorder: "rgba(168,85,247,0.25)"  },
  { label: "Orange", color: "#ffa040", colorBg: "rgba(255,140,0,0.08)",   colorBorder: "rgba(255,140,0,0.25)"   },
  { label: "Yellow", color: "#facc15", colorBg: "rgba(250,204,21,0.08)",  colorBorder: "rgba(250,204,21,0.25)"  },
  { label: "Red",    color: "#f87171", colorBg: "rgba(239,68,68,0.08)",   colorBorder: "rgba(239,68,68,0.25)"   },
  { label: "Green",  color: "#22c55e", colorBg: "rgba(34,197,94,0.08)",   colorBorder: "rgba(34,197,94,0.25)"   },
  { label: "Pink",   color: "#ec4899", colorBg: "rgba(236,72,153,0.08)",  colorBorder: "rgba(236,72,153,0.25)"  },
];

// ── Common tabler icons for services ──────────────────────────
const ICON_OPTIONS = [
  "ti-brand-react", "ti-brand-php", "ti-brand-windows", "ti-brand-python",
  "ti-brand-nodejs", "ti-brand-javascript", "ti-brand-typescript",
  "ti-network", "ti-shield-lock", "ti-device-desktop-analytics",
  "ti-server", "ti-database", "ti-cloud", "ti-code",
  "ti-terminal-2", "ti-device-laptop", "ti-rocket", "ti-star",
  "ti-palette", "ti-layout-dashboard", "ti-api", "ti-lock",
  "ti-wifi", "ti-cpu", "ti-settings", "ti-tool",
];

const EMPTY_FORM = {
  icon: "ti-code",
  title: "",
  desc: "",
  tags: "",          // comma-separated string → array on save
  color: "#00e5ff",
  colorBg: "rgba(0,229,255,0.08)",
  colorBorder: "rgba(0,229,255,0.25)",
  isActive: true,
  order: 0,
};

// ── Shared input style ────────────────────────────────────────
const inp = {
  width: "100%",
  background: "#060d18",
  border: "1px solid rgba(0,229,255,0.15)",
  borderRadius: 8,
  padding: "9px 12px",
  color: "#c8e8f8",
  fontSize: 13,
  outline: "none",
  fontFamily: "'Share Tech Mono', monospace",
};

const ServiceAdmin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState(null);

  // ── Load ───────────────────────────────────────────────────
  const load = async () => {
    try {
      const res = await getAdminServices();
      if (res.success) setServices(res.data);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── Open modal ─────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (svc) => {
    setEditingId(svc._id);
    setForm({
      icon:        svc.icon        || "ti-code",
      title:       svc.title       || "",
      desc:        svc.desc        || "",
      tags:        Array.isArray(svc.tags) ? svc.tags.join(", ") : "",
      color:       svc.color       || "#00e5ff",
      colorBg:     svc.colorBg     || "rgba(0,229,255,0.08)",
      colorBorder: svc.colorBorder || "rgba(0,229,255,0.25)",
      isActive:    svc.isActive    ?? true,
      order:       svc.order       ?? 0,
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  // ── Form helpers ───────────────────────────────────────────
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const applyPreset = (preset) => {
    setForm((f) => ({ ...f, color: preset.color, colorBg: preset.colorBg, colorBorder: preset.colorBorder }));
  };

  // ── Save ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        order: Number(form.order) || 0,
      };

      let res;
      if (editingId) {
        res = await updateService(editingId, payload);
      } else {
        res = await createService(payload);
      }

      if (res.success) {
        toast.success(editingId ? "Service updated!" : "Service created!");
        closeModal();
        load();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle active ──────────────────────────────────────────
  const handleToggle = async (id) => {
    try {
      const res = await toggleService(id);
      if (res.success) {
        toast.success(res.message);
        setServices((prev) =>
          prev.map((s) => (s._id === id ? { ...s, isActive: !s.isActive } : s))
        );
      }
    } catch {
      toast.error("Toggle failed");
    }
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteService(deleteId);
      if (res.success) {
        toast.success("Service deleted");
        setServices((prev) => prev.filter((s) => s._id !== deleteId));
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  // ── Styles ────────────────────────────────────────────────
  const card = {
    background: "#0c1422",
    border: "1px solid rgba(0,229,255,0.1)",
    borderRadius: 12,
    padding: 20,
  };

  const btn = (bg, hover) => ({
    background: bg,
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    color: "#fff",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: 1,
  });

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 16px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#2a4a6a", marginBottom: 6 }}>
              // ADMIN.SERVICES
            </div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 700, color: "#00e5ff", letterSpacing: 3 }}>
              SERVICES
            </div>
          </div>
          <button
            onClick={openCreate}
            style={{ ...btn("rgba(0,229,255,0.15)"), border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff", display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}
          >
            <i className="ti ti-plus" style={{ fontSize: 16 }} />
            NEW SERVICE
          </button>
        </div>

        {/* ── Stats bar ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {[
            { label: "TOTAL", val: services.length, color: "#00e5ff" },
            { label: "ACTIVE", val: services.filter((s) => s.isActive).length, color: "#22c55e" },
            { label: "INACTIVE", val: services.filter((s) => !s.isActive).length, color: "#f87171" },
          ].map((stat) => (
            <div key={stat.label} style={{ ...card, flex: 1, textAlign: "center", padding: "14px 12px" }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.val}</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#2a4a6a", letterSpacing: 2, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", fontSize: 12 }}>
            LOADING...
          </div>
        )}

        {/* ── Service list ── */}
        {!loading && services.length === 0 && (
          <div style={{ ...card, textAlign: "center", padding: 60, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", fontSize: 12 }}>
            NO SERVICES FOUND — CREATE ONE
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {services.map((svc, i) => (
            <div
              key={svc._id}
              style={{
                ...card,
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: svc.isActive ? 1 : 0.5,
                transition: "opacity 0.3s",
                border: svc.isActive ? "1px solid rgba(0,229,255,0.1)" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Order badge */}
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(0,229,255,0.3)", minWidth: 24, textAlign: "center" }}>
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Icon box */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: svc.colorBg,
                  border: `1px solid ${svc.colorBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: svc.color,
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                <i className={`ti ${svc.icon}`} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 700, color: "#c8e8f8", letterSpacing: 1, marginBottom: 4 }}>
                  {svc.title}
                </div>
                <div style={{ fontSize: 11, color: "#3a6a8a", lineHeight: 1.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {svc.desc}
                </div>
                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                  {(svc.tags || []).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 9,
                        color: svc.color,
                        background: svc.colorBg,
                        border: `1px solid ${svc.colorBorder}`,
                        borderRadius: 99,
                        padding: "1px 7px",
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: 1,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {/* Active badge */}
                <span
                  style={{
                    fontSize: 9,
                    padding: "3px 10px",
                    borderRadius: 99,
                    fontFamily: "'Share Tech Mono', monospace",
                    letterSpacing: 1,
                    color: svc.isActive ? "#22c55e" : "#f87171",
                    background: svc.isActive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${svc.isActive ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                  }}
                >
                  {svc.isActive ? "ACTIVE" : "INACTIVE"}
                </span>

                {/* Toggle button */}
                <button
                  onClick={() => handleToggle(svc._id)}
                  title={svc.isActive ? "Deactivate" : "Activate"}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(0,229,255,0.15)",
                    borderRadius: 8,
                    padding: "6px 10px",
                    color: svc.isActive ? "#f87171" : "#22c55e",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  <i className={`ti ${svc.isActive ? "ti-eye-off" : "ti-eye"}`} />
                </button>

                {/* Edit button */}
                <button
                  onClick={() => openEdit(svc)}
                  title="Edit"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(0,229,255,0.15)",
                    borderRadius: 8,
                    padding: "6px 10px",
                    color: "#00e5ff",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  <i className="ti ti-edit" />
                </button>

                {/* Delete button */}
                <button
                  onClick={() => setDeleteId(svc._id)}
                  title="Delete"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 8,
                    padding: "6px 10px",
                    color: "#f87171",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  <i className="ti ti-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          CREATE / EDIT MODAL
      ════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            style={{
              background: "#0c1422",
              border: "1px solid rgba(0,229,255,0.2)",
              borderRadius: 16,
              padding: 28,
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 700, color: "#00e5ff", letterSpacing: 2 }}>
                {editingId ? "EDIT SERVICE" : "NEW SERVICE"}
              </div>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", color: "#3a6a8a", cursor: "pointer", fontSize: 18 }}>
                <i className="ti ti-x" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Title */}
              <div>
                <label style={{ fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2, display: "block", marginBottom: 6 }}>TITLE *</label>
                <input style={inp} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. MERN STACK DEV" />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2, display: "block", marginBottom: 6 }}>DESCRIPTION</label>
                <textarea
                  style={{ ...inp, minHeight: 80, resize: "vertical" }}
                  value={form.desc}
                  onChange={(e) => set("desc", e.target.value)}
                  placeholder="Service description..."
                />
              </div>

              {/* Tags */}
              <div>
                <label style={{ fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2, display: "block", marginBottom: 6 }}>TAGS (comma separated)</label>
                <input style={inp} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="React, Node.js, MongoDB" />
              </div>

              {/* Icon picker */}
              <div>
                <label style={{ fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2, display: "block", marginBottom: 8 }}>ICON</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {ICON_OPTIONS.map((ico) => (
                    <button
                      key={ico}
                      onClick={() => set("icon", ico)}
                      title={ico}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        background: form.icon === ico ? form.colorBg : "rgba(0,229,255,0.03)",
                        border: form.icon === ico ? `1px solid ${form.colorBorder}` : "1px solid rgba(0,229,255,0.08)",
                        color: form.icon === ico ? form.color : "#3a6a8a",
                        fontSize: 18,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <i className={`ti ${ico}`} />
                    </button>
                  ))}
                </div>
                {/* Manual icon input */}
                <input
                  style={{ ...inp, marginTop: 8 }}
                  value={form.icon}
                  onChange={(e) => set("icon", e.target.value)}
                  placeholder="or type icon class: ti-brand-react"
                />
              </div>

              {/* Color preset picker */}
              <div>
                <label style={{ fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2, display: "block", marginBottom: 8 }}>COLOR</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p)}
                      title={p.label}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: p.color,
                        border: form.color === p.color ? "2px solid #fff" : "2px solid transparent",
                        cursor: "pointer",
                        transition: "border 0.2s",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Order & Active row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2, display: "block", marginBottom: 6 }}>ORDER</label>
                  <input type="number" style={inp} value={form.order} onChange={(e) => set("order", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2, display: "block", marginBottom: 6 }}>STATUS</label>
                  <div
                    onClick={() => set("isActive", !form.isActive)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      background: "#060d18",
                      border: "1px solid rgba(0,229,255,0.15)",
                      borderRadius: 8,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 20,
                      borderRadius: 10,
                      background: form.isActive ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.2)",
                      border: `1px solid ${form.isActive ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.3)"}`,
                      position: "relative",
                      transition: "all 0.3s",
                    }}>
                      <div style={{
                        position: "absolute",
                        top: 2,
                        left: form.isActive ? 18 : 2,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: form.isActive ? "#22c55e" : "#f87171",
                        transition: "left 0.3s",
                      }} />
                    </div>
                    <span style={{ fontSize: 11, color: form.isActive ? "#22c55e" : "#f87171", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
                      {form.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div style={{ background: "#060d18", border: "1px solid rgba(0,229,255,0.08)", borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2, marginBottom: 12 }}>PREVIEW</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: form.colorBg, border: `1px solid ${form.colorBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: form.color, fontSize: 22 }}>
                    <i className={`ti ${form.icon}`} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 700, color: "#c8e8f8", letterSpacing: 1 }}>{form.title || "SERVICE TITLE"}</div>
                    <div style={{ fontSize: 10, color: "#3a6a8a", marginTop: 3 }}>{form.desc ? form.desc.substring(0, 60) + "..." : "Description..."}</div>
                  </div>
                </div>
              </div>

              {/* Save / Cancel */}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  onClick={closeModal}
                  style={{ flex: 1, background: "transparent", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 8, padding: "10px 0", color: "#3a6a8a", fontSize: 12, cursor: "pointer", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ flex: 2, background: saving ? "rgba(0,229,255,0.05)" : "rgba(0,229,255,0.15)", border: "1px solid rgba(0,229,255,0.3)", borderRadius: 8, padding: "10px 0", color: "#00e5ff", fontSize: 12, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}
                >
                  {saving ? "SAVING..." : editingId ? "UPDATE SERVICE" : "CREATE SERVICE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          DELETE CONFIRM DIALOG
      ════════════════════════════════════════════════════════ */}
      {deleteId && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1100,
            background: "rgba(0,0,0,0.8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
        >
          <div style={{ background: "#0c1422", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, padding: 28, maxWidth: 380, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 700, color: "#f87171", letterSpacing: 2, marginBottom: 10 }}>DELETE SERVICE?</div>
            <div style={{ fontSize: 12, color: "#3a6a8a", fontFamily: "'Share Tech Mono', monospace", marginBottom: 24 }}>This action cannot be undone.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, background: "transparent", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 8, padding: "10px 0", color: "#3a6a8a", fontSize: 12, cursor: "pointer", fontFamily: "'Share Tech Mono', monospace" }}>CANCEL</button>
              <button onClick={handleDelete} style={{ flex: 1, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 0", color: "#f87171", fontSize: 12, cursor: "pointer", fontFamily: "'Share Tech Mono', monospace" }}>DELETE</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ServiceAdmin;