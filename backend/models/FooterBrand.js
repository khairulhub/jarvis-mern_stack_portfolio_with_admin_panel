const mongoose = require("mongoose");

const footerBrandSchema = new mongoose.Schema(
  {
    _id:           { type: String },
    logoText:      { type: String, trim: true, default: "K" },         // circle এর ভেতরের অক্ষর
    brandName:     { type: String, trim: true, default: "KHAIRULHUB" }, // logo এর পাশের নাম
    taglineText:   { type: String, trim: true, default: "Full Stack Developer & Network Engineer based in Dhaka, Bangladesh. Building robust apps & networks." },
    copyrightText: { type: String, trim: true, default: "© 2025 KhairulHub. All rights reserved." },
    imageUrl:      { type: String, trim: true, default: "" },          // logo image URL (optional)
    showImage:     { type: Boolean, default: false },                   // route circle এর বদলে image
    imageOnly:     { type: Boolean, default: false },                   // পুরো logo section এর বদলে শুধু image
  },
  { timestamps: true }
);

module.exports = mongoose.model("FooterBrand", footerBrandSchema, "footerbrand");
