const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static (for PDFs)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth",   require("./routes/authRoutes"));
app.use("/api/blogs",  require("./routes/blogRoutes"));
app.use("/api/team",   require("./routes/teamRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes")); // NEW
app.use("/api/hero", require("./routes/heroRoutes"));  // NEW

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "MERN Starter API is running" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;



// Hero seed function — শুধু প্রথমবার চলবে
const seedHero = async () => {
  const Hero = require("./models/Hero");
  const existing = await Hero.findById("hero_main");
  if (existing) {
    console.log("ℹ️  Hero already in DB — skipping seed.");
    return;
  }
  await Hero.create({
    _id: "hero_main",
    tagline:     "FULL STACK DEVELOPER & NETWORK ENGINEER",
    name:        "KHAIRUL",
    subtitle:    "// SYSTEM ONLINE",
    description: "Passionate developer and network engineer from Bangladesh. Building scalable web applications and designing robust network infrastructures. Specialized in MERN Stack, PHP/Laravel, .NET, and Cisco networking.",
    location:    "DHAKA, BANGLADESH",
    statusText:  "AVAILABLE FOR HIRE",
    cvLink:      "https://drive.google.com/file/d/1y-GYsyhzvh29zxoSy5vYb9pvL5ugRiYO/view?usp=sharing",
    profileImage: "",
    chips: ["MERN STACK", "PHP / LARAVEL", ".NET", "CISCO", "CCNA", "Mikrotik"],
  });
  console.log("✅ Hero document seeded into MongoDB.");
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedHero();  // ← এটা যোগ হলো
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })










// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });
  