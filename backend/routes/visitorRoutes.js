const express = require("express");
const router = express.Router();
const {
  trackVisitor,
  getVisitorCount,
  getVisitorDetails,
} = require("../controllers/visitorController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.post("/track", trackVisitor);          // frontend call korbe
router.get("/count", getVisitorCount);        // frontend total count

// Admin only
router.get("/details", protect, adminOnly, getVisitorDetails); // IP + details

module.exports = router;
