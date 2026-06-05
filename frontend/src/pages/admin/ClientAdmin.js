import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import ImageUpload from "../../components/common/ImageUpload";
import {
  getAdminClients,
  createClient,
  updateClient,
  deleteClient,
  toggleClient,
} from "../../utils/api";

const COLOR_PRESETS = [
  { label: "Cyan", color: "#00e5ff", colorBg: "rgba(0,229,255,0.08)", colorBorder: "rgba(0,229,255,0.25)" },
  { label: "Yellow", color: "#facc15", colorBg: "rgba(250,204,21,0.08)", colorBorder: "rgba(250,204,21,0.25)" },
  { label: "Green", color: "#22c55e", colorBg: "rgba(34,197,94,0.08)", colorBorder: "rgba(34,197,94,0.25)" },
  { label: "Orange", color: "#f97316", colorBg: "rgba(249,115,22,0.08)", colorBorder: "rgba(249,115,22,0.25)" },
  { label: "Pink", color: "#ec4899", colorBg: "rgba(236,72,153,0.08)", colorBorder: "rgba(236,72,153,0.25)" },
  { label: "Purple", color: "#a855f7", colorBg: "rgba(168,85,247,0.08)", colorBorder: "rgba(168,85,247,0.25)" },
];

const ICON_OPTIONS = [
  "ti-building",
  "ti-code",
  "ti-device-laptop",
  "ti-server",
  "ti-home",
  "ti-users",
  "ti-briefcase",
  "ti-terminal-2",
  "ti-cloud",
  "ti-database",
  "ti-brand-whatsapp",
  "ti-brand-github",
];

const EMPTY_FORM = {
  name: "",
  location: "",
  details: "",
  logo: "",
  logoDeleteUrl: "",
  icon: "ti-building",
  color: "#00e5ff",
  colorBg: "rgba(0,229,255,0.08)",
  colorBorder: "rgba(0,229,255,0.25)",
  isActive: true,
  order: 0,
};

const ClientAdmin = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await getAdminClients();
      if (res.success) setClients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (client) => {
    setEditingId(client._id);
    setForm({
      name: client.name || "",
      location: client.location || "",
      details: client.details || "",
      logo: client.logo || "",
      logoDeleteUrl: client.logoDeleteUrl || "",
      icon: client.icon || "ti-building",
      color: client.color || "#00e5ff",
      colorBg: client.colorBg || "rgba(0,229,255,0.08)",
      colorBorder: client.colorBorder || "rgba(0,229,255,0.25)",
      isActive: client.isActive ?? true,
      order: client.order ?? 0,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const applyColorPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      color: preset.color,
      colorBg: preset.colorBg,
      colorBorder: preset.colorBorder,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Client name is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
      };

      if (editingId) {
        await updateClient(editingId, payload);
        toast.success("Client updated!");
      } else {
        await createClient(payload);
        toast.success("Client created!");
      }

      closeModal();
      loadClients();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleClient(id);
      toast.success("Client status updated");
      loadClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Toggle failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteClient(id);
      toast.success("Client deleted");
      setDeleteId(null);
      loadClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Clients</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage the client cards shown on the About section and the 15+ client modal.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-xl transition-all"
          >
            + Add Client
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-16 text-center text-slate-500">
            <p className="text-4xl mb-3">🏢</p>
            <p>No clients yet.</p>
            <button onClick={openCreate} className="mt-4 text-cyan-400 hover:underline text-sm">
              Add your first client →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {clients.map((client) => (
              <div
                key={client._id}
                className={`bg-slate-900 border rounded-2xl p-5 flex flex-col gap-4 ${client.isActive ? "border-slate-800" : "border-slate-800 opacity-60"}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: client.colorBg || "rgba(0,229,255,0.08)",
                      border: `1px solid ${client.colorBorder || "rgba(0,229,255,0.25)"}`,
                    }}
                  >
                    {client.logo ? (
                      <img src={client.logo} alt={client.name} className="w-full h-full object-cover" />
                    ) : (
                      <i className={`ti ${client.icon || "ti-building"}`} style={{ color: client.color || "#00e5ff", fontSize: 22 }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold text-sm truncate">{client.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        Order: {client.order ?? 0}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${client.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
                        {client.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {client.location && <p className="text-xs text-slate-400 mt-0.5">{client.location}</p>}
                    {client.details && <p className="text-xs text-slate-500 mt-2 line-clamp-3">{client.details}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleToggle(client._id)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all ${client.isActive ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"}`}
                  >
                    {client.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => openEdit(client)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(client._id)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-300 hover:text-red-400 hover:border-red-500 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h2 className="text-white font-semibold">{editingId ? "Edit Client" : "Add Client"}</h2>
                <p className="text-xs text-slate-500 mt-1">Keep the fields aligned with the public About modal.</p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-white text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Client Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Edge Tech BD"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Dhaka, Bangladesh"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Details</label>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Short project or client summary"
                  className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    min={0}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <input
                    id="client-is-active"
                    type="checkbox"
                    name="isActive"
                    checked={!!form.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  <label htmlFor="client-is-active" className="text-sm text-slate-300">
                    Active in public site
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Logo</label>
                <ImageUpload
                  value={form.logo}
                  onChange={(url) => setForm((prev) => ({ ...prev, logo: url }))}
                  folder="clients"
                  placeholder="Click or drag to upload client logo"
                />
                <p className="text-[11px] text-slate-500 mt-2">
                  The logo is optional. If empty, the icon will be shown instead.
                </p>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, icon }))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: form.icon === icon ? "rgba(0,229,255,0.15)" : "rgba(255,255,255,0.04)",
                        border: form.icon === icon ? "1px solid #00e5ff" : "1px solid rgba(255,255,255,0.08)",
                        color: form.icon === icon ? "#00e5ff" : "#6a9bbf",
                        fontSize: 16,
                      }}
                    >
                      <i className={`ti ${icon}`} />
                    </button>
                  ))}
                </div>
                <input
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="ti-building"
                  className="mt-2 w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Color Theme</label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyColorPreset(preset)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
                      style={{
                        background: preset.colorBg,
                        border: `1px solid ${form.color === preset.color ? preset.color : preset.colorBorder}`,
                        color: preset.color,
                      }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: preset.color }} />
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Color</label>
                    <input name="color" value={form.color} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Color Bg</label>
                    <input name="colorBg" value={form.colorBg} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Color Border</label>
                    <input name="colorBorder" value={form.colorBorder} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 p-3 rounded-xl" style={{ background: form.colorBg, border: `1px solid ${form.colorBorder}` }}>
                  <div className="flex items-center justify-center" style={{ width: 42, height: 42, borderRadius: 12, background: form.colorBg, border: `1px solid ${form.colorBorder}`, color: form.color, fontSize: 18 }}>
                    {form.logo ? <img src={form.logo} alt="preview" className="w-full h-full object-cover rounded-[11px]" /> : <i className={`ti ${form.icon || "ti-building"}`} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: form.color }}>{form.name || "Client name"}</div>
                    <div style={{ fontSize: 10, color: "#6a9bbf" }}>{form.location || "Location"}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 border border-slate-700 text-slate-400 hover:text-white text-sm rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all">
                  {saving ? "Saving…" : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setDeleteId(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-semibold mb-2">Delete Client?</h3>
            <p className="text-slate-400 text-sm mb-6">This removes the client record and its logo reference.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-white text-sm rounded-xl transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ClientAdmin;