const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const dotenv   = require("dotenv");
const path     = require("path");

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ──────────────────────────────────────────────────────
app.use("/api/auth",   require("./routes/authRoutes"));
app.use("/api/blogs",  require("./routes/blogRoutes"));
app.use("/api/experiences", require("./routes/experienceRoutes"));
app.use("/api/team",   require("./routes/teamRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/hero",   require("./routes/heroRoutes"));
app.use("/api/works",  require("./routes/workRoutes"));
app.use("/api/services",  require("./routes/Serviceroutes"));

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

// ── Seed functions ───────────────────────────────────────────────
const seedHero = async () => {
  const Hero = require("./models/Hero");
  const exists = await Hero.findById("hero_main");
  if (exists) return console.log("ℹ️  Hero already seeded — skip.");

  const data = require("./data/hero.seed.json");
  await Hero.create(data);
  console.log("✅ Hero seeded.");
};

const seedExperiences = async () => {
  const Experience = require("./models/Experience"); 
  const experienceSeedData = require("./data/experience.seed.json");
  const count = await Experience.countDocuments();
  if (count > 0) return console.log(`ℹ️  Experiences already seeded (${count}) — skip.`);
  await Experience.insertMany(experienceSeedData);
  console.log(`✅ Experiences seeded — ${experienceSeedData.length} entries inserted.`);

}

const seedServices = async () => {
  const Service = require("./models/Service");
  const count = await Service.countDocuments();
  if (count > 0) return console.log(`ℹ️  Services already seeded (${count}) — skip.`);
  const data = require("./data/service.seed.json");
  await Service.insertMany(data);
  console.log(`✅ Services seeded — ${data.length} services inserted.`);
};
  



// Works seed function — শুধু প্রথমবার চলবে
const seedWorks = async () => {
  const Work = require("./models/Work");
  const count = await Work.countDocuments();
  if (count > 0) return console.log(`ℹ️  Works already seeded (${count}) — skip.`);

  const data = require("./data/works.seed.json");
  await Work.insertMany(data);
  console.log(`✅ Works seeded — ${data.length} projects inserted.`);
};







// ── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedHero();
    await seedExperiences();
    await seedServices();
    await seedWorks();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });






  