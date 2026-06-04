import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
  HiOutlineX, HiOutlineSave, HiOutlineEye, HiOutlineEyeOff,
  HiOutlineChevronDown, HiOutlineChevronUp,
} from "react-icons/hi";
import {
  getAdminNetworks, createNetwork, updateNetwork,
  deleteNetwork, toggleNetwork,
} from "../../utils/api";

/* ─── EMPTY FORM STATE ───────────────────────────────────────── */
const emptyTopic = {
  order: 0,
  icon: "ti-router",
  emoji: "🔀",
  accentColor: "#00e5ff",
  accentBg: "rgba(0,229,255,0.08)",
  accentBorder: "rgba(0,229,255,0.25)",
  category: "CISCO",
  title: "",
  subtitle: "",
  shortDesc: "",
  diagram: "",
  steps: [{ title: "", desc: "", code: "" }],
  isActive: true,
};

const CATEGORIES = ["CISCO", "L2/L3", "SECURITY", "MIKROTIK", "JUNIPER", "FIBER", "OTHER"];

/* ─── STEP EDITOR ────────────────────────────────────────────── */
function StepEditor({ steps, onChange }) {
  const add = () => onChange([...steps, { title: "", desc: "", code: "" }]);
  const remove = (i) => onChange(steps.filter((_, idx) => idx !== i));
  const update = (i, field, val) => {
    const arr = [...steps];
    arr[i] = { ...arr[i], [field]: val };
    onChange(arr);
  };
  const [expanded, setExpanded] = useState(new Set([0]));
  const toggle = (i) => {
    const s = new Set(expanded);
    s.has(i) ? s.delete(i) : s.add(i);
    setExpanded(s);
  };

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="border border-slate-700 rounded-xl overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 bg-slate-800 cursor-pointer"
            onClick={() => toggle(i)}
          >
            <span className="text-sm text-slate-200 font-medium">
              Step {i + 1}: {step.title || "(untitled)"}
            </span>
            <div className="flex items-center gap-2">
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); remove(i); }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <HiOutlineTrash size={15} />
                </button>
              )}
              {expanded.has(i) ? <HiOutlineChevronUp size={15} className="text-slate-400" /> : <HiOutlineChevronDown size={15} className="text-slate-400" />}
            </div>
          </div>

          {expanded.has(i) && (
            <div className="p-4 bg-slate-900 space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Step Title</label>
                <input
                  value={step.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                  placeholder="e.g. 1. Basic Setup"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  value={step.desc}
                  onChange={(e) => update(i, "desc", e.target.value)}
                  placeholder="Brief description of this step..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-y"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Code / Commands</label>
                <textarea
                  value={step.code}
                  onChange={(e) => update(i, "code", e.target.value)}
                  placeholder="Paste CLI commands or code here..."
                  rows={8}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-green-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-y font-mono"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <HiOutlinePlus size={16} /> Add Step
      </button>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function NetworkAdmin() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);   // null = create
  const [form, setForm] = useState(emptyTopic);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ─── Load ──────────────────────────────────────────────────── */
  const load = async () => {
    try {
      const res = await getAdminNetworks();
      setTopics(res.data || []);
    } catch { toast.error("Failed to load network topics"); }
    finally  { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  /* ─── Open form ─────────────────────────────────────────────── */
  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyTopic, steps: [{ title: "", desc: "", code: "" }] });
    setShowForm(true);
  };
  const openEdit = (topic) => {
    setEditing(topic._id);
    setForm({
      order:        topic.order        ?? 0,
      icon:         topic.icon         ?? "ti-router",
      emoji:        topic.emoji        ?? "🔀",
      accentColor:  topic.accentColor  ?? "#00e5ff",
      accentBg:     topic.accentBg     ?? "rgba(0,229,255,0.08)",
      accentBorder: topic.accentBorder ?? "rgba(0,229,255,0.25)",
      category:     topic.category     ?? "CISCO",
      title:        topic.title        ?? "",
      subtitle:     topic.subtitle     ?? "",
      shortDesc:    topic.shortDesc    ?? "",
      diagram:      topic.diagram      ?? "",
      steps:        topic.steps?.length ? topic.steps : [{ title: "", desc: "", code: "" }],
      isActive:     topic.isActive     ?? true,
    });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  /* ─── Field change ──────────────────────────────────────────── */
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  /* ─── Save ──────────────────────────────────────────────────── */
  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateNetwork(editing, form);
        toast.success("Network topic updated!");
      } else {
        await createNetwork(form);
        toast.success("Network topic created!");
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  /* ─── Toggle active ─────────────────────────────────────────── */
  const handleToggle = async (id) => {
    try {
      await toggleNetwork(id);
      setTopics((t) => t.map((x) => x._id === id ? { ...x, isActive: !x.isActive } : x));
      toast.success("Status updated!");
    } catch { toast.error("Toggle failed"); }
  };

  /* ─── Delete ────────────────────────────────────────────────── */
  const handleDelete = async (id) => {
    try {
      await deleteNetwork(id);
      setTopics((t) => t.filter((x) => x._id !== id));
      toast.success("Deleted!");
    } catch { toast.error("Delete failed"); }
    setDeleteId(null);
  };

  /* ─── Render ────────────────────────────────────────────────── */
  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Network Topics</h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage Cisco / MikroTik / Security networking config topics
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <HiOutlinePlus size={18} /> Add Topic
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-slate-400 text-sm py-10 text-center">Loading...</div>
        ) : topics.length === 0 ? (
          <div className="text-slate-400 text-sm py-10 text-center">No topics yet. Click "Add Topic" to create one.</div>
        ) : (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Topic</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Steps</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {topics.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-400">{t.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}` }}
                        >
                          {t.emoji}
                        </div>
                        <div>
                          <p className="font-medium text-white" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, letterSpacing: 1 }}>
                            {t.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{t.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{t.steps?.length || 0} steps</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(t._id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          t.isActive
                            ? "bg-green-900/40 text-green-400 border border-green-800/50 hover:bg-green-900/60"
                            : "bg-slate-700 text-slate-400 border border-slate-600 hover:bg-slate-600"
                        }`}
                      >
                        {t.isActive ? <HiOutlineEye size={13} /> : <HiOutlineEyeOff size={13} />}
                        {t.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(t)}
                          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-all"
                          title="Edit"
                        >
                          <HiOutlinePencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(t._id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all"
                          title="Delete"
                        >
                          <HiOutlineTrash size={16} />
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

      {/* ─── Create / Edit Modal ───────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl relative">

            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">
                {editing ? "Edit Network Topic" : "Add Network Topic"}
              </h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-white transition-colors">
                <HiOutlineX size={20} />
              </button>
            </div>

            {/* form */}
            <div className="p-6 space-y-5">

              {/* row 1: order + category + isActive */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => set("order", parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Status</label>
                  <button
                    type="button"
                    onClick={() => set("isActive", !form.isActive)}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                      form.isActive
                        ? "bg-green-900/30 text-green-400 border-green-700"
                        : "bg-slate-700 text-slate-400 border-slate-600"
                    }`}
                  >
                    {form.isActive ? <><HiOutlineEye size={15} /> Active</> : <><HiOutlineEyeOff size={15} /> Inactive</>}
                  </button>
                </div>
              </div>

              {/* row 2: emoji + icon */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Emoji</label>
                  <input
                    value={form.emoji}
                    onChange={(e) => set("emoji", e.target.value)}
                    placeholder="🔀"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Icon class (Tabler)</label>
                  <input
                    value={form.icon}
                    onChange={(e) => set("icon", e.target.value)}
                    placeholder="ti-router"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* row 3: accent colors */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Accent Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.accentColor}
                      onChange={(e) => set("accentColor", e.target.value)}
                      className="w-10 h-9 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer p-0.5"
                    />
                    <input value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Accent Bg (rgba)</label>
                  <input value={form.accentBg} onChange={(e) => set("accentBg", e.target.value)}
                    placeholder="rgba(0,229,255,0.08)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Accent Border (rgba)</label>
                  <input value={form.accentBorder} onChange={(e) => set("accentBorder", e.target.value)}
                    placeholder="rgba(0,229,255,0.25)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Title <span className="text-red-400">*</span></label>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="ROUTER CONFIG"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 uppercase"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Subtitle</label>
                <input
                  value={form.subtitle}
                  onChange={(e) => set("subtitle", e.target.value)}
                  placeholder="Basic to Advanced — VLAN, OSPF, Traffic Control"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Short desc */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Short Description</label>
                <textarea
                  value={form.shortDesc}
                  onChange={(e) => set("shortDesc", e.target.value)}
                  placeholder="Brief description shown on the card..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* ASCII Diagram */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">ASCII Diagram (optional)</label>
                <textarea
                  value={form.diagram}
                  onChange={(e) => set("diagram", e.target.value)}
                  placeholder={"┌────────────┐\n│  TOPOLOGY  │\n└────────────┘"}
                  rows={7}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-green-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-y font-mono"
                />
              </div>

              {/* Steps */}
              <div>
                <label className="block text-xs text-slate-400 mb-2">Configuration Steps</label>
                <StepEditor steps={form.steps} onChange={(v) => set("steps", v)} />
              </div>

            </div>

            {/* footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700">
              <button onClick={closeForm} className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all"
              >
                <HiOutlineSave size={16} />
                {saving ? "Saving..." : (editing ? "Update" : "Create")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm Modal ──────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineTrash size={24} className="text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Delete Topic?</h3>
            <p className="text-sm text-slate-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
