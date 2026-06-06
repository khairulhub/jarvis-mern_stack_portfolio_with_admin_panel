const Documentation = require("../models/Documentation");

// GET /api/docs — all pages (public)
const getAllDocs = async (req, res) => {
  try {
    const docs = await Documentation.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/docs/:id — single page (public)
const getDoc = async (req, res) => {
  try {
    const doc = await Documentation.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Doc not found" });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/docs — create page (admin)
const createDoc = async (req, res) => {
  try {
    const { title, slug, icon, category, order, sections } = req.body;
    if (!title || !slug) return res.status(400).json({ success: false, message: "Title and slug required" });

    // auto-generate slug if empty string passed
    const safeSlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const doc = await Documentation.create({ title, slug: safeSlug, icon, category, order, sections: sections || [] });
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/docs/:id — update page (admin)
const updateDoc = async (req, res) => {
  try {
    const { title, slug, icon, category, order, sections } = req.body;
    const doc = await Documentation.findByIdAndUpdate(
      req.params.id,
      { $set: { title, slug, icon, category, order, sections } },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ success: false, message: "Doc not found" });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/docs/:id (admin)
const deleteDoc = async (req, res) => {
  try {
    const doc = await Documentation.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Doc not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllDocs, getDoc, createDoc, updateDoc, deleteDoc };
