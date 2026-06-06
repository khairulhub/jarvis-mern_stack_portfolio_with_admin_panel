const jwt = require("jsonwebtoken");
const User = require("../models/User");
const admin = require("../config/firebase");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Register admin (email/password → MongoDB)
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password, role: "admin" });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login admin (email/password → MongoDB + JWT)
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Account deactivated" });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login/Register with Firebase (Google or Firebase Email)
// @route   POST /api/auth/firebase
// Backend verifies the Firebase ID token, then issues its own JWT
const firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken)
      return res.status(400).json({ success: false, message: "Firebase ID token required" });

    // Verify token with Firebase Admin SDK
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    if (!email)
      return res.status(400).json({ success: false, message: "Email not found in Firebase token" });

    // Find or create user in MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // Auto-create admin on first Firebase login
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: uid + process.env.JWT_SECRET, // non-guessable password for Firebase users
        avatar: picture || "",
        role: "admin",
        firebaseUid: uid,
      });
    } else {
      // Update avatar if changed
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        await user.save();
      }
    }

    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Account deactivated" });

    // Issue our own JWT so all protected routes work normally
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Firebase login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    console.error("Firebase login error:", error.message);
    if (error.code === "auth/id-token-expired")
      return res.status(401).json({ success: false, message: "Firebase token expired. Please sign in again." });
    if (error.code === "auth/argument-error")
      return res.status(401).json({ success: false, message: "Invalid Firebase token." });
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Both current and new password are required" });

    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });

    const user = await User.findById(req.user._id).select("+password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, firebaseLogin, getMe, updateProfile, changePassword };
