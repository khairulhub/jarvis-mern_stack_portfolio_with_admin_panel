const express = require("express");
const router  = express.Router();
const {
  getPublicNetworks,
  getAllNetworks,
  getNetworkById,
  createNetwork,
  updateNetwork,
  deleteNetwork,
  toggleNetworkStatus,
} = require("../controllers/networkController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/", getPublicNetworks);

// Admin (protected)
router.get("/admin/all",          protect, getAllNetworks);
router.get("/:id",                protect, getNetworkById);
router.post("/",                  protect, createNetwork);
router.put("/:id",                protect, updateNetwork);
router.delete("/:id",             protect, deleteNetwork);
router.patch("/:id/toggle",       protect, toggleNetworkStatus);

module.exports = router;
