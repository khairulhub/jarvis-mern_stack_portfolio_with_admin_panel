const express = require("express");
const router  = express.Router();
const { getContactInfo, updateContactInfo } = require("../controllers/contactInfoController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/",  getContactInfo);                           // public
router.put("/",  protect, adminOnly, updateContactInfo);    // admin only

module.exports = router;
