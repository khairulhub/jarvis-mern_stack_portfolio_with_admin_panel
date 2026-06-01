const Blog = require("../models/Blog");

// @desc    Get all blogs (public)
// @route   GET /api/blogs
const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    else query.status = "published"; // public sees only published

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: blogs,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all blogs for admin (all statuses)
// @route   GET /api/blogs/admin/all
const getAdminBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$or = [{ title: { $regex: search, $options: "i" } }];

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: blogs, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name avatar");

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog by ID (admin)
// @route   GET /api/blogs/id/:id
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, message: "Blog created", data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, message: "Blog updated", data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllBlogs, getAdminBlogs, getBlogBySlug, getBlogById, createBlog, updateBlog, deleteBlog };
