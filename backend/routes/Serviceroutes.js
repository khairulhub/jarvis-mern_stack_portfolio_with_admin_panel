
const express = require("express");
const router  = express.Router();
const {
  getServices,
  getAdminServices,
  getService,
  createService,
  updateService,
  deleteService,
  toggleService,
} = require("../controllers/Servicecontroller");  // Adjust the path as needed ami change korci 
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── Admin (protected) — MUST be before /:id routes ──────────────
router.get("/admin/all",       protect, adminOnly, getAdminServices);
router.post("/",               protect, adminOnly, createService);
router.put("/:id",             protect, adminOnly, updateService);
router.delete("/:id",          protect, adminOnly, deleteService);
router.patch("/:id/toggle",    protect, adminOnly, toggleService);

// ── Public — /:id must come AFTER /admin/all ─────────────────────
router.get("/",    getServices);
router.get("/:id", getService);

module.exports = router;