const express = require("express");
const router  = express.Router();
const {
  getPhotos, getAdminPhotos, getPhoto,
  createPhoto, updatePhoto, deletePhoto, togglePhoto,
} = require("../controllers/photoController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── Public ───────────────────────────────────────────────────────
router.get("/",    getPhotos);   // ?category=NETWORK (optional filter)
router.get("/:id", getPhoto);

// ── Admin (protected) ────────────────────────────────────────────
router.get("/admin/all",      protect, adminOnly, getAdminPhotos);
router.post("/",              protect, adminOnly, createPhoto);
router.put("/:id",            protect, adminOnly, updatePhoto);
router.delete("/:id",         protect, adminOnly, deletePhoto);
router.patch("/:id/toggle",   protect, adminOnly, togglePhoto);

module.exports = router;
