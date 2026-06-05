import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import ImageUpload from "../../components/common/ImageUpload";
import toast from "react-hot-toast";
import axios from "axios";
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
  HiOutlineX, HiOutlineSave, HiOutlineEye, HiOutlineEyeOff,
  HiOutlinePhotograph,
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

// ── Icon picker options ─────────────────────────────────────────
const EMOJI_OPTIONS = [
  { emoji: "🌐", label: "Network"     },
  { emoji: "💻", label: "Laptop"      },
  { emoji: "📷", label: "Camera"      },
  { emoji: "🏆", label: "Trophy"      },
  { emoji: "⚡", label: "Lightning"   },
  { emoji: "🔒", label: "Lock"        },
  { emoji: "🎓", label: "Graduate"    },
  { emoji: "🏠", label: "House"       },
  { emoji: "🖥️", label: "Desktop"    },
  { emoji: "📡", label: "Satellite"   },
  { emoji: "🔧", label: "Wrench"      },
  { emoji: "🛡️", label: "Shield"     },
  { emoji: "📊", label: "Chart"       },
  { emoji: "🚀", label: "Rocket"      },
  { emoji: "🔬", label: "Microscope"  },
  { emoji: "📱", label: "Phone"       },
  { emoji: "☁️", label: "Cloud"       },
  { emoji: "🔗", label: "Chain"       },
  { emoji: "🖨️", label: "Printer"    },
  { emoji: "📦", label: "Package"     },
  { emoji: "🗄️", label: "Server"     },
  { emoji: "🔑", label: "Key"         },
  { emoji: "📝", label: "Notes"       },
  { emoji: "🌍", label: "Globe"       },
];

const emptyPhoto = {
  title: "", subtitle: "", desc: "",
  tags: [],
  category: "",
  emoji: "📷",
  color: "#00e5ff",
  image: "", imageDeleteUrl: "",
  height: 180,
  order: 0,
};

/* ── Tag Input ────────────────────────────────────────────────── */
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
          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-xl transition-all">Add</button>
      </div>
    </div>
  );
}

/* ── Emoji Picker ─────────────────────────────────────────────── */
function EmojiPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 bg-slate-800 border border-slate-700 hover:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white transition-all"
      >
        <span style={{ fontSize: 22 }}>{value || "📷"}</span>
        <span className="text-slate-400 text-xs flex-1 text-left">
          {EMOJI_OPTIONS.find((e) => e.emoji === value)?.label || "Select icon"}
        </span>
        <span className="text-slate-500 text-xs">▾</span>
      </button>

      {/* Dropdown grid */}
      {open && (
        <div className="absolute z-50 top-full left-0 mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3">
          <div className="grid grid-cols-6 gap-1.5 max-h-52 overflow-y-auto">
            {EMOJI_OPTIONS.map(({ emoji, label }) => (
              <button
                key={emoji}
                type="button"
                title={label}
                onClick={() => { onChange(emoji); setOpen(false); }}
                className={`flex items-center justify-center h-10 rounded-lg text-xl transition-all hover:bg-slate-700
                  ${value === emoji ? "bg-cyan-500/20 ring-1 ring-cyan-500" : "bg-slate-800"}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          {/* Custom emoji input */}
          <div className="mt-2 pt-2 border-t border-slate-800">
            <input
              placeholder="Or type any emoji..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              onChange={(e) => { if (e.target.value) onChange(e.target.value); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
const PhotoAdmin = () => {
  const [photos,     setPhotos]    = useState([]);
  const [categories, setCats]      = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [modalOpen,  setModalOpen] = useState(false);
  const [editingId,  setEditingId] = useState(null);
  const [form,       setForm]      = useState(emptyPhoto);
  const [saving,     setSaving]    = useState(false);
  const [deleteId,   setDeleteId]  = useState(null);
  const [deleting,   setDeleting]  = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        API.get("/photos/admin/all"),
        API.get("/photo-categories/admin/all"),
      ]);
      setPhotos(pRes.data.data || []);
      setCats(cRes.data.data || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => {
    setForm({ ...emptyPhoto, category: categories[0]?.name || "" });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      title: p.title || "", subtitle: p.subtitle || "", desc: p.desc || "",
      tags: p.tags || [],
      category: p.category || "",
      emoji: p.emoji || "📷",
      color: p.color || "#00e5ff",
      image: p.image || "", imageDeleteUrl: p.imageDeleteUrl || "",
      height: p.height || 180,
      order: p.order ?? 0,
    });
    setEditingId(p._id);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const catName = e.target.value;
    const cat = categories.find((c) => c.name === catName);
    setForm((f) => ({ ...f, category: catName, color: cat?.color || f.color }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error("Title is required");
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: Array.isArray(form.tags) ? form.tags : [],
        height: Number(form.height) || 180,
        order: Number(form.order) || 0,
      };
      if (editingId) {
        await API.put(`/photos/${editingId}`, payload);
        toast.success("Photo updated!");
      } else {
        await API.post("/photos", payload);
        toast.success("Photo created!");
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try { await API.patch(`/photos/${id}/toggle`); fetchAll(); }
    catch { toast.error("Toggle failed"); }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await API.delete(`/photos/${id}`);
      toast.success("Photo deleted");
      setDeleteId(null);
      fetchAll();
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  const catColor = (catName) => {
    const found = categories.find((c) => c.name === catName);
    return found?.color || "#00e5ff";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <HiOutlinePhotograph className="w-6 h-6 text-cyan-400" /> Photo Gallery
            </h1>
            <p className="text-slate-400 text-sm mt-1">{photos.length} photos total</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20">
            <HiOutlinePlus className="w-4 h-4" /> Add Photo
          </button>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            <HiOutlinePhotograph className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No photos yet</p>
            <button onClick={openCreate} className="text-cyan-400 text-sm hover:underline mt-1 inline-block">Add your first photo →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {photos.map((p) => {
              const pColor = p.color || catColor(p.category) || "#00e5ff";
              return (
                <div key={p._id}
                  className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col transition-all
                    ${p.isActive ? "border-slate-800" : "border-slate-800 opacity-50"}`}>

                  {/* preview */}
                  <div className="relative h-28 flex items-center justify-center overflow-hidden"
                    style={{ background: p.image ? "#000" : "#0c1422" }}>
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${pColor}12,transparent)` }} />
                    {p.image
                      ? <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-80" />
                      : <span style={{ fontSize: 40, position: "relative", zIndex: 1 }}>{p.emoji || "📷"}</span>
                    }
                    <div className="absolute top-0 left-0 right-0 h-0.5"
                      style={{ background: `linear-gradient(90deg,transparent,${pColor},transparent)` }} />
                    <div className="absolute top-2 right-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium
                        ${p.isActive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-700/60 text-slate-500 border border-slate-600/30"}`}>
                        {p.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-mono"
                        style={{ background: `${pColor}20`, color: pColor, border: `1px solid ${pColor}40` }}>
                        {p.category}
                      </span>
                    </div>
                  </div>

                  {/* info */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{p.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{p.subtitle}</p>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 flex-1">{p.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {(p.tags || []).slice(0, 3).map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">{t}</span>
                      ))}
                      {(p.tags || []).length > 3 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">+{p.tags.length - 3}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button onClick={() => handleToggle(p._id)}
                        className={`flex items-center gap-1 flex-1 justify-center text-xs py-1.5 rounded-lg font-medium transition-all
                          ${p.isActive
                            ? "bg-slate-800 text-slate-300 hover:bg-red-500/15 hover:text-red-400"
                            : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"}`}>
                        {p.isActive
                          ? <><HiOutlineEyeOff className="w-3.5 h-3.5" /> Deactivate</>
                          : <><HiOutlineEye className="w-3.5 h-3.5" /> Activate</>}
                      </button>
                      <button onClick={() => openEdit(p)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(p._id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ─────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 px-4 py-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl my-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h3 className="font-semibold text-white text-lg">
                  {editingId ? "✏️ Edit Photo" : "➕ Add New Photo"}
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  {editingId ? "Update photo details below" : "Fill in the details to add a new gallery photo"}
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">

              {/* ─ Row: Title + Category ─ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="Campus Network Design"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                  <select name="category" value={form.category} onChange={handleCategoryChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all">
                    <option value="">-- Select Category --</option>
                    {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* ─ Row: Subtitle + Order ─ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Subtitle</label>
                  <input name="subtitle" value={form.subtitle} onChange={handleChange}
                    placeholder="12-Floor University Topology"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Order</label>
                  <input name="order" type="number" value={form.order} onChange={handleChange} min={0}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all" />
                </div>
              </div>

              {/* ─ Description ─ */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                <textarea name="desc" value={form.desc} onChange={handleChange} rows={3}
                  placeholder="Short description of this photo..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all resize-none" />
              </div>

              {/* ─ Tags ─ */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Tags</label>
                <TagInput value={form.tags} onChange={(v) => setForm((f) => ({ ...f, tags: v }))} />
              </div>

              {/* ─ Icon Picker (full width) ─ */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Emoji Icon — <span className="text-slate-600">shown when no image is set</span>
                </label>
                <EmojiPicker value={form.emoji} onChange={(v) => setForm((f) => ({ ...f, emoji: v }))} />
              </div>

              {/* ─ Accent Color + Card Height (separate row, proper spacing) ─ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                      className="h-10 w-10 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer p-0.5 flex-shrink-0"
                      style={{ WebkitAppearance: "none" }}
                    />
                    <input
                      name="color" value={form.color} onChange={handleChange}
                      placeholder="#00e5ff"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                    />
                  </div>
                  {/* live preview swatch */}
                  <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
                    style={{ background: `${form.color}12`, borderColor: `${form.color}30`, color: form.color }}>
                    ● {form.color}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Card Height (px)</label>
                  <input
                    name="height" type="number" value={form.height}
                    onChange={handleChange} min={100} max={400}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
                  />
                  {/* height slider */}
                  <input
                    type="range" min={100} max={400} step={10}
                    value={form.height}
                    onChange={(e) => setForm((f) => ({ ...f, height: Number(e.target.value) }))}
                    className="w-full mt-2 accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 -mt-0.5">
                    <span>100px</span><span>250px</span><span>400px</span>
                  </div>
                </div>
              </div>

              {/* ─ Image upload ─ */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Photo Image (imgBB) — <span className="text-slate-600">replaces emoji icon when set</span>
                </label>
                <ImageUpload
                  value={form.image}
                  onChange={(url) => {
                    if (!url) {
                      setForm((f) => ({ ...f, image: "", imageDeleteUrl: "" }));
                    } else {
                      setForm((f) => ({ ...f, image: url }));
                    }
                  }}
                  folder="gallery"
                  placeholder="Click or drag to upload photo (via imgBB)"
                />
                {form.image && (
                  <p className="text-xs text-slate-500 mt-1.5 font-mono truncate bg-slate-800 px-3 py-1.5 rounded-lg">
                    {form.image}
                  </p>
                )}
              </div>

              {/* ─ Buttons ─ */}
              <div className="flex gap-3 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-800 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm text-white font-medium transition-all disabled:opacity-60">
                  <HiOutlineSave className="w-4 h-4" />
                  {saving ? "Saving..." : (editingId ? "Update Photo" : "Create Photo")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ─────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-1">Delete Photo?</h3>
            <p className="text-slate-400 text-sm mb-6">
              This will permanently delete the photo and remove its image from imgBB.
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

export default PhotoAdmin;
