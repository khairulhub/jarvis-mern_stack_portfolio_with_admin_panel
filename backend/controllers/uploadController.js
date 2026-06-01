const path = require("path");
const fs = require("fs");
const uploadToImgBB = require("../utils/imgbb");

// POST /api/upload/image
const uploadImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No image file provided" });

    const result = await uploadToImgBB(req.file.path, req.file.originalname);

    res.json({
      success: true,
      message: "Image uploaded to imgBB",
      data: {
        url:       result.url,      // imgBB public URL — save in MongoDB
        thumb:     result.thumb,
        deleteUrl: result.deleteUrl,
      },
    });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message || "Image upload failed" });
  }
};

// POST /api/upload/pdf
const uploadPDF = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No PDF file provided" });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/uploads/pdfs/${req.file.filename}`;

    res.json({
      success: true,
      message: "PDF uploaded",
      data: {
        url:          fileUrl,
        filename:     req.file.filename,
        originalName: req.file.originalname,
        size:         req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/upload/pdf/:filename
const deletePDF = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../uploads/pdfs", req.params.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: "PDF deleted" });
    } else {
      res.status(404).json({ success: false, message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadImage, uploadPDF, deletePDF };