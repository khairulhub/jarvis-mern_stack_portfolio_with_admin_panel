import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import { getAboutInfo, updateAboutInfo } from "../../utils/api";
import { getExperiences, getAdminClients } from "../../utils/api";

// Available Tabler icon options
const ICON_OPTIONS = [
  { value: "ti-user",           label: "User / Person" },
  { value: "ti-map-pin",        label: "Location / Pin" },
  { value: "ti-school",         label: "Education / School" },
  { value: "ti-device-laptop",  label: "Laptop / Status" },
  { value: "ti-mail",           label: "Email" },
  { value: "ti-phone",          label: "Phone" },
  { value: "ti-briefcase",      label: "Briefcase / Work" },
  { value: "ti-calendar",       label: "Calendar" },
  { value: "ti-star",           label: "Star" },
  { value: "ti-award",          label: "Award" },
  { value: "ti-certificate",    label: "Certificate" },
  { value: "ti-brand-github",   label: "GitHub" },
  { value: "ti-brand-linkedin", label: "LinkedIn" },
  { value: "ti-globe",          label: "Globe / Website" },
  { value: "ti-code",           label: "Code" },
  { value: "ti-heart",          label: "Heart" },
];

const emptyCard = () => ({ icon: "ti-user", label: "", value: "", order: 0 });

const AboutInfoAdmin = () => {
  const [form, setForm] = useState({
    paragraph1: "",
    paragraph2: "",
    paragraph3: "",
    infoCards:  [],
    stats:      [],
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [experiencesList, setExperiencesList] = useState([]);
  const [clientsList, setClientsList] = useState([]);

  // ── Load ────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAboutInfo();
        if (res.success && res.data) {
          const d = res.data;
          setForm({
            paragraph1: d.paragraph1 || "",
            paragraph2: d.paragraph2 || "",
            paragraph3: d.paragraph3 || "",
            infoCards:  Array.isArray(d.infoCards) ? d.infoCards : [],
            stats:      Array.isArray(d.stats) ? d.stats : [],
          });
        }
      } catch {
        toast.error("Failed to load About info");
      } finally {
        setLoading(false);
      }
    };
    load();
    // load experiences and clients for stat targeting
    const loadTargets = async () => {
      try {
        const er = await getExperiences();
        if (er.success && er.data) setExperiencesList(er.data);
      } catch {}
      try {
        const cr = await getAdminClients();
        if (cr.success && cr.data) setClientsList(cr.data);
      } catch {}
    };
    loadTargets();
  }, []);

  // ── Info card helpers ────────────────────────────────────────
  const handleCardChange = (index, field, value) => {
    setForm((prev) => {
      const cards = [...prev.infoCards];
      cards[index] = { ...cards[index], [field]: value };
      return { ...prev, infoCards: cards };
    });
  };
  const addCard = () => {
    setForm((prev) => ({
      ...prev,
      infoCards: [...prev.infoCards, { ...emptyCard(), order: prev.infoCards.length + 1 }],
    }));
  };
  const removeCard = (index) => {
    setForm((prev) => ({ ...prev, infoCards: prev.infoCards.filter((_, i) => i !== index) }));
  };

  // ── Stat card helpers ────────────────────────────────────────
  const handleStatChange = (index, field, value) => {
    setForm((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  };
  const addStat = () => {
    setForm((prev) => ({
      ...prev,
      stats: [...prev.stats, { num: "", label: "", clickable: false, clientStat: false, link: "", order: prev.stats.length + 1 }],
    }));
  };
  const removeStat = (index) => {
    setForm((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
  };

  // ── Save ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAboutInfo(form);
      toast.success("About section saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

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
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">About Section</h1>
          <p className="text-slate-400 text-sm mt-1">
            Paragraphs, info mini-cards, এবং stat cards এডিট করো। Changes MongoDB এ save হবে।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Paragraphs ── */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-white font-semibold">Bio Paragraphs</h2>
            <p className="text-xs text-slate-500">
              HTML tags ব্যবহার করা যাবে — যেমন{" "}
              <code className="text-cyan-400">&lt;strong style="color:#00e5ff"&gt;Full Stack Developer&lt;/strong&gt;</code>
            </p>
            {["paragraph1", "paragraph2", "paragraph3"].map((key, i) => (
              <div key={key}>
                <label className="block text-sm text-slate-400 mb-1.5">Paragraph {i + 1}</label>
                <textarea
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            ))}
          </div>

          {/* ── Info Mini-Cards ── */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">Info Mini-Cards</h2>
                <p className="text-xs text-slate-500 mt-0.5">Name, Location ইত্যাদি ছোট card গুলো।</p>
              </div>
              <button type="button" onClick={addCard}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-all flex items-center gap-1">
                + Add Card
              </button>
            </div>

            {form.infoCards.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">কোনো card নেই — Add Card বাটনে ক্লিক করো।</p>
            )}

            <div className="space-y-3">
              {form.infoCards.map((card, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Card #{i + 1}</span>
                    <button type="button" onClick={() => removeCard(i)}
                      className="text-red-400 hover:text-red-300 text-xs transition-colors">Remove</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Icon</label>
                      <select value={card.icon} onChange={(e) => handleCardChange(i, "icon", e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500">
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Order</label>
                      <input type="number" value={card.order}
                        onChange={(e) => handleCardChange(i, "order", Number(e.target.value))}
                        className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Label (e.g. "Name")</label>
                      <input type="text" value={card.label} placeholder="Name"
                        onChange={(e) => handleCardChange(i, "label", e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Value</label>
                      <input type="text" value={card.value} placeholder="Md Khairul Islam"
                        onChange={(e) => handleCardChange(i, "value", e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500" />
                    </div>
                  </div>
                  {/* Live preview */}
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg mt-1"
                    style={{ background: "#0c1422", border: "1px solid rgba(0,229,255,0.08)", width: "fit-content", minWidth: 180 }}>
                    <i className={`ti ${card.icon}`} style={{ fontSize: 14, color: "#00b8cc" }} />
                    <div>
                      <div style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "monospace", letterSpacing: 1 }}>
                        {(card.label || "LABEL").toUpperCase()}
                      </div>
                      <div style={{ fontSize: 11, color: "#c8e8f8" }}>{card.value || "Value"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">Stat Cards (Right Side)</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  "3+ YEARS EXP", "15+ CLIENTS" ইত্যাদি।
                  <br />
                  <span className="text-cyan-600">Clickable</span> = Experience modal।
                  <span className="text-orange-500 ml-2">Client Stat</span> = Client modal।
                  Link দিলে সেই URL এ নিয়ে যাবে।
                </p>
              </div>
              <button type="button" onClick={addStat}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-all flex items-center gap-1">
                + Add Stat
              </button>
            </div>

            {form.stats.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">কোনো stat নেই।</p>
            )}

            <div className="space-y-3">
              {form.stats.map((stat, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Stat #{i + 1}</span>
                    <button type="button" onClick={() => removeStat(i)}
                      className="text-red-400 hover:text-red-300 text-xs transition-colors">Remove</button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Number (e.g. "50+")</label>
                      <input type="text" value={stat.num} placeholder="50+"
                        onChange={(e) => handleStatChange(i, "num", e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Label (e.g. "PROJECTS")</label>
                      <input type="text" value={stat.label} placeholder="PROJECTS"
                        onChange={(e) => handleStatChange(i, "label", e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Order</label>
                      <input type="number" value={stat.order}
                        onChange={(e) => handleStatChange(i, "order", Number(e.target.value))}
                        className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      {/* Experience modal checkbox */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!stat.clickable}
                          onChange={(e) => {
                            handleStatChange(i, "clickable", e.target.checked);
                            if (e.target.checked) handleStatChange(i, "clientStat", false);
                          }}
                          className="w-4 h-4 accent-cyan-500" />
                        <span className="text-xs text-slate-300">Exp. modal</span>
                      </label>
                      {/* Client modal checkbox */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!stat.clientStat}
                          onChange={(e) => {
                            handleStatChange(i, "clientStat", e.target.checked);
                            if (e.target.checked) handleStatChange(i, "clickable", false);
                          }}
                          className="w-4 h-4 accent-orange-400" />
                        <span className="text-xs text-orange-300">Client modal</span>
                      </label>
                    </div>
                  </div>

                  {/* Link field */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Link (optional — click করলে এই URL এ যাবে)
                    </label>
                    <input type="text" value={stat.link || ""}
                      onChange={(e) => handleStatChange(i, "link", e.target.value)}
                      placeholder="https://github.com/Khairulhub"
                      className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500" />
                  </div>

                  {/* Target selector for modal */}
                  {(stat.clickable || stat.clientStat) && (
                    <div className="mt-3">
                      <label className="block text-xs text-slate-400 mb-1">Target {stat.clickable ? "Experience" : "Client"} (optional)</label>
                      {stat.clickable ? (
                        <select value={stat.targetId || ""} onChange={(e) => handleStatChange(i, "targetId", e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500">
                          <option value="">(open first experience)</option>
                          {experiencesList.map((ex) => (
                            <option key={ex._id} value={ex._id}>{ex.company} — {ex.designation}</option>
                          ))}
                        </select>
                      ) : (
                        <select value={stat.targetId || ""} onChange={(e) => handleStatChange(i, "targetId", e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500">
                          <option value="">(open client list)</option>
                          {clientsList.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {/* Type indicator */}
                  <div className="flex gap-2">
                    {stat.clickable && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                        → Opens Experience Modal
                      </span>
                    )}
                    {stat.clientStat && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
                        → Opens Client Modal
                      </span>
                    )}
                    {!stat.clickable && !stat.clientStat && stat.link && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 border border-slate-600 font-mono">
                        → Opens External Link
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Save ── */}
          <div className="flex justify-end pb-6">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AboutInfoAdmin;