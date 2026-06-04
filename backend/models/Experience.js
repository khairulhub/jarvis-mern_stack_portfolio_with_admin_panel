const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    company:     { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    period:      { type: String, required: true, trim: true },  // e.g. "Oct 2025 – Mar 2026"
    duration:    { type: String, required: true, trim: true },  // e.g. "6 months"
    type:        { type: String, default: "Full Time", trim: true },
    icon:        { type: String, default: "ti-briefcase", trim: true }, // tabler icon class
    color:       { type: String, default: "#00e5ff", trim: true },      // hex color
    colorBg:     { type: String, default: "rgba(0,229,255,0.08)", trim: true },
    colorBorder: { type: String, default: "rgba(0,229,255,0.25)", trim: true },
    location:    { type: String, default: "Dhaka, Bangladesh", trim: true },
    description: { type: String, required: true },
    skills:      { type: [String], default: [] },   // tech stack tags
    projects:    { type: [String], default: [] },   // project names
    order:       { type: Number, default: 0 },      // for sorting newest first
  },
  { timestamps: true }
);

// Sort by order ascending by default
experienceSchema.index({ order: 1 });

module.exports = mongoose.model("Experience", experienceSchema);