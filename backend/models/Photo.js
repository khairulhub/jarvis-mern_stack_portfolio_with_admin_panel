const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    // Main content
    title:    { type: String, required: [true, "Title is required"], trim: true },
    subtitle: { type: String, default: "", trim: true },
    desc:     { type: String, default: "", maxlength: 500 },
    tags:     { type: [String], default: [] },

    // Category (slug reference — stored as string for simplicity + fallback)
    category:    { type: String, default: "OTHER", trim: true },   // e.g. "NETWORK"
    categoryId:  { type: mongoose.Schema.Types.ObjectId, ref: "PhotoCategory", default: null },

    // Visual: emoji icon OR imgBB image — if image set, icon is hidden
    emoji:          { type: String, default: "📷" },
    color:          { type: String, default: "#00e5ff" },  // accent color
    image:          { type: String, default: "" },         // imgBB URL
    imageDeleteUrl: { type: String, default: "" },         // imgBB delete URL

    // Card height (masonry)
    height: { type: Number, default: 180 },

    // Admin control
    isActive: { type: Boolean, default: true },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", photoSchema);
