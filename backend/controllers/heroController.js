const Hero = require("../models/Hero");
const HERO_ID = "hero_main";

// GET /api/hero — public
const getHero = async (req, res) => {
  try {
    const hero = await Hero.findById(HERO_ID);
    if (!hero) return res.status(404).json({ success: false, message: "Hero data not found" });
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/hero — admin only
const updateHero = async (req, res) => {
  try {
    const allowed = ["tagline","name","subtitle","description","location","statusText","cvLink","profileImage","chips"];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    if (updates.chips !== undefined && !Array.isArray(updates.chips)) {
      updates.chips = String(updates.chips).split(",").map((s) => s.trim()).filter(Boolean);
    }
    const hero = await Hero.findByIdAndUpdate(HERO_ID, { $set: updates }, { new: true, runValidators: true });
    if (!hero) return res.status(404).json({ success: false, message: "Hero not found" });
    res.json({ success: true, message: "Hero updated successfully", data: hero });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getHero, updateHero };