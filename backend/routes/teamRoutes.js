const express = require("express");
const router = express.Router();
const {
  getTeam, getAdminTeam, getTeamMember,
  createTeamMember, updateTeamMember, deleteTeamMember, toggleTeamMember,
} = require("../controllers/teamController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getTeam);
router.get("/:id", getTeamMember);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAdminTeam);
router.post("/", protect, adminOnly, createTeamMember);
router.put("/:id", protect, adminOnly, updateTeamMember);
router.delete("/:id", protect, adminOnly, deleteTeamMember);
router.patch("/:id/toggle", protect, adminOnly, toggleTeamMember);

module.exports = router;
