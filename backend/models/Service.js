const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    icon:        { type: String, default: "ti-code", trim: true },       // tabler icon class
    title:       { type: String, required: [true, "Title is required"], trim: true },
    desc:        { type: String, default: "", trim: true },
    tags:        { type: [String], default: [] },
    color:       { type: String, default: "#00e5ff" },
    colorBg:     { type: String, default: "rgba(0,229,255,0.08)" },
    colorBorder: { type: String, default: "rgba(0,229,255,0.25)" },
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceSchema.index({ order: 1 });

module.exports = mongoose.model("Service", serviceSchema);