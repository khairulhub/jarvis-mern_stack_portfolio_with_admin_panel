/**
 * Seed Script — creates an admin user + sample blog + sample team member
 * Run once:  node seed.js
 */
const mongoose = require("mongoose");
const dotenv   = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Blog = require("./models/Blog");
const Team = require("./models/Team");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // ── Admin user ────────────────────────────────────────
    const existing = await User.findOne({ email: "admin@example.com" });
    let admin;
    if (existing) {
      console.log("ℹ️  Admin already exists — skipping user creation");
      admin = existing;
    } else {
      admin = await User.create({
        name:     "Admin",
        email:    "admin@example.com",
        password: "admin123",
        role:     "admin",
      });
      console.log("✅ Admin created  →  admin@example.com / admin123");
    }

    // ── Sample blog ───────────────────────────────────────
    const blogExists = await Blog.findOne({ title: "Welcome to MERN Starter" });
    if (!blogExists) {
      await Blog.create({
        title:      "Welcome to MERN Starter",
        excerpt:    "This is a sample blog post created by the seed script to help you get started quickly.",
        content:    `# Welcome to MERN Starter\n\nThis template gives you everything you need to build a full-stack application.\n\n## Features\n\n- JWT Authentication\n- Firebase Google OAuth\n- Blog CRUD\n- Team Management\n- Admin Dashboard\n\nStart editing from the admin panel!`,
        category:   "Technology",
        tags:       ["mern", "react", "nodejs", "mongodb"],
        status:     "published",
        author:     admin._id,
        coverImage: "",
      });
      console.log("✅ Sample blog created");
    } else {
      console.log("ℹ️  Sample blog already exists — skipping");
    }

    // ── Sample team member ────────────────────────────────
    const teamExists = await Team.findOne({ name: "John Doe" });
    if (!teamExists) {
      await Team.create({
        name:       "John Doe",
        role:       "Full Stack Developer",
        department: "Engineering",
        bio:        "Passionate developer building great products with the MERN stack.",
        email:      "john@example.com",
        social:     { linkedin: "https://linkedin.com", github: "https://github.com", twitter: "" },
        isActive:   true,
        order:      1,
      });
      console.log("✅ Sample team member created");
    } else {
      console.log("ℹ️  Sample team member already exists — skipping");
    }

    console.log("\n🎉 Seed complete!");
    console.log("   Login at http://localhost:3000/admin/login");
    console.log("   Email:    admin@example.com");
    console.log("   Password: admin123\n");
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
