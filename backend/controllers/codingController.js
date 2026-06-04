const Coding = require("../models/Coding");

// ── Default fallback — shown when DB is empty / unreachable ─────
const DEFAULT_CODINGS = [
  {
    _id: "default_coding_1",
    icon: "ti-brand-react",
    title: "MERN Stack Setup",
    color: "#00e5ff",
    colorBg: "rgba(0,229,255,0.08)",
    colorBorder: "rgba(0,229,255,0.25)",
    shortDesc: "Full-stack MongoDB, Express, React & Node.js starter template.",
    tags: ["MongoDB", "Express", "React", "Node.js", "Mongoose", "dotenv", "CORS"],
    codes: [
      {
        tag: "MongoDB",
        label: "MongoDB — Setup & Connection",
        lang: "js",
        snippet: `// npm install mongoose\n\nconst mongoose = require('mongoose');\n\nconst connectDB = async () => {\n  try {\n    await mongoose.connect(process.env.MONGO_URI);\n    console.log('✅ MongoDB connected');\n  } catch (err) {\n    console.error('❌ MongoDB error:', err.message);\n    process.exit(1);\n  }\n};\n\nmodule.exports = connectDB;`,
      },
    ],
    isActive: true,
    order: 1,
  },
];

// @desc  Get active codings (public) — latest 6, fallback if empty
// @route GET /api/codings
const getCodings = async (req, res) => {
  try {
    const codings = await Coding.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);

    if (codings.length === 0) {
      return res.json({ success: true, data: DEFAULT_CODINGS, source: "default" });
    }
    res.json({ success: true, data: codings, source: "db" });
  } catch (error) {
    res.json({ success: true, data: DEFAULT_CODINGS, source: "default_fallback" });
  }
};

// @desc  Get ALL codings (admin — includes inactive, no limit)
// @route GET /api/codings/admin/all
const getAdminCodings = async (req, res) => {
  try {
    const codings = await Coding.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: codings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single coding by id
// @route GET /api/codings/:id
const getCoding = async (req, res) => {
  try {
    const coding = await Coding.findById(req.params.id);
    if (!coding) return res.status(404).json({ success: false, message: "Coding not found" });
    res.json({ success: true, data: coding });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create coding (admin)
// @route POST /api/codings
const createCoding = async (req, res) => {
  try {
    const coding = await Coding.create(req.body);
    res.status(201).json({ success: true, message: "Coding created", data: coding });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Update coding (admin)
// @route PUT /api/codings/:id
const updateCoding = async (req, res) => {
  try {
    const coding = await Coding.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coding) return res.status(404).json({ success: false, message: "Coding not found" });
    res.json({ success: true, message: "Coding updated", data: coding });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Delete coding (admin)
// @route DELETE /api/codings/:id
const deleteCoding = async (req, res) => {
  try {
    const coding = await Coding.findByIdAndDelete(req.params.id);
    if (!coding) return res.status(404).json({ success: false, message: "Coding not found" });
    res.json({ success: true, message: "Coding deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Toggle active/inactive (admin)
// @route PATCH /api/codings/:id/toggle
const toggleCoding = async (req, res) => {
  try {
    const coding = await Coding.findById(req.params.id);
    if (!coding) return res.status(404).json({ success: false, message: "Coding not found" });
    coding.isActive = !coding.isActive;
    await coding.save();
    res.json({
      success: true,
      message: `Coding ${coding.isActive ? "activated" : "deactivated"}`,
      data: coding,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCodings,
  getAdminCodings,
  getCoding,
  createCoding,
  updateCoding,
  deleteCoding,
  toggleCoding,
};
