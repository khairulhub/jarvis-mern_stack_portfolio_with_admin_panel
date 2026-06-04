const Network = require("../models/Network");

// ─── Public ───────────────────────────────────────────
// GET /api/networks  →  only active, sorted by order
exports.getPublicNetworks = async (req, res) => {
  try {
    const networks = await Network.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: networks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Admin ────────────────────────────────────────────
// GET /api/networks/admin/all  →  all items
exports.getAllNetworks = async (req, res) => {
  try {
    const networks = await Network.find().sort({ order: 1 });
    res.json({ success: true, data: networks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/networks/:id
exports.getNetworkById = async (req, res) => {
  try {
    const network = await Network.findById(req.params.id);
    if (!network) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: network });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/networks
exports.createNetwork = async (req, res) => {
  try {
    const network = await Network.create(req.body);
    res.status(201).json({ success: true, data: network });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/networks/:id
exports.updateNetwork = async (req, res) => {
  try {
    const network = await Network.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!network) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: network });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/networks/:id
exports.deleteNetwork = async (req, res) => {
  try {
    const network = await Network.findByIdAndDelete(req.params.id);
    if (!network) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/networks/:id/toggle  →  active/inactive toggle
exports.toggleNetworkStatus = async (req, res) => {
  try {
    const network = await Network.findById(req.params.id);
    if (!network) return res.status(404).json({ success: false, message: "Not found" });
    network.isActive = !network.isActive;
    await network.save();
    res.json({ success: true, data: network });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
