const mongoose = require("mongoose");

const photoCategorySchema = new mongoose.Schema(
  {
    name:   { type: String, required: [true, "Category name is required"], trim: true, unique: true },
    slug:   { type: String, required: true, trim: true, unique: true, lowercase: true },
    color:  { type: String, default: "#00e5ff" },      // accent color e.g. "#facc15"
    order:  { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate slug from name before save
photoCategorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }
  next();
});

module.exports = mongoose.model("PhotoCategory", photoCategorySchema);
