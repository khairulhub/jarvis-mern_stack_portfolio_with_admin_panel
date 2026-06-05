const AboutInfo = require("../models/AboutInfo");
const ABOUT_ID = "about_main";

// ─────────────────────────────────────────────────────────────
// GET /api/aboutinfo  — public
// ─────────────────────────────────────────────────────────────
const getAboutInfo = async (req, res) => {
  try {
    const info = await AboutInfo.findById(ABOUT_ID);
    if (!info)
      return res.status(404).json({ success: false, message: "About info not found" });
    res.json({ success: true, data: info });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/aboutinfo  — admin only
// Accepts: paragraph1/2/3, infoCards[], stats[]
// ─────────────────────────────────────────────────────────────
const updateAboutInfo = async (req, res) => {
  try {
    const allowed = ["paragraph1", "paragraph2", "paragraph3", "infoCards", "stats"];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const info = await AboutInfo.findByIdAndUpdate(
      ABOUT_ID,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!info)
      return res.status(404).json({ success: false, message: "About info not found" });

    res.json({ success: true, message: "About info updated successfully", data: info });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getAboutInfo, updateAboutInfo };
