const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema(
  {
    _id: { type: String },
    location:     { type: String, trim: true, default: "Gazipur, Dhaka, Bangladesh" },
    email:        { type: String, trim: true, default: "iubat21103033@gmail.com" },
    github:       { type: String, trim: true, default: "github.com/Khairulhub" },
    githubUrl:    { type: String, trim: true, default: "https://github.com/Khairulhub" },
    linkedin:     { type: String, trim: true, default: "linkedin.com/in/khairulhub" },
    linkedinUrl:  { type: String, trim: true, default: "https://linkedin.com/in/khairulhub" },
    website:      { type: String, trim: true, default: "engr-khairul.netlify.app" },
    websiteUrl:   { type: String, trim: true, default: "https://engr-khairul.netlify.app" },
    availability: { type: String, trim: true, default: "Open for Work" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactInfo", contactInfoSchema, "contactinfo");
