const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      unique: true, // same IP 2nd time insert hobe na
      trim: true,
    },
    // IP details (ip-api.com theke pawa)
    country: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    region: { type: String, default: "" },
    city: { type: String, default: "" },
    isp: { type: String, default: "" },
    org: { type: String, default: "" },
    timezone: { type: String, default: "" },
    lat: { type: Number, default: 0 },
    lon: { type: Number, default: 0 },
    // User-Agent theke parse kora
    userAgent: { type: String, default: "" },
    device: { type: String, default: "" }, // mobile / tablet / desktop
    browser: { type: String, default: "" },
    os: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
