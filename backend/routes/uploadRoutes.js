const express = require("express");
const router = express.Router();
const { uploadImage, uploadPDF, deletePDF } = require("../controllers/uploadController");
const { uploadImage: multerImage, uploadPDF: multerPDF } = require("../config/multer");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/image",          protect, adminOnly, multerImage.single("image"), uploadImage);
router.post("/pdf",            protect, adminOnly, multerPDF.single("pdf"),     uploadPDF);
router.delete("/pdf/:filename", protect, adminOnly, deletePDF);

module.exports = router;