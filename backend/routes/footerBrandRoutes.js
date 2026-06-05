const express = require("express");
const router  = express.Router();
const { getFooterBrand, updateFooterBrand } = require("../controllers/footerBrandController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/",  getFooterBrand);                            // public
router.put("/",  protect, adminOnly, updateFooterBrand);     // admin only

module.exports = router;
