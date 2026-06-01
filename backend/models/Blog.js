const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: [true, "Content is required"] },
    coverImage: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: ["Technology", "Business", "Design", "Marketing", "Other"],
      default: "Other",
    },
    tags: [{ type: String, trim: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
      "-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
