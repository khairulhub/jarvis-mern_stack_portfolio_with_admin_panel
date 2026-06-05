import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import axios from "axios";
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
  HiOutlineX, HiOutlineSave, HiOutlineEye, HiOutlineEyeOff,
  HiOutlineTag,
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

const PRESET_COLORS = [
  "#facc15", "#38bdf8", "#f87171", "#00ff88", "#a855f7",
  "#00e5ff", "#ffa040", "#c084fc", "#fb923c", "#34d399",
];

const emptyForm = { name: "", slug: "", color: "#00e5ff", order: 0 };

/* ── Color Picker Row ─────────────────────────────────────────── */
function ColorRow({ value, onChange }) {
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {PRESET_COLORS.map((c) => (
          <button
            key={c} type="button"
            onClick={() => onChange(c)}
            style={{
              width: 24, height: 24, borderRadius: 6, background: c,
              border: value === c ? "2px solid #fff" : "2px solid transparent",
              cursor: "pointer", flexShrink: 0,
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text" value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#00e5ff"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <div style={{ width: 32, height: 32, borderRadius: 8, background: value, border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
const PhotoCategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [saving,     setSaving]     = useState(false);
  const [deleteId,   setDeleteId]   = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/photo-categories/admin/all");
      setCategories(data.data || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true); };
  const openEdit   = (c) => {
    setForm({ name: c.name || "", slug: c.slug || "", color: c.color || "#00e5ff", order: c.order ?? 0 });
    setEditingId(c._id);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      // Auto-generate slug when name changes (create mode only)
      if (name === "name" && !editingId) {
        next.slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      }
      return next;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error("Category name is required");
    setSaving(true);
    try {
      if (editingId) {
        await API.put(`/photo-categories/${editingId}`, form);
        toast.success("Category updated!");
      } else {
        await API.post("/photo-categories", form);
        toast.success("Category created!");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/photo-categories/${id}/toggle`);
      fetchCategories();
    } catch { toast.error("Toggle failed"); }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await API.delete(`/photo-categories/${id}`);
      toast.success("Category deleted");
      setDeleteId(null);
      fetchCategories();
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <HiOutlineTag className="w-6 h-6 text-cyan-400" /> Photo Categories
            </h1>
            <p className="text-slate-400 text-sm mt-1">{categories.length} categories total</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20">
            <HiOutlinePlus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            <HiOutlineTag className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No categories yet</p>
            <button onClick={openCreate} className="text-cyan-400 text-sm hover:underline mt-1 inline-block">Add your first category →</button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Color</th>
                  <th className="text-left p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left p-4 text-slate-400 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Slug</th>
                  <th className="text-left p-4 text-slate-400 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Order</th>
                  <th className="text-left p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {categories.map((cat) => (
                  <tr key={cat._id} className={`hover:bg-slate-800/40 transition-colors ${!cat.isActive ? "opacity-50" : ""}`}>
                    <td className="p-4">
                      <div style={{ width: 20, height: 20, borderRadius: 4, background: cat.color, border: "1px solid rgba(255,255,255,0.1)" }} />
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-white font-mono" style={{ color: cat.color }}>{cat.name}</span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-slate-500 font-mono text-xs">{cat.slug}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-slate-400">{cat.order}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                        ${cat.isActive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-700/60 text-slate-500 border border-slate-600/30"}`}>
                        {cat.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleToggle(cat._id)}
                          className={`p-1.5 rounded-lg transition-all
                            ${cat.isActive ? "text-slate-400 hover:text-red-400 hover:bg-red-500/10" : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"}`}>
                          {cat.isActive ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEdit(cat)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(cat._id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="font-semibold text-white text-lg">{editingId ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Category Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="NETWORK"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Slug (auto-generated)</label>
                <input name="slug" value={form.slug} onChange={handleChange} placeholder="network"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Accent Color</label>
                <ColorRow value={form.color} onChange={(c) => setForm((f) => ({ ...f, color: c }))} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Order</label>
                <input name="order" type="number" value={form.order} onChange={handleChange} min={0}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-800 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm text-white font-medium transition-all disabled:opacity-60">
                  <HiOutlineSave className="w-4 h-4" />
                  {saving ? "Saving..." : (editingId ? "Update" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-1">Delete Category?</h3>
            <p className="text-slate-400 text-sm mb-6">This will permanently delete the category. Photos using it won't be deleted.</p>
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

export default PhotoCategoryAdmin;
