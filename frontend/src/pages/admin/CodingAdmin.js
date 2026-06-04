import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import axios from "axios";
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
  HiOutlineX, HiOutlineSave, HiOutlineEye, HiOutlineEyeOff,
  HiOutlineCode, HiOutlineChevronDown, HiOutlineChevronUp,
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

/* ─── empty form state ────────────────────────────────── */
const emptyCode = { tag: "", label: "", lang: "js", snippet: "" };

const emptyCoding = {
  icon:        "ti-code",
  title:       "",
  color:       "#00e5ff",
  colorBg:     "rgba(0,229,255,0.08)",
  colorBorder: "rgba(0,229,255,0.25)",
  shortDesc:   "",
  tags:        [],
  codes:       [],
  order:       0,
};

const LANG_OPTIONS = ["js", "ts", "bash", "php", "html", "css", "cpp", "yaml", "json", "py"];

/* ─── Tag input (chip style) ─────────────────────────── */
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

/* ─── Code snippets editor ───────────────────────────── */
function CodesEditor({ tags, codes, onChange }) {
  const [expanded, setExpanded] = useState(null);

  // Sync codes array when tags change:
  // - Add entry for new tags, remove orphaned entries
  const syncWithTags = (newTags, currentCodes) => {
    const synced = newTags.map((tag) => {
      const existing = currentCodes.find((c) => c.tag === tag);
      return existing || { tag, label: tag, lang: "js", snippet: "" };
    });
    return synced;
  };

  useEffect(() => {
    const synced = syncWithTags(tags, codes);
    // Only update if there's a real change
    if (JSON.stringify(synced) !== JSON.stringify(codes)) {
      onChange(synced);
    }
    // eslint-disable-next-line
  }, [tags]);

  const update = (tag, field, value) => {
    const updated = codes.map((c) => c.tag === tag ? { ...c, [field]: value } : c);
    onChange(updated);
  };

  if (tags.length === 0) {
    return (
      <p className="text-slate-500 text-sm italic">Add tags first, then code snippets will appear here.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {codes.map((c) => (
        <div key={c.tag} className="border border-slate-700 rounded-xl overflow-hidden">
          {/* accordion header */}
          <button
            type="button"
            onClick={() => setExpanded(expanded === c.tag ? null : c.tag)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-750 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">{c.tag}</span>
              <span className="text-xs text-slate-400">{c.lang?.toUpperCase()}</span>
              {c.snippet && <span className="text-xs text-green-400">✓ snippet added</span>}
            </div>
            {expanded === c.tag
              ? <HiOutlineChevronUp className="w-4 h-4 text-slate-400" />
              : <HiOutlineChevronDown className="w-4 h-4 text-slate-400" />
            }
          </button>

          {/* accordion body */}
          {expanded === c.tag && (
            <div className="p-4 bg-slate-900 flex flex-col gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Label / Heading</label>
                <input
                  value={c.label}
                  onChange={(e) => update(c.tag, "label", e.target.value)}
                  placeholder={`e.g. ${c.tag} — Setup & Usage`}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Language</label>
                <select
                  value={c.lang}
                  onChange={(e) => update(c.tag, "lang", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {LANG_OPTIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Code Snippet</label>
                <textarea
                  value={c.snippet}
                  onChange={(e) => update(c.tag, "snippet", e.target.value)}
                  placeholder="Paste your code here..."
                  rows={10}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-green-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono resize-y"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── CODING ADMIN PAGE ──────────────────────────────── */
const CodingAdmin = () => {
  const [codings,   setCodings]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form,      setForm]      = useState(emptyCoding);
  const [saving,    setSaving]    = useState(false);
  const [deleteId,  setDeleteId]  = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  /* ── Fetch ──────────────────────────────────────────── */
  const fetchCodings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/codings/admin/all");
      setCodings(data.data || []);
    } catch {
      toast.error("Failed to load codings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCodings(); }, [fetchCodings]);

  /* ── Helpers ────────────────────────────────────────── */
  const openCreate = () => {
    setForm(emptyCoding);
    setEditingId(null);
    setModalOpen(true);
  };
  const openEdit = (c) => {
    setForm({
      icon:        c.icon        || "ti-code",
      title:       c.title       || "",
      color:       c.color       || "#00e5ff",
      colorBg:     c.colorBg     || "rgba(0,229,255,0.08)",
      colorBorder: c.colorBorder || "rgba(0,229,255,0.25)",
      shortDesc:   c.shortDesc   || "",
      tags:        c.tags        || [],
      codes:       c.codes       || [],
      order:       c.order       ?? 0,
    });
    setEditingId(c._id);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  /* ── Save ───────────────────────────────────────────── */
  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);
    try {
      if (editingId) {
        await API.put(`/codings/${editingId}`, form);
        toast.success("Coding updated!");
      } else {
        await API.post("/codings", form);
        toast.success("Coding created!");
      }
      closeModal();
      fetchCodings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ─────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await API.delete(`/codings/${deleteId}`);
      toast.success("Coding deleted");
      setDeleteId(null);
      fetchCodings();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  /* ── Toggle ─────────────────────────────────────────── */
  const handleToggle = async (id) => {
    try {
      await API.patch(`/codings/${id}/toggle`);
      fetchCodings();
    } catch {
      toast.error("Toggle failed");
    }
  };

  /* ── Render ─────────────────────────────────────────── */
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <HiOutlineCode className="w-7 h-7 text-blue-400" />
              Coding Reference
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage coding cards shown on the public Coding page (latest 6 active shown).
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all"
          >
            <HiOutlinePlus className="w-5 h-5" />
            New Card
          </button>
        </div>

        {/* list */}
        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading...</div>
        ) : codings.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            No coding cards yet. Create one!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {codings.map((c) => (
              <div
                key={c._id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  c.isActive
                    ? "bg-slate-800/60 border-slate-700"
                    : "bg-slate-900/60 border-slate-800 opacity-60"
                }`}
              >
                {/* left — icon + info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg border"
                    style={{ background: c.colorBg, borderColor: c.colorBorder, color: c.color }}
                  >
                    <i className={`ti ${c.icon}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium text-sm">{c.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.isActive ? "bg-green-900/40 text-green-400" : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-slate-500">order: {c.order}</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5 truncate max-w-md">{c.shortDesc}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {c.tags?.slice(0, 6).map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded text-xs font-mono"
                          style={{ background: c.colorBg, color: c.color }}
                        >
                          {t}
                        </span>
                      ))}
                      {c.tags?.length > 6 && (
                        <span className="text-xs text-slate-500">+{c.tags.length - 6} more</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* right — actions */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => handleToggle(c._id)}
                    title={c.isActive ? "Deactivate" : "Activate"}
                    className="p-2 rounded-xl transition-all hover:bg-slate-700"
                  >
                    {c.isActive
                      ? <HiOutlineEye className="w-4 h-4 text-green-400" />
                      : <HiOutlineEyeOff className="w-4 h-4 text-slate-500" />
                    }
                  </button>
                  <button
                    onClick={() => openEdit(c)}
                    className="p-2 rounded-xl hover:bg-slate-700 transition-all"
                  >
                    <HiOutlinePencil className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => setDeleteId(c._id)}
                    className="p-2 rounded-xl hover:bg-slate-700 transition-all"
                  >
                    <HiOutlineTrash className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ──────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl my-8">
            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? "Edit Coding Card" : "New Coding Card"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* modal body */}
            <div className="p-6 flex flex-col gap-5">

              {/* row: icon + title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Tabler Icon Class</label>
                  <input
                    value={form.icon}
                    onChange={(e) => setField("icon", e.target.value)}
                    placeholder="e.g. ti-brand-react"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-600 mt-1">Find icons at tabler.io/icons</p>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="e.g. MERN Stack Setup"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* short desc */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Short Description</label>
                <textarea
                  value={form.shortDesc}
                  onChange={(e) => setField("shortDesc", e.target.value)}
                  placeholder="Brief description shown on the card..."
                  rows={2}
                  maxLength={300}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* row: colors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Accent Color (hex)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) => setField("color", e.target.value)}
                      className="w-10 h-9 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer"
                    />
                    <input
                      value={form.color}
                      onChange={(e) => setField("color", e.target.value)}
                      placeholder="#00e5ff"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Color BG (rgba)</label>
                  <input
                    value={form.colorBg}
                    onChange={(e) => setField("colorBg", e.target.value)}
                    placeholder="rgba(0,229,255,0.08)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Color Border (rgba)</label>
                  <input
                    value={form.colorBorder}
                    onChange={(e) => setField("colorBorder", e.target.value)}
                    placeholder="rgba(0,229,255,0.25)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              {/* color preview */}
              {form.color && (
                <div
                  className="flex items-center gap-2 p-2.5 rounded-lg border text-xs font-mono"
                  style={{ background: form.colorBg, borderColor: form.colorBorder, color: form.color }}
                >
                  ● Accent preview — {form.color}
                </div>
              )}

              {/* order */}
              <div className="w-32">
                <label className="block text-xs text-slate-400 mb-1.5">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setField("order", Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* tags */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Tags (topics)</label>
                <TagInput
                  value={form.tags}
                  onChange={(tags) => setField("tags", tags)}
                />
              </div>

              {/* code snippets */}
              <div>
                <label className="block text-xs text-slate-400 mb-2">
                  Code Snippets — one per tag
                  <span className="text-slate-600 ml-2">(click a tag row to expand)</span>
                </label>
                <CodesEditor
                  tags={form.tags}
                  codes={form.codes}
                  onChange={(codes) => setField("codes", codes)}
                />
              </div>
            </div>

            {/* modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all"
              >
                <HiOutlineSave className="w-4 h-4" />
                {saving ? "Saving…" : editingId ? "Update Card" : "Create Card"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Coding Card?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm rounded-xl transition-all"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CodingAdmin;
