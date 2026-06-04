const mongoose = require("mongoose");

// Per-tag code snippet sub-schema
const codeSnippetSchema = new mongoose.Schema(
  {
    tag:     { type: String, required: true, trim: true }, // e.g. "MongoDB"
    label:   { type: String, default: "", trim: true },    // e.g. "MongoDB — Setup & Connection"
    lang:    { type: String, default: "js", trim: true },  // js | bash | php | html | css
    snippet: { type: String, default: "" },                // the actual code string
  },
  { _id: false }
);

const codingSchema = new mongoose.Schema(
  {
    // Display
    icon:       { type: String, default: "ti-code", trim: true },  // tabler icon class
    title:      { type: String, required: [true, "Title is required"], trim: true },
    color:      { type: String, default: "#00e5ff", trim: true },
    colorBg:    { type: String, default: "rgba(0,229,255,0.08)", trim: true },
    colorBorder:{ type: String, default: "rgba(0,229,255,0.25)", trim: true },
    shortDesc:  { type: String, default: "", maxlength: 300 },

    // Tags list + per-tag code
    tags:       { type: [String], default: [] },   // ordered list of tag names
    codes:      { type: [codeSnippetSchema], default: [] }, // one entry per tag

    // Admin control
    isActive:   { type: Boolean, default: true },
    order:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

codingSchema.index({ order: 1 });

module.exports = mongoose.model("Coding", codingSchema);
