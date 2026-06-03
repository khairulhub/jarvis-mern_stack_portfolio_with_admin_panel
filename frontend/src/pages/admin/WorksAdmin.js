import React, { useState, useEffect, useCallback, useRef } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import ImageUpload from "../../components/common/ImageUpload";
import toast from "react-hot-toast";
import axios from "axios";
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
  HiOutlineX, HiOutlineSave, HiOutlineEye, HiOutlineEyeOff,
  HiOutlineCode,
} from "react-icons/hi";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});
API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const CATEGORIES = ["MERN", "LARAVEL", "NETWORKING", "IoT", "SECURITY", "OTHER"];

const emptyWork = {
  title: "", subtitle: "", category: "MERN",
  shortDesc: "", longDesc: "",
  features: [""],
  tags: "",
  icon: "", iconBg: "",
  image: "", imageDeleteUrl: "",
  accentColor: "", accentBg: "", accentBorder: "",
  url: "", github: "",
  order: 0,
};

/* ─── TAG INPUT ──────────────────────────────────────────────── */
function TagInput({ value, onChange }) {
  const [input, setInput] = useState("");
  const tags = Array.isArray(value) ? value : [];

  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  };
  const remove = (t) => onChange(tags.filter((x) => x !== t));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-slate-700 text-slate-200">
            {t}
            <button type="button" onClick={() => remove(t)} className="text-slate-400 hover:text-red-400 transition-colors">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Type tag, press Enter"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button type="button" onClick={add}
          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-xl transition-all">
          Add
        </button>
      </div>
    </div>
  );
}

/* ─── FEATURE LIST INPUT ─────────────────────────────────────── */
function FeaturesInput({ value, onChange }) {
  const features = Array.isArray(value) ? value : [""];

  const update = (i, v) => {
    const arr = [...features];
    arr[i] = v;
    onChange(arr);
  };
  const add    = () => onChange([...features, ""]);
  const remove = (i) => onChange(features.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={f} onChange={(e) => update(i, e.target.value)}
            placeholder={`Feature ${i + 1}`}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          {features.length > 1 && (
            <button type="button" onClick={() => remove(i)}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors">
              <HiOutlineX className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={add}
        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1">
        <HiOutlinePlus className="w-3.5 h-3.5" /> Add feature
      </button>
    </div>
  );
}

/* ─── ACCENT PREVIEW ─────────────────────────────────────────── */
function AccentPreview({ color, bg, border }) {
  if (!color) return null;
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg border text-xs mt-1"
      style={{ background: bg, borderColor: border, color: color, fontFamily: "monospace" }}>
      ● Accent preview — {color}
    </div>
  );
}

/* ─── WORKS ADMIN PAGE ───────────────────────────────────────── */
const WorksAdmin = () => {
  const [works,     setWorks]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form,      setForm]      = useState(emptyWork);
  const [saving,    setSaving]    = useState(false);
  const [deleteId,  setDeleteId]  = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  // ── Fetch ───────────────────────────────────────────────────
  const fetchWorks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/works/admin/all");
      setWorks(data.data || []);
    } catch {
      toast.error("Failed to load works");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWorks(); }, [fetchWorks]);

  // ── Modal helpers ───────────────────────────────────────────
  const openCreate = () => { setForm(emptyWork); setEditingId(null); setModalOpen(true); };
  const openEdit   = (w) => {
    setForm({
      title: w.title || "", subtitle: w.subtitle || "", category: w.category || "MERN",
      shortDesc: w.shortDesc || "", longDesc: w.longDesc || "",
      features: w.features?.length ? w.features : [""],
      tags: w.tags || [],
      icon: w.icon || "", iconBg: w.iconBg || "",
      image: w.image || "", imageDeleteUrl: w.imageDeleteUrl || "",
      accentColor: w.accentColor || "", accentBg: w.accentBg || "", accentBorder: w.accentBorder || "",
      url: w.url || "", github: w.github || "",
      order: w.order ?? 0,
    });
    setEditingId(w._id);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ── Save ────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) return toast.error("Title and category are required");

    setSaving(true);
    try {
      const payload = {
        ...form,
        features: (form.features || []).filter((f) => f.trim() !== ""),
        tags: Array.isArray(form.tags) ? form.tags : [],
      };

      if (editingId) {
        await API.put(`/works/${editingId}`, payload);
        toast.success("Work updated!");
      } else {
        await API.post("/works", payload);
        toast.success("Work created!");
      }
      setModalOpen(false);
      fetchWorks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle active ───────────────────────────────────────────
  const handleToggle = async (id) => {
    try {
      await API.patch(`/works/${id}/toggle`);
      fetchWorks();
    } catch { toast.error("Toggle failed"); }
  };

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await API.delete(`/works/${id}`);
      toast.success("Work deleted (image removed from imgBB)");
      setDeleteId(null);
      fetchWorks();
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  // ── Handle image upload — store url + deleteUrl ─────────────
  const handleImageUpload = (url, deleteUrl = "") => {
    setForm((f) => ({ ...f, image: url, imageDeleteUrl: deleteUrl || f.imageDeleteUrl }));
  };

  // ── Image replace: we need to also get the deleteUrl from the upload response ──
  // The ImageUpload component currently just returns the URL.
  // We handle deleteUrl by storing it in form separately via a custom callback.
  // Since the existing ImageUpload only calls onChange(url), we wrap it.
  const ImageUploadWrapper = ({ value, onChange }) => (
    <ImageUpload
      value={value}
      onChange={(url) => {
        // When the user clears the image, clear deleteUrl too
        if (!url) {
          setForm((f) => ({ ...f, image: "", imageDeleteUrl: "" }));
        } else {
          onChange(url);
        }
      }}
      folder="works"
      placeholder="Click or drag to upload project image"
    />
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <HiOutlineCode className="w-6 h-6 text-cyan-400" /> Works / Projects
            </h1>
            <p className="text-slate-400 text-sm mt-1">{works.length} projects total</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20">
            <HiOutlinePlus className="w-4 h-4" /> Add Project
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            <HiOutlineCode className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No projects yet</p>
            <button onClick={openCreate} className="text-cyan-400 text-sm hover:underline mt-1 inline-block">Add your first project →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {works.map((w) => (
              <div key={w._id}
                className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col transition-all
                  ${w.isActive ? "border-slate-800" : "border-slate-800 opacity-50"}`}>

                {/* preview image / icon */}
                <div className="relative h-28 flex items-center justify-center overflow-hidden"
                  style={{ background: w.image ? "#000" : (w.iconBg || "#0c1422") }}>
                  {w.image
                    ? <img src={w.image} alt={w.title} className="w-full h-full object-cover opacity-80" />
                    : <span style={{ fontSize: 40 }}>{w.icon || "📁"}</span>
                  }
                  {/* accent top strip */}
                  <div className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(90deg,transparent,${w.accentColor || "#00e5ff"},transparent)` }} />
                  {/* status badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium
                      ${w.isActive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-700/60 text-slate-500 border border-slate-600/30"}`}>
                      {w.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  {/* category */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-mono"
                      style={{ background: w.accentBg || "rgba(0,229,255,0.1)", color: w.accentColor || "#00e5ff", border: `1px solid ${w.accentBorder || "rgba(0,229,255,0.25)"}` }}>
                      {w.category}
                    </span>
                  </div>
                </div>

                {/* info */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">{w.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{w.subtitle}</p>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 flex-1">{w.shortDesc}</p>

                  {/* tags preview */}
                  <div className="flex flex-wrap gap-1">
                    {(w.tags || []).slice(0, 3).map((t) => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">{t}</span>
                    ))}
                    {(w.tags || []).length > 3 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">+{w.tags.length - 3}</span>
                    )}
                  </div>

                  {/* actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button onClick={() => handleToggle(w._id)}
                      className={`flex items-center gap-1 flex-1 justify-center text-xs py-1.5 rounded-lg font-medium transition-all
                        ${w.isActive
                          ? "bg-slate-800 text-slate-300 hover:bg-red-500/15 hover:text-red-400"
                          : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"}`}>
                      {w.isActive ? <><HiOutlineEyeOff className="w-3.5 h-3.5" /> Deactivate</> : <><HiOutlineEye className="w-3.5 h-3.5" /> Activate</>}
                    </button>
                    <button onClick={() => openEdit(w)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(w._id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ─────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 px-4 py-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl my-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="font-semibold text-white text-lg">{editingId ? "Edit Project" : "Add Project"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Row 1: Title + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Shop Management System"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Subtitle + Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Subtitle</label>
                  <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="Based on Networking & CCTV"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Order</label>
                  <input name="order" type="number" value={form.order} onChange={handleChange} min={0}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all" />
                </div>
              </div>

              {/* Short Desc */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Short Description</label>
                <textarea name="shortDesc" value={form.shortDesc} onChange={handleChange} rows={2}
                  placeholder="One-liner summary of the project..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all resize-none" />
              </div>

              {/* Long Desc */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Long Description</label>
                <textarea name="longDesc" value={form.longDesc} onChange={handleChange} rows={4}
                  placeholder="Detailed description of the project..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all resize-none" />
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Key Features</label>
                <FeaturesInput value={form.features} onChange={(v) => setForm((f) => ({ ...f, features: v }))} />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Tech Stack / Tags</label>
                <TagInput value={form.tags} onChange={(v) => setForm((f) => ({ ...f, tags: v }))} />
              </div>

              {/* Icon row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Icon (emoji)</label>
                  <input name="icon" value={form.icon} onChange={handleChange} placeholder="🏪"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Icon BG (CSS gradient, optional)</label>
                  <input name="iconBg" value={form.iconBg} onChange={handleChange} placeholder="linear-gradient(135deg,#facc1520,#fbbf2420)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all" />
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Project Image (imgBB) — replaces icon area if set</label>
                <ImageUploadWrapper value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
                {form.image && (
                  <p className="text-xs text-slate-500 mt-1 font-mono truncate">URL: {form.image}</p>
                )}
              </div>

              {/* Accent colours */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Accent Colours — <span className="text-slate-600">leave blank to auto-set from category</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input name="accentColor" value={form.accentColor} onChange={handleChange} placeholder="#facc15"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-mono" />
                    <p className="text-[10px] text-slate-600 mt-1">accentColor</p>
                  </div>
                  <div>
                    <input name="accentBg" value={form.accentBg} onChange={handleChange} placeholder="rgba(250,204,21,0.08)"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-mono" />
                    <p className="text-[10px] text-slate-600 mt-1">accentBg</p>
                  </div>
                  <div>
                    <input name="accentBorder" value={form.accentBorder} onChange={handleChange} placeholder="rgba(250,204,21,0.25)"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-mono" />
                    <p className="text-[10px] text-slate-600 mt-1">accentBorder</p>
                  </div>
                </div>
                <AccentPreview color={form.accentColor} bg={form.accentBg} border={form.accentBorder} />
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Live URL</label>
                  <input name="url" value={form.url} onChange={handleChange} placeholder="https://..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">GitHub URL</label>
                  <input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-800 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm text-white font-medium transition-all disabled:opacity-60">
                  <HiOutlineSave className="w-4 h-4" />
                  {saving ? "Saving..." : (editingId ? "Update Project" : "Create Project")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ───────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-1">Delete Project?</h3>
            <p className="text-slate-400 text-sm mb-6">
              This will permanently delete the project and remove its image from imgBB.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm text-white font-medium transition-all disabled:opacity-60">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default WorksAdmin;
