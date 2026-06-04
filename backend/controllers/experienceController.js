const Experience = require("../models/Experience");

// @desc  Get all experiences (public) — sorted by order
// @route GET /api/experiences
const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single experience by id
// @route GET /api/experiences/:id
const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ success: false, message: "Experience not found" });
    res.json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create experience (admin)
// @route POST /api/experiences
const createExperience = async (req, res) => {
  try {
    const {
      company, designation, period, duration, type,
      icon, color, colorBg, colorBorder, location,
      description, skills, projects, order,
    } = req.body;

    const experience = await Experience.create({
      company, designation, period, duration, type,
      icon, color, colorBg, colorBorder, location,
      description,
      skills:   Array.isArray(skills)   ? skills   : parseCommaSeparated(skills),
      projects: Array.isArray(projects) ? projects : parseCommaSeparated(projects),
      order: order ?? 0,
    });

    res.status(201).json({ success: true, message: "Experience created", data: experience });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Update experience (admin)
// @route PUT /api/experiences/:id
const updateExperience = async (req, res) => {
  try {
    const updates = { ...req.body };

    // ensure arrays
    if (updates.skills   !== undefined && !Array.isArray(updates.skills))
      updates.skills   = parseCommaSeparated(updates.skills);
    if (updates.projects !== undefined && !Array.isArray(updates.projects))
      updates.projects = parseCommaSeparated(updates.projects);

    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!experience)
      return res.status(404).json({ success: false, message: "Experience not found" });

    res.json({ success: true, message: "Experience updated", data: experience });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Delete experience (admin)
// @route DELETE /api/experiences/:id
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience)
      return res.status(404).json({ success: false, message: "Experience not found" });
    res.json({ success: true, message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// helper
const parseCommaSeparated = (val) =>
  String(val || "").split(",").map((s) => s.trim()).filter(Boolean);

module.exports = {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};