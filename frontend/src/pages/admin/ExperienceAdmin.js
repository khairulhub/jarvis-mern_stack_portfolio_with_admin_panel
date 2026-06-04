import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../utils/api";

// ── Color presets for quick selection ────────────────────────
const COLOR_PRESETS = [
  { label: "Cyan",   color: "#00e5ff", colorBg: "rgba(0,229,255,0.08)",   colorBorder: "rgba(0,229,255,0.25)"   },
  { label: "Yellow", color: "#facc15", colorBg: "rgba(250,204,21,0.08)",  colorBorder: "rgba(250,204,21,0.25)"  },
  { label: "Purple", color: "#a855f7", colorBg: "rgba(168,85,247,0.08)",  colorBorder: "rgba(168,85,247,0.25)"  },
  { label: "Green",  color: "#22c55e", colorBg: "rgba(34,197,94,0.08)",   colorBorder: "rgba(34,197,94,0.25)"   },
  { label: "Orange", color: "#f97316", colorBg: "rgba(249,115,22,0.08)",  colorBorder: "rgba(249,115,22,0.25)"  },
  { label: "Pink",   color: "#ec4899", colorBg: "rgba(236,72,153,0.08)",  colorBorder: "rgba(236,72,153,0.25)"  },
];

const ICON_OPTIONS = [
  "ti-briefcase", "ti-building", "ti-code", "ti-terminal-2",
  "ti-server", "ti-network", "ti-device-laptop", "ti-rocket",
  "ti-star", "ti-shield", "ti-database", "ti-cloud",
];

const EMPTY_FORM = {
  company: "", designation: "", period: "", duration: "",
  type: "Full Time", icon: "ti-briefcase",
  color: "#00e5ff", colorBg: "rgba(0,229,255,0.08)", colorBorder: "rgba(0,229,255,0.25)",
  location: "Dhaka, Bangladesh", description: "",
  skills: "", projects: "", order: 0,
};

const ExperienceAdmin = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingId, setEditingId]     = useState(null); // null = create mode
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [deleteId, setDeleteId]       = useState(null); // confirm dialog

  // ── Load all experiences ──────────────────────────────────
  const loadExperiences = async () => {
    try {
      const res = await getExperiences();
      if (res.success) setExperiences(res.data);
    } catch (err) {
      toast.error("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadExperiences(); }, []);

  // ── Open modal ────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (exp) => {
    setEditingId(exp._id);
    setForm({
      company:     exp.company     || "",
      designation: exp.designation || "",
      period:      exp.period      || "",
      duration:    exp.duration    || "",
      type:        exp.type        || "Full Time",
      icon:        exp.icon        || "ti-briefcase",
      color:       exp.color       || "#00e5ff",
      colorBg:     exp.colorBg     || "rgba(0,229,255,0.08)",
      colorBorder: exp.colorBorder || "rgba(0,229,255,0.25)",
      location:    exp.location    || "Dhaka, Bangladesh",
      description: exp.description || "",
      skills:      Array.isArray(exp.skills)   ? exp.skills.join(", ")   : "",
      projects:    Array.isArray(exp.projects) ? exp.projects.join(", ") : "",
      order:       exp.order ?? 0,
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM); };

  // ── Form change ───────────────────────────────────────────
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const applyColorPreset = (preset) =>
    setForm((prev) => ({ ...prev, color: preset.color, colorBg: preset.colorBg, colorBorder: preset.colorBorder }));

  // ── Save (create or update) ───────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.company || !form.designation || !form.period || !form.description) {
      toast.error("Company, Designation, Period, and Description are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills:   form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        projects: form.projects.split(",").map((s) => s.trim()).filter(Boolean),
        order:    Number(form.order) || 0,
      };

      if (editingId) {
        await updateExperience(editingId, payload);
        toast.success("Experience updated!");
      } else {
        await createExperience(payload);
        toast.success("Experience created!");
      }
      closeModal();
      loadExperiences();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteExperience(id);
      toast.success("Experience deleted");
      setDeleteId(null);
      loadExperiences();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ── UI ────────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Experiences</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage work experience entries shown in the About section modal.
            </p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-xl transition-all">
            + Add Experience
          </button>
        </div>

        {/* Experience list */}
        {experiences.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-16 text-center text-slate-500">
            <p className="text-4xl mb-3">💼</p>
            <p>No experiences yet.</p>
            <button onClick={openCreate} className="mt-4 text-cyan-400 hover:underline text-sm">
              Add your first experience →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition-all">

                {/* Color icon */}
                <div className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 44, height: 44, borderRadius: 10, background: exp.colorBg, border: `1px solid ${exp.colorBorder}`, color: exp.color, fontSize: 20 }}>
                  <i className={`ti ${exp.icon}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">{exp.company}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      Order: {exp.order}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">{exp.designation}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{exp.period} · {exp.duration} · {exp.type}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(exp)}
                    className="px-3 py-1.5 text-xs border border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 rounded-lg transition-all">
                    Edit
                  </button>
                  <button onClick={() => setDeleteId(exp._id)}
                    className="px-3 py-1.5 text-xs border border-slate-700 hover:border-red-500 text-slate-400 hover:text-red-400 rounded-lg transition-all">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={closeModal}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl"
            onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-white font-semibold">
                {editingId ? "Edit Experience" : "Add Experience"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">

              {/* Row 1: company + designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Company *</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Google"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Designation *</label>
                  <input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Sr. Developer"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500" />
                </div>
              </div>

              {/* Row 2: period + duration + type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Period *</label>
                  <input name="period" value={form.period} onChange={handleChange} placeholder="Jan 2024 – Dec 2024"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Duration</label>
                  <input name="duration" value={form.duration} onChange={handleChange} placeholder="12 months"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Type</label>
                  <select name="type" value={form.type} onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500">
                    {["Full Time", "Part Time", "Freelance", "Internship", "Contract"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: location + order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Location</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Dhaka, Bangladesh"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Display Order (lower = first)</label>
                  <input type="number" name="order" value={form.order} onChange={handleChange} min={0}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="What did you do in this role?"
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 resize-none" />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Skills / Tech Stack (comma separated)</label>
                <input name="skills" value={form.skills} onChange={handleChange}
                  placeholder="React, Node.js, MongoDB, Docker"
                  className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500" />
                {/* preview */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.skills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px]"
                      style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", color: "#00b8cc" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Projects Delivered (comma separated)</label>
                <input name="projects" value={form.projects} onChange={handleChange}
                  placeholder="Project Alpha, Project Beta"
                  className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500" />
              </div>

              {/* Icon picker */}
              <div>
                <label className="block text-xs text-slate-400 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((ic) => (
                    <button key={ic} type="button"
                      onClick={() => setForm((p) => ({ ...p, icon: ic }))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: form.icon === ic ? "rgba(0,229,255,0.15)" : "rgba(255,255,255,0.04)",
                        border: form.icon === ic ? "1px solid #00e5ff" : "1px solid rgba(255,255,255,0.08)",
                        color: form.icon === ic ? "#00e5ff" : "#6a9bbf",
                        fontSize: 16,
                      }}>
                      <i className={`ti ${ic}`} />
                    </button>
                  ))}
                </div>
                <input name="icon" value={form.icon} onChange={handleChange} placeholder="ti-briefcase"
                  className="mt-2 w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500" />
              </div>

              {/* Color preset */}
              <div>
                <label className="block text-xs text-slate-400 mb-2">Color Theme</label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_PRESETS.map((p) => (
                    <button key={p.label} type="button" onClick={() => applyColorPreset(p)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
                      style={{
                        background: p.colorBg,
                        border: `1px solid ${form.color === p.color ? p.color : p.colorBorder}`,
                        color: p.color,
                      }}>
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                      {p.label}
                    </button>
                  ))}
                </div>
                {/* live preview */}
                <div className="mt-3 flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: form.colorBg, border: `1px solid ${form.colorBorder}` }}>
                  <div className="flex items-center justify-center"
                    style={{ width: 36, height: 36, borderRadius: 8, background: form.colorBg, border: `1px solid ${form.colorBorder}`, color: form.color, fontSize: 18 }}>
                    <i className={`ti ${form.icon}`} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: form.color }}>{form.company || "Company"}</div>
                    <div style={{ fontSize: 10, color: "#6a9bbf" }}>{form.designation || "Designation"}</div>
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="px-5 py-2.5 border border-slate-700 text-slate-400 hover:text-white text-sm rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all">
                  {saving ? "Saving…" : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Dialog ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setDeleteId(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-semibold mb-2">Delete Experience?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-white text-sm rounded-xl transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ExperienceAdmin;