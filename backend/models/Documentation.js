const mongoose = require("mongoose");

// ── Section Schema (reusable sub-doc) ───────────────────────────
const sectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  body:    { type: String, required: true }, // markdown / plain text
  order:   { type: Number, default: 0 },
}, { _id: true });

// ── Page Schema ─────────────────────────────────────────────────
const pageSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  slug:     { type: String, required: true }, // e.g. "getting-started"
  icon:     { type: String, default: "ti-file" },
  category: { type: String, default: "General" },
  order:    { type: Number, default: 0 },
  sections: [sectionSchema],
}, { timestamps: true });

module.exports = mongoose.model("Documentation", pageSchema);
