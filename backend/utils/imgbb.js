const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const uploadToImgBB = async (filePath, name = "") => {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) throw new Error("IMGBB_API_KEY is not set in backend .env");

  const form = new FormData();
  form.append("image", fs.createReadStream(filePath));
  if (name) form.append("name", name);

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    form,
    { headers: form.getHeaders() }
  );

  // Delete local temp file after imgBB upload
  fs.unlink(filePath, (err) => {
    if (err) console.warn("Could not delete temp file:", filePath);
  });

  const { data } = response.data;
  return {
    url:       data.url,        // ← this URL gets saved in MongoDB
    deleteUrl: data.delete_url,
    thumb:     data.thumb?.url || data.url,
  };
};

module.exports = uploadToImgBB;