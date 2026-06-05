const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    // Identity
    name:     { type: String, required: [true, "Client name is required"], trim: true },
    location: { type: String, default: "", trim: true },   // e.g. "Dhaka, Bangladesh"
    details:  { type: String, default: "" },               // short description / project done

    // Visual — logo image URL (imgBB) or icon (tabler class)
    logo:          { type: String, default: "" },          // imgBB URL — shown if set
    logoDeleteUrl: { type: String, default: "" },          // imgBB delete URL
    icon:          { type: String, default: "ti-building" }, // tabler icon shown when no logo

    // Accent colour for the card
    color:       { type: String, default: "#00e5ff" },
    colorBg:     { type: String, default: "rgba(0,229,255,0.08)" },
    colorBorder: { type: String, default: "rgba(0,229,255,0.25)" },

    // Admin control
    isActive: { type: Boolean, default: true },
    order:    { type: Number,  default: 0 },
  },
  { timestamps: true }
);

clientSchema.index({ order: 1 });

module.exports = mongoose.model("Client", clientSchema);