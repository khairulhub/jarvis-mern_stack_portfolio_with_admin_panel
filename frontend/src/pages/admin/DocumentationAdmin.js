import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { getAllDocs, createDoc, updateDoc, deleteDoc } from "../../utils/api";
import toast from "react-hot-toast";
import {
  HiOutlineDocumentText, HiOutlinePlus, HiOutlinePencil,
  HiOutlineTrash, HiOutlineX, HiOutlineChevronDown, HiOutlineChevronUp,
  HiOutlineSave, HiOutlineEye,
} from "react-icons/hi";

// ── Category colors ────────────────────────────────────────────
const CATEGORY_COLORS = {
  "Getting Started": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Backend":         "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Frontend":        "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Deployment":      "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Troubleshooting": "bg-red-500/10 text-red-400 border-red-500/20",
  "General":         "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);

// ── Empty page template ────────────────────────────────────────
const emptyPage = () => ({
  title: "",
  slug: "",
  icon: "ti-file",
  category: "General",
  order: 0,
  sections: [{ heading: "", body: "", order: 1 }],
});

// ── Section editor row ─────────────────────────────────────────
const SectionRow = ({ section, index, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-slate-500 font-mono">Section {index + 1}</span>
      <div className="flex items-center gap-1">
        <button onClick={onMoveUp}  disabled={isFirst}  className="p-1 text-slate-500 hover:text-white disabled:opacity-30"><HiOutlineChevronUp className="w-4 h-4" /></button>
        <button onClick={onMoveDown} disabled={isLast}  className="p-1 text-slate-500 hover:text-white disabled:opacity-30"><HiOutlineChevronDown className="w-4 h-4" /></button>
        <button onClick={onRemove} className="p-1 text-red-500 hover:text-red-400"><HiOutlineX className="w-4 h-4" /></button>
      </div>
    </div>
    <input
      type="text"
      placeholder="Section heading"
      value={section.heading}
      onChange={(e) => onChange({ ...section, heading: e.target.value })}
      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
    />
    <textarea
      placeholder="Section body (plain text or code)"
      value={section.body}
      onChange={(e) => onChange({ ...section, body: e.target.value })}
      rows={5}
      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono resize-y"
    />
  </div>
);

// ── Page form modal ─────────────────────────────────────────────
const PageModal = ({ page, onSave, onClose, saving }) => {
  const [form, setForm] = useState(page);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const autoSlug = (title) =>
    title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleTitleChange = (val) => {
    setForm((f) => ({ ...f, title: val, slug: autoSlug(val) }));
  };

  const addSection = () =>
    setForm((f) => ({
      ...f,
      sections: [...f.sections, { heading: "", body: "", order: f.sections.length + 1 }],
    }));

  const updateSection = (i, updated) =>
    setForm((f) => {
      const sections = [...f.sections];
      sections[i] = updated;
      return { ...f, sections };
    });

  const removeSection = (i) =>
    setForm((f) => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }));

  const moveSection = (i, dir) =>
    setForm((f) => {
      const sections = [...f.sections];
      const j = i + dir;
      if (j < 0 || j >= sections.length) return f;
      [sections[i], sections[j]] = [sections[j], sections[i]];
      return { ...f, sections };
    });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-white font-semibold text-lg">
            {page._id ? "Edit Page" : "New Doc Page"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Title + Slug */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Title *</label>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Getting Started"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Slug *</label>
              <input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="getting-started"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category + Icon + Order */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Icon (Tabler class)</label>
              <input
                value={form.icon}
                onChange={(e) => set("icon", e.target.value)}
                placeholder="ti-file"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400">Sections</label>
              <button
                onClick={addSection}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <HiOutlinePlus className="w-3 h-3" /> Add Section
              </button>
            </div>
            <div className="space-y-3">
              {form.sections.map((sec, i) => (
                <SectionRow
                  key={i}
                  section={sec}
                  index={i}
                  onChange={(updated) => updateSection(i, updated)}
                  onRemove={() => removeSection(i)}
                  onMoveUp={() => moveSection(i, -1)}
                  onMoveDown={() => moveSection(i, 1)}
                  isFirst={i === 0}
                  isLast={i === form.sections.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.title || !form.slug}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <HiOutlineSave className="w-4 h-4" />
            {saving ? "Saving…" : "Save Page"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Doc viewer panel ────────────────────────────────────────────
const DocViewer = ({ doc, onClose, onEdit }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 overflow-y-auto">
    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl my-8">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <i className={`${doc.icon} text-blue-400 text-xl`} />
          <div>
            <h3 className="text-white font-semibold">{doc.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[doc.category] || CATEGORY_COLORS["General"]}`}>
              {doc.category}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1">
            <HiOutlinePencil className="w-3 h-3" /> Edit
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {doc.sections
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((sec, i) => (
            <div key={i}>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-mono">{i + 1}</span>
                {sec.heading}
              </h4>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {sec.body}
              </pre>
            </div>
          ))}
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// Main Admin Docs Page
// ══════════════════════════════════════════════════════════════
export default function DocumentationAdmin() {
  const [docs,    setDocs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);   // null | "create" | "edit"
  const [viewing, setViewing] = useState(null);   // doc to preview
  const [editing, setEditing] = useState(null);   // doc being edited
  const [saving,  setSaving]  = useState(false);
  const [search,  setSearch]  = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const fetchDocs = async () => {
    try {
      const res = await getAllDocs();
      setDocs(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load docs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editing?._id) {
        await updateDoc(editing._id, form);
        toast.success("Page updated!");
      } else {
        await createDoc(form);
        toast.success("Page created!");
      }
      setModal(null);
      setEditing(null);
      fetchDocs();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doc page?")) return;
    try {
      await deleteDoc(id);
      toast.success("Deleted");
      setDocs((d) => d.filter((p) => p._id !== id));
      if (viewing?._id === id) setViewing(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  // Group docs by category
  const filtered = docs.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === "All" || d.category === filterCat;
    return matchSearch && matchCat;
  });

  const grouped = filtered.reduce((acc, doc) => {
    const cat = doc.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  const allCategories = ["All", ...CATEGORIES.filter((c) => docs.some((d) => d.category === c))];

  return (
    <AdminLayout>
      {/* Modal */}
      {modal && (
        <PageModal
          page={editing || emptyPage()}
          onSave={handleSave}
          onClose={() => { setModal(null); setEditing(null); }}
          saving={saving}
        />
      )}

      {/* Viewer */}
      {viewing && !modal && (
        <DocViewer
          doc={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setModal("edit"); setViewing(null); }}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HiOutlineDocumentText className="w-6 h-6 text-blue-400" />
            Documentation
          </h1>
          <p className="text-slate-400 text-sm mt-1">{docs.length} pages — full site reference</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModal("create"); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all"
        >
          <HiOutlinePlus className="w-4 h-4" />
          New Page
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search pages…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-64"
        />
        <div className="flex gap-2 flex-wrap">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filterCat === cat
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">Loading…</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-500 gap-3">
          <HiOutlineDocumentText className="w-10 h-10" />
          <p>No pages found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped)
            .sort(([a], [b]) => CATEGORIES.indexOf(a) - CATEGORIES.indexOf(b))
            .map(([category, pages]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${CATEGORY_COLORS[category] || CATEGORY_COLORS["General"]}`}>
                    {category}
                  </span>
                  <span className="text-slate-600 text-xs">{pages.length} pages</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {pages
                    .sort((a, b) => a.order - b.order)
                    .map((doc) => (
                      <div
                        key={doc._id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                              <i className={`${doc.icon} text-blue-400 text-base`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">{doc.title}</p>
                              <p className="text-xs text-slate-500 font-mono truncate">/{doc.slug}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 mb-4">
                          {doc.sections.length} section{doc.sections.length !== 1 ? "s" : ""}
                          {doc.sections[0]?.heading ? ` · ${doc.sections[0].heading}` : ""}
                        </p>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewing(doc)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
                          >
                            <HiOutlineEye className="w-3 h-3" /> View
                          </button>
                          <button
                            onClick={() => { setEditing(doc); setModal("edit"); }}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-all"
                          >
                            <HiOutlinePencil className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(doc._id)}
                            className="p-1.5 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                          >
                            <HiOutlineTrash className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </AdminLayout>
  );
}
