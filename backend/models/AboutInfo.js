const mongoose = require("mongoose");

// Each mini-card in the About section info grid
const infoCardSchema = new mongoose.Schema(
  {
    icon:  { type: String, trim: true, default: "ti-user" }, // Tabler icon class
    label: { type: String, trim: true },                     // e.g. "Name"
    value: { type: String, trim: true },                     // e.g. "Md Khairul Islam"
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const aboutInfoSchema = new mongoose.Schema(
  {
    _id: { type: String },

    // Left-side paragraph text
    paragraph1: { type: String, default: "" },
    paragraph2: { type: String, default: "" },
    paragraph3: { type: String, default: "" },

    // Info mini-cards (the 4-card grid)
    infoCards: { type: [infoCardSchema], default: [] },

    // Right-side stat cards
    stats: {
       type: [
    {
      num:       { type: String, trim: true },
      label:     { type: String, trim: true },

      clickable: { type: Boolean, default: false }, // experience modal

      clientStat:{ type: Boolean, default: false }, // client modal

      targetId:  { type: String, default: "" },     // selected client/experience

      link:      { type: String, trim: true, default: "" },

      order:     { type: Number, default: 0 },

      _id: false,
    },
  ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutInfo", aboutInfoSchema, "aboutinfo");
