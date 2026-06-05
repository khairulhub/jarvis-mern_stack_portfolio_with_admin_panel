const FooterBrand = require("../models/FooterBrand");
const BRAND_ID = "footer_brand";

// GET /api/footer-brand — public
const getFooterBrand = async (req, res) => {
  try {
    const brand = await FooterBrand.findById(BRAND_ID);
    if (!brand) return res.status(404).json({ success: false, message: "Footer brand not found" });
    res.json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/footer-brand — admin only
const updateFooterBrand = async (req, res) => {
  try {
    const allowed = ["logoText", "brandName", "taglineText", "copyrightText", "imageUrl", "showImage", "imageOnly"];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const brand = await FooterBrand.findByIdAndUpdate(
      BRAND_ID,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!brand) return res.status(404).json({ success: false, message: "Footer brand not found" });
    res.json({ success: true, message: "Footer brand updated successfully", data: brand });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getFooterBrand, updateFooterBrand };
