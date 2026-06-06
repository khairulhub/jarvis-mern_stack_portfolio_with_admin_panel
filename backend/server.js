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
app.use("/api/aboutinfo", require("./routes/aboutInfoRoutes"));//about info route
app.use("/api/works",  require("./routes/workRoutes"));
app.use("/api/codings", require("./routes/codingRoutes"));
app.use("/api/networks", require("./routes/networkRoutes"));
app.use("/api/services",  require("./routes/Serviceroutes"));
app.use("/api/photos",            require("./routes/photoRoutes"));
app.use("/api/photo-categories",  require("./routes/photoCategoryRoutes"));
app.use("/api/contactinfo", require("./routes/contactInfoRoutes"));
app.use("/api/footer-brand", require("./routes/footerBrandRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/visitors", require("./routes/visitorRoutes"));
app.use("/api/docs",    require("./routes/documentationRoutes"));

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

// ② Seed about info section  যোগ করো:
const seedAboutInfo = async () => {
  const AboutInfo = require("./models/AboutInfo");
  const exists = await AboutInfo.findById("about_main");
  if (exists) return console.log("ℹ️  AboutInfo already seeded — skip.");
  const data = require("./data/aboutinfo.seed.json");
  await AboutInfo.create(data);
  console.log("✅ AboutInfo seeded.");
};


const seedExperiences = async () => {
  const Experience = require("./models/Experience"); 
  const experienceSeedData = require("./data/experience.seed.json");
  const count = await Experience.countDocuments();
  if (count > 0) return console.log(`ℹ️  Experiences already seeded (${count}) — skip.`);
  await Experience.insertMany(experienceSeedData);
  console.log(`✅ Experiences seeded — ${experienceSeedData.length} entries inserted.`);

}

 
// ── 2. seedClients function যোগ করো (seedFooterBrand এর পরে) ──
const seedClients = async () => {
  const Client = require("./models/Client");
  const count = await Client.countDocuments();
  if (count > 0) return console.log(`ℹ️  Clients already seeded (${count}) — skip.`);
  const data = require("./data/client.seed.json");
  await Client.insertMany(data);
  console.log(`✅ Clients seeded — ${data.length} clients inserted.`);
};




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


// Codings seed function — শুধু প্রথমবার চলবে
const seedCodings = async () => {
  const Coding = require("./models/Coding");
  const count = await Coding.countDocuments();
  if (count > 0) return console.log(`ℹ️  Codings already seeded (${count}) — skip.`);

  const data = require("./data/coding.seed.json");
  await Coding.insertMany(data);
  console.log(`✅ Codings seeded — ${data.length} entries inserted.`);
};

// ─────────────────────────────────────────────────────────────
// Seed function যোগ করো (seedCodings এর পরে):
// ─────────────────────────────────────────────────────────────

const seedNetworks = async () => {
  const Network = require("./models/Network");
  const count = await Network.countDocuments();
  if (count > 0) return console.log(`ℹ️  Networks already seeded (${count}) — skip.`);
  const data = require("./data/network.seed.json");
  await Network.insertMany(data);
  console.log(`✅ Networks seeded — ${data.length} topics inserted.`);
};



// ② Seed functions section-এ (seedNetworks এর পরে) যোগ করো:
const seedPhotoCategories = async () => {
  const PhotoCategory = require("./models/PhotoCategory");
  const count = await PhotoCategory.countDocuments();
  if (count > 0) return console.log(`ℹ️  PhotoCategories already seeded (${count}) — skip.`);
  const data = require("./data/photoCategory.seed.json");
  await PhotoCategory.insertMany(data);
  console.log(`✅ PhotoCategories seeded — ${data.length} categories inserted.`);
};

const seedPhotos = async () => {
  const Photo = require("./models/Photo");
  const count = await Photo.countDocuments();
  if (count > 0) return console.log(`ℹ️  Photos already seeded (${count}) — skip.`);
  const data = require("./data/photo.seed.json");
  await Photo.insertMany(data);
  console.log(`✅ Photos seeded — ${data.length} photos inserted.`);
};

const seedContactInfo = async () => {
  const ContactInfo = require("./models/ContactInfo");
  const exists = await ContactInfo.findById("contact_main");
  if (exists) return console.log("ℹ️  ContactInfo already seeded — skip.");
  const data = require("./data/contactinfo.seed.json");
  await ContactInfo.create(data);
  console.log("✅ ContactInfo seeded.");
};


const seedFooterBrand = async () => {
  const FooterBrand = require("./models/FooterBrand");
  const exists = await FooterBrand.findById("footer_brand");
  if (exists) return console.log("ℹ️  FooterBrand already seeded — skip.");
  const data = require("./data/footerBrand.seed.json");
  await FooterBrand.create(data);
  console.log("✅ FooterBrand seeded.");
};

// seed visitors funtion -----------------
const seedVisitors = async () => {
  const Visitor = require("./models/Visitor");
  const count = await Visitor.countDocuments();
  if (count > 0) return console.log(`ℹ️  Visitors already seeded (${count}) — skip.`);
  const data = require("./data/visitor.seed.json");
  await Visitor.insertMany(data);
  console.log(`✅ Visitors seeded — ${data.length} entries inserted.`);
};

// seed documentation function -----------------
const seedDocumentation = async () => {
  const Documentation = require("./models/Documentation");
  const count = await Documentation.countDocuments();
  if (count > 0) return console.log(`ℹ️  Documentation already seeded (${count}) — skip.`);
  const data = require("./data/documentation.seed.json");
  await Documentation.insertMany(data);
  console.log(`✅ Documentation seeded — ${data.length} pages inserted.`);
};

// ── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedHero();
    await seedAboutInfo();
    await seedExperiences();
    await seedClients();
    await seedServices();
    await seedWorks();
    await seedCodings();
    await seedNetworks();
    await seedPhotoCategories();
    await seedPhotos();
    await seedContactInfo();
    await seedFooterBrand();
    await seedVisitors();
    await seedDocumentation();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });






  