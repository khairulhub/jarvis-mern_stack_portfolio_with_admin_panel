const express = require("express");
const router  = express.Router();
const { getAboutInfo, updateAboutInfo } = require("../controllers/aboutInfoController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/",  getAboutInfo);                             // public
router.put("/",  protect, adminOnly, updateAboutInfo);      // admin only

module.exports = router;
