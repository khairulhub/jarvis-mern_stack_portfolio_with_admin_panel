const Service = require("../models/Service");

// ── Default fallback — shown when DB is empty or unreachable ─────
const DEFAULT_SERVICES = [
  {
    _id: "default_svc_1",
    icon: "ti-brand-react",
    title: "MERN STACK DEV",
    desc: "Full-stack web development using MongoDB, Express.js, React.js, and Node.js. Building scalable SPAs and REST APIs.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    color: "#38bdf8",
    colorBg: "rgba(56,189,248,0.08)",
    colorBorder: "rgba(56,189,248,0.25)",
    isActive: true,
    order: 1,
  },
];

// @desc  Get active services (public) — falls back to DEFAULT if DB empty/error
// @route GET /api/services
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    if (services.length === 0) {
      return res.json({ success: true, data: DEFAULT_SERVICES, source: "default" });
    }
    res.json({ success: true, data: services, source: "db" });
  } catch (error) {
    res.json({ success: true, data: DEFAULT_SERVICES, source: "default_fallback" });
  }
};

// @desc  Get ALL services (admin — includes inactive)
// @route GET /api/services/admin/all
const getAdminServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single service
// @route GET /api/services/:id
const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create service
// @route POST /api/services
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, message: "Service created", data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Update service
// @route PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, message: "Service updated", data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Delete service
// @route DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Toggle active/inactive
// @route PATCH /api/services/:id/toggle
const toggleService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    service.isActive = !service.isActive;
    await service.save();
    res.json({
      success: true,
      message: `Service ${service.isActive ? "activated" : "deactivated"}`,
      data: service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getServices,
  getAdminServices,
  getService,
  createService,
  updateService,
  deleteService,
  toggleService,
};