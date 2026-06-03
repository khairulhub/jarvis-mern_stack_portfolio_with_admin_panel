const Work = require("../models/Work");
const axios = require("axios");

// ── helper: delete image from imgBB via delete URL ──────────────
const deleteFromImgBB = async (deleteUrl) => {
  if (!deleteUrl) return;
  try {
    await axios.get(deleteUrl, { timeout: 8000 });
  } catch (err) {
    // imgBB delete is best-effort — don't block the main flow
    console.warn("imgBB delete failed (non-fatal):", err.message);
  }
};

// ── Default fallback data (shown when DB is unreachable / empty) ─
const DEFAULT_WORKS = [
  {
    _id: "default_1",
    icon: "🏪", iconBg: "linear-gradient(135deg,#facc1520,#fbbf2420)",
    accentColor: "#facc15", accentBg: "rgba(250,204,21,0.08)", accentBorder: "rgba(250,204,21,0.25)",
    category: "NETWORKING", title: "Shop Management System", subtitle: "Based on Networking & CCTV",
    shortDesc: "A complete shop network with 40 PCs, IP cameras, printers, and access points — all segmented via VLAN for security.",
    longDesc: "Designed and simulated a shop environment with 40 computers, 6 IP cameras, 2 printers, and 2 wireless access points using Cisco Packet Tracer. The network uses VLAN segmentation to isolate CCTV traffic from the main office network. DHCP is configured per VLAN, and inter-VLAN routing is handled by a Layer 3 switch.",
    features: ["40 PCs + 6 IP Cameras + 2 Printers","VLAN Segmentation (Camera vs Office)","DHCP per VLAN","Layer 3 Inter-VLAN Routing","2 Wireless Access Points","Admin-only CCTV access control"],
    tags: ["Cisco","VLAN","CCTV","DHCP","Packet Tracer"],
    url: null, github: null, isActive: true, order: 0, image: "", imageDeleteUrl: "",
  },
];

// @desc  Get active works (public) — falls back to DEFAULT_WORKS if DB empty / error
// @route GET /api/works
const getWorks = async (req, res) => {
  try {
    const works = await Work.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    if (works.length === 0) {
      return res.json({ success: true, data: DEFAULT_WORKS, source: "default" });
    }
    res.json({ success: true, data: works, source: "db" });
  } catch (error) {
    // DB unreachable — return default data so the frontend still renders
    res.json({ success: true, data: DEFAULT_WORKS, source: "default_fallback" });
  }
};

// @desc  Get ALL works (admin — includes inactive)
// @route GET /api/works/admin/all
const getAdminWorks = async (req, res) => {
  try {
    const works = await Work.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: works });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single work
// @route GET /api/works/:id
const getWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: "Work not found" });
    res.json({ success: true, data: work });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create work
// @route POST /api/works
const createWork = async (req, res) => {
  try {
    const work = await Work.create(req.body);
    res.status(201).json({ success: true, message: "Work created", data: work });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Update work — if image changed, delete old from imgBB
// @route PUT /api/works/:id
const updateWork = async (req, res) => {
  try {
    const existing = await Work.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Work not found" });

    // If a new image URL is provided and it differs from the old one → delete old from imgBB
    const newImage = req.body.image;
    if (newImage !== undefined && newImage !== existing.image && existing.imageDeleteUrl) {
      await deleteFromImgBB(existing.imageDeleteUrl);
      // If the new image is cleared, also clear the deleteUrl
      if (!newImage) req.body.imageDeleteUrl = "";
    }

    const updated = await Work.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    res.json({ success: true, message: "Work updated", data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Delete work — also removes image from imgBB
// @route DELETE /api/works/:id
const deleteWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: "Work not found" });

    // Delete imgBB image if exists
    if (work.imageDeleteUrl) await deleteFromImgBB(work.imageDeleteUrl);

    await Work.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Work deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Toggle active/inactive
// @route PATCH /api/works/:id/toggle
const toggleWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: "Work not found" });
    work.isActive = !work.isActive;
    await work.save();
    res.json({
      success: true,
      message: `Work ${work.isActive ? "activated" : "deactivated"}`,
      data: work,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getWorks, getAdminWorks, getWork, createWork, updateWork, deleteWork, toggleWork };
