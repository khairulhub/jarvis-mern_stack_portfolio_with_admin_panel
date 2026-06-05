const express = require("express");
const router  = express.Router();
const {
  getCategories, getAdminCategories,
  createCategory, updateCategory, deleteCategory, toggleCategory,
} = require("../controllers/photoCategoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── Public ───────────────────────────────────────────────────────
router.get("/", getCategories);

// ── Admin (protected) ────────────────────────────────────────────
router.get("/admin/all",        protect, adminOnly, getAdminCategories);
router.post("/",                protect, adminOnly, createCategory);
router.put("/:id",              protect, adminOnly, updateCategory);
router.delete("/:id",           protect, adminOnly, deleteCategory);
router.patch("/:id/toggle",     protect, adminOnly, toggleCategory);

module.exports = router;
