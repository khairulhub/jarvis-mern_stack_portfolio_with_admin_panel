const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    _id: { type: String },
    tagline:      { type: String, trim: true },
    name:         { type: String, trim: true },
    subtitle:     { type: String, trim: true },
    description:  { type: String },
    location:     { type: String, trim: true },
    statusText:   { type: String, trim: true },
    cvLink:       { type: String, trim: true },
    profileImage: { type: String, default: "" },
    chips:        { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", heroSchema);