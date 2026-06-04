const express = require("express");
const router  = express.Router();
const {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── Public ──────────────────────────────────────────────────────
router.get("/",    getExperiences);
router.get("/:id", getExperienceById);

// ── Admin only ──────────────────────────────────────────────────
router.post("/",    protect, adminOnly, createExperience);
router.put("/:id",  protect, adminOnly, updateExperience);
router.delete("/:id", protect, adminOnly, deleteExperience);

module.exports = router;