const Photo = require("../models/Photo");
const axios  = require("axios");

// ── Helper: delete imgBB image ────────────────────────────────
const deleteFromImgBB = async (deleteUrl) => {
  if (!deleteUrl) return;
  try {
    await axios.get(deleteUrl, { timeout: 8000 });
  } catch (err) {
    console.warn("imgBB delete failed (non-fatal):", err.message);
  }
};

// ── Default fallback data (DB empty / unreachable) ────────────
const DEFAULT_PHOTOS = [
  {
    _id: "default_photo_1",
    title: "Campus Network Design",
    subtitle: "12-Floor University Topology",
    desc: "Designed and simulated a complete 12-floor university campus network using Cisco Packet Tracer with VLANs, DHCP, and inter-VLAN routing on a Layer 3 core switch.",
    tags: ["Cisco", "VLAN", "DHCP", "Packet Tracer"],
    category: "NETWORK",
    emoji: "🌐",
    color: "#facc15",
    image: "",
    height: 180,
    isActive: true,
    order: 0,
  },
];

// @desc  Get active photos (public) — with category filter
// @route GET /api/photos?category=NETWORK
const getPhotos = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category && req.query.category !== "ALL") {
      filter.category = req.query.category.toUpperCase();
    }
    const photos = await Photo.find(filter).sort({ order: 1, createdAt: -1 });
    if (photos.length === 0) {
      return res.json({ success: true, data: DEFAULT_PHOTOS, source: "default" });
    }
    res.json({ success: true, data: photos, source: "db" });
  } catch (error) {
    res.json({ success: true, data: DEFAULT_PHOTOS, source: "default_fallback" });
  }
};

// @desc  Get ALL photos (admin — includes inactive)
// @route GET /api/photos/admin/all
const getAdminPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single photo
// @route GET /api/photos/:id
const getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: "Photo not found" });
    res.json({ success: true, data: photo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create photo
// @route POST /api/photos
const createPhoto = async (req, res) => {
  try {
    const photo = await Photo.create(req.body);
    res.status(201).json({ success: true, message: "Photo created", data: photo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Update photo — delete old imgBB image if replaced
// @route PUT /api/photos/:id
const updatePhoto = async (req, res) => {
  try {
    const existing = await Photo.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Photo not found" });

    const newImage = req.body.image;
    if (newImage !== undefined && newImage !== existing.image && existing.imageDeleteUrl) {
      await deleteFromImgBB(existing.imageDeleteUrl);
      if (!newImage) req.body.imageDeleteUrl = "";
    }

    const updated = await Photo.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    res.json({ success: true, message: "Photo updated", data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Delete photo — also removes from imgBB
// @route DELETE /api/photos/:id
const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: "Photo not found" });

    if (photo.imageDeleteUrl) await deleteFromImgBB(photo.imageDeleteUrl);

    await Photo.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Photo deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Toggle active/inactive
// @route PATCH /api/photos/:id/toggle
const togglePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: "Photo not found" });
    photo.isActive = !photo.isActive;
    await photo.save();
    res.json({
      success: true,
      message: `Photo ${photo.isActive ? "activated" : "deactivated"}`,
      data: photo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPhotos, getAdminPhotos, getPhoto,
  createPhoto, updatePhoto, deletePhoto, togglePhoto,
};
