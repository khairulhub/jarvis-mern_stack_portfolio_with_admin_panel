const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema(
  {
    title:   { type: String, default: "" },
    desc:    { type: String, default: "" },
    code:    { type: String, default: "" },
  },
  { _id: false }
);

const networkSchema = new mongoose.Schema(
  {
    order:        { type: Number, default: 0 },
    icon:         { type: String, default: "ti-router", trim: true },
    emoji:        { type: String, default: "🔀", trim: true },
    accentColor:  { type: String, default: "#00e5ff", trim: true },
    accentBg:     { type: String, default: "rgba(0,229,255,0.08)", trim: true },
    accentBorder: { type: String, default: "rgba(0,229,255,0.25)", trim: true },
    category:     { type: String, default: "CISCO", trim: true },
    title:        { type: String, required: [true, "Title is required"], trim: true },
    subtitle:     { type: String, default: "", trim: true },
    shortDesc:    { type: String, default: "", maxlength: 500 },
    diagram:      { type: String, default: "" },
    steps:        { type: [stepSchema], default: [] },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

networkSchema.index({ order: 1 });

module.exports = mongoose.model("Network", networkSchema);
