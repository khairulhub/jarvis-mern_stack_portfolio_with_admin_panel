const express = require("express");
const router  = express.Router();
const {
  getWorks, getAdminWorks, getWork,
  createWork, updateWork, deleteWork, toggleWork,
} = require("../controllers/workController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── Public ──────────────────────────────────────────────────────
router.get("/",     getWorks);   // active only — with default fallback
router.get("/:id",  getWork);

// ── Admin (protected) ───────────────────────────────────────────
router.get("/admin/all",       protect, adminOnly, getAdminWorks);
router.post("/",               protect, adminOnly, createWork);
router.put("/:id",             protect, adminOnly, updateWork);
router.delete("/:id",          protect, adminOnly, deleteWork);
router.patch("/:id/toggle",    protect, adminOnly, toggleWork);

module.exports = router;
