const ContactInfo = require("../models/ContactInfo");
const CONTACT_ID = "contact_main";

// GET /api/contactinfo — public
const getContactInfo = async (req, res) => {
  try {
    const info = await ContactInfo.findById(CONTACT_ID);
    if (!info) return res.status(404).json({ success: false, message: "Contact info not found" });
    res.json({ success: true, data: info });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/contactinfo — admin only
const updateContactInfo = async (req, res) => {
  try {
    const allowed = ["location","email","github","githubUrl","linkedin","linkedinUrl","website","websiteUrl","availability"];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const info = await ContactInfo.findByIdAndUpdate(
      CONTACT_ID,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!info) return res.status(404).json({ success: false, message: "Contact info not found" });
    res.json({ success: true, message: "Contact info updated successfully", data: info });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getContactInfo, updateContactInfo };
