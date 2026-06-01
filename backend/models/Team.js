const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    role: { type: String, required: [true, "Role is required"], trim: true },
    department: {
      type: String,
      enum: ["Engineering", "Design", "Marketing", "Sales", "Operations", "Other"],
      default: "Other",
    },
    bio: { type: String, maxlength: 500, default: "" },
    avatar: { type: String, default: "" },
    email: { type: String, trim: true, lowercase: true },
    social: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
