const mongoose = require("mongoose");

const workSchema = new mongoose.Schema(
  {
    // Display
    title:      { type: String, required: [true, "Title is required"], trim: true },
    subtitle:   { type: String, default: "", trim: true },
    category:   {
      type: String,
      required: true,
      enum: ["MERN", "LARAVEL", "NETWORKING", "IoT", "SECURITY", "OTHER"],
      default: "OTHER",
    },
    shortDesc:  { type: String, default: "", maxlength: 300 },
    longDesc:   { type: String, default: "" },
    features:   [{ type: String }],
    tags:       [{ type: String }],

    // Visual — icon OR image (both optional)
    icon:       { type: String, default: "" },           // emoji e.g. "🏪"
    iconBg:     { type: String, default: "" },           // CSS gradient string
    image:      { type: String, default: "" },           // imgBB URL
    imageDeleteUrl: { type: String, default: "" },       // imgBB delete hash URL

    // Accent colours (auto-set by category on backend if empty)
    accentColor:  { type: String, default: "#00e5ff" },
    accentBg:     { type: String, default: "rgba(0,229,255,0.08)" },
    accentBorder: { type: String, default: "rgba(0,229,255,0.25)" },

    // Links
    url:    { type: String, default: "" },
    github: { type: String, default: "" },

    // Admin control
    isActive: { type: Boolean, default: true },
    order:    { type: Number,  default: 0 },
  },
  { timestamps: true }
);

// Helper: set accent colours based on category if not provided
workSchema.pre("save", function (next) {
  const palettes = {
    NETWORKING: { accentColor: "#facc15", accentBg: "rgba(250,204,21,0.08)", accentBorder: "rgba(250,204,21,0.25)", iconBg: "linear-gradient(135deg,#facc1520,#fbbf2420)" },
    LARAVEL:    { accentColor: "#c084fc", accentBg: "rgba(168,85,247,0.08)",  accentBorder: "rgba(168,85,247,0.25)", iconBg: "linear-gradient(135deg,#c084fc20,#a855f720)" },
    IoT:        { accentColor: "#00ff88", accentBg: "rgba(0,255,136,0.08)",   accentBorder: "rgba(0,255,136,0.25)", iconBg: "linear-gradient(135deg,#00ff8820,#00e5ff20)" },
    MERN:       { accentColor: "#ffa040", accentBg: "rgba(255,140,0,0.08)",   accentBorder: "rgba(255,140,0,0.25)", iconBg: "linear-gradient(135deg,#ffa04020,#fb923c20)" },
    SECURITY:   { accentColor: "#f87171", accentBg: "rgba(239,68,68,0.08)",   accentBorder: "rgba(239,68,68,0.25)", iconBg: "linear-gradient(135deg,#f8717120,#ef444420)" },
    OTHER:      { accentColor: "#38bdf8", accentBg: "rgba(56,189,248,0.08)",  accentBorder: "rgba(56,189,248,0.25)", iconBg: "linear-gradient(135deg,#38bdf820,#0ea5e920)" },
  };
  const p = palettes[this.category] || palettes.OTHER;
  if (!this.accentColor || this.accentColor === "#00e5ff") this.accentColor  = p.accentColor;
  if (!this.accentBg    || this.accentBg    === "rgba(0,229,255,0.08)")  this.accentBg    = p.accentBg;
  if (!this.accentBorder|| this.accentBorder=== "rgba(0,229,255,0.25)")  this.accentBorder= p.accentBorder;
  if (!this.iconBg) this.iconBg = p.iconBg;
  next();
});

module.exports = mongoose.model("Work", workSchema);
