const PhotoCategory = require("../models/PhotoCategory");

// ── Default fallback (DB unreachable / empty) ────────────────────
const DEFAULT_CATEGORIES = [
  { _id: "def_cat_1", name: "NETWORK",  slug: "network",  color: "#facc15", order: 1, isActive: true },
  { _id: "def_cat_2", name: "CODING",   slug: "coding",   color: "#38bdf8", order: 2, isActive: true },
  { _id: "def_cat_3", name: "CERT",     slug: "cert",     color: "#00ff88", order: 3, isActive: true },
];

// @desc  Get active categories (public)
// @route GET /api/photo-categories
const getCategories = async (req, res) => {
  try {
    const cats = await PhotoCategory.find({ isActive: true }).sort({ order: 1, name: 1 });
    if (cats.length === 0) {
      return res.json({ success: true, data: DEFAULT_CATEGORIES, source: "default" });
    }
    res.json({ success: true, data: cats, source: "db" });
  } catch (error) {
    res.json({ success: true, data: DEFAULT_CATEGORIES, source: "default_fallback" });
  }
};

// @desc  Get ALL categories (admin)
// @route GET /api/photo-categories/admin/all
const getAdminCategories = async (req, res) => {
  try {
    const cats = await PhotoCategory.find().sort({ order: 1, name: 1 });
    res.json({ success: true, data: cats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create category
// @route POST /api/photo-categories
const createCategory = async (req, res) => {
  try {
    // Auto-generate slug if not provided
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    const cat = await PhotoCategory.create(req.body);
    res.status(201).json({ success: true, message: "Category created", data: cat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Update category
// @route PUT /api/photo-categories/:id
const updateCategory = async (req, res) => {
  try {
    // Regenerate slug if name changed and no custom slug given
    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    const cat = await PhotoCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category updated", data: cat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Delete category
// @route DELETE /api/photo-categories/:id
const deleteCategory = async (req, res) => {
  try {
    const cat = await PhotoCategory.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Toggle active/inactive
// @route PATCH /api/photo-categories/:id/toggle
const toggleCategory = async (req, res) => {
  try {
    const cat = await PhotoCategory.findById(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
    cat.isActive = !cat.isActive;
    await cat.save();
    res.json({ success: true, message: `Category ${cat.isActive ? "activated" : "deactivated"}`, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, getAdminCategories, createCategory, updateCategory, deleteCategory, toggleCategory };
