const express = require("express");
const router = express.Router();
const { getHero, updateHero } = require("../controllers/heroController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getHero);                        // public
router.put("/", protect, adminOnly, updateHero); // admin only

module.exports = router;