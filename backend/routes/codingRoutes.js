const express = require("express");
const router  = express.Router();
const {
  getCodings, getAdminCodings, getCoding,
  createCoding, updateCoding, deleteCoding, toggleCoding,
} = require("../controllers/codingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── Public ──────────────────────────────────────────────────────
router.get("/",    getCodings);   // active only (latest 6) + default fallback
router.get("/:id", getCoding);

// ── Admin (protected) ───────────────────────────────────────────
router.get("/admin/all",        protect, adminOnly, getAdminCodings);
router.post("/",                protect, adminOnly, createCoding);
router.put("/:id",              protect, adminOnly, updateCoding);
router.delete("/:id",           protect, adminOnly, deleteCoding);
router.patch("/:id/toggle",     protect, adminOnly, toggleCoding);

module.exports = router;
