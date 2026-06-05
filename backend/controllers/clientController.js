const Client = require("../models/Client");
const axios  = require("axios");

// ── imgBB delete helper ──────────────────────────────────────────
const deleteFromImgBB = async (deleteUrl) => {
  if (!deleteUrl) return;
  try { await axios.get(deleteUrl, { timeout: 8000 }); }
  catch (err) { console.warn("imgBB delete failed (non-fatal):", err.message); }
};

// ── Default fallback (DB empty / unreachable) ────────────────────
const DEFAULT_CLIENTS = [
  {
    _id:         "default_client_1",
    name:        "Edge Tech BD",
    location:    "Dhaka, Bangladesh",
    details:     "CCTV surveillance, access control & intercom infrastructure for multiple commercial sites.",
    logo:        "",
    icon:        "ti-building",
    color:       "#facc15",
    colorBg:     "rgba(250,204,21,0.08)",
    colorBorder: "rgba(250,204,21,0.25)",
    isActive:    true,
    order:       1,
  },
];

// ── GET /api/clients  (public — active only) ─────────────────────
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    if (clients.length === 0)
      return res.json({ success: true, data: DEFAULT_CLIENTS, source: "default" });
    res.json({ success: true, data: clients, source: "db" });
  } catch {
    res.json({ success: true, data: DEFAULT_CLIENTS, source: "default_fallback" });
  }
};

// ── GET /api/clients/admin/all  (admin) ──────────────────────────
const getAdminClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/clients/:id ─────────────────────────────────────────
const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/clients  (admin) ───────────────────────────────────
const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ success: true, message: "Client created", data: client });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── PUT /api/clients/:id  (admin) ────────────────────────────────
const updateClient = async (req, res) => {
  try {
    const existing = await Client.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Client not found" });

    // If logo changed → delete old from imgBB
    if (req.body.logo !== undefined && req.body.logo !== existing.logo && existing.logoDeleteUrl) {
      await deleteFromImgBB(existing.logoDeleteUrl);
      if (!req.body.logo) req.body.logoDeleteUrl = "";
    }

    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    res.json({ success: true, message: "Client updated", data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/clients/:id  (admin) ────────────────────────────
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });

    if (client.logoDeleteUrl) await deleteFromImgBB(client.logoDeleteUrl);
    await Client.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PATCH /api/clients/:id/toggle  (admin) ──────────────────────
const toggleClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    client.isActive = !client.isActive;
    await client.save();
    res.json({
      success: true,
      message: `Client ${client.isActive ? "activated" : "deactivated"}`,
      data: client,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getClients, getAdminClients, getClient, createClient, updateClient, deleteClient, toggleClient };