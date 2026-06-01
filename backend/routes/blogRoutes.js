const express = require("express");
const router = express.Router();
const {
  getAllBlogs, getAdminBlogs, getBlogBySlug, getBlogById,
  createBlog, updateBlog, deleteBlog,
} = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllBlogs);
router.get("/slug/:slug", getBlogBySlug);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAdminBlogs);
router.get("/id/:id", protect, adminOnly, getBlogById);
router.post("/", protect, adminOnly, createBlog);
router.put("/:id", protect, adminOnly, updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);

module.exports = router;
