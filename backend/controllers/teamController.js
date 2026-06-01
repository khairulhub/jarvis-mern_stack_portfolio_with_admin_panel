const Team = require("../models/Team");

// @desc    Get all active team members (public)
// @route   GET /api/team
const getTeam = async (req, res) => {
  try {
    const members = await Team.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all team members (admin)
// @route   GET /api/team/admin/all
const getAdminTeam = async (req, res) => {
  try {
    const members = await Team.find().sort({ order: 1 });
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single member
// @route   GET /api/team/:id
const getTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create team member
// @route   POST /api/team
const createTeamMember = async (req, res) => {
  try {
    const member = await Team.create(req.body);
    res.status(201).json({ success: true, message: "Team member created", data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
const updateTeamMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });
    res.json({ success: true, message: "Team member updated", data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
const deleteTeamMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });
    res.json({ success: true, message: "Team member deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle active status
// @route   PATCH /api/team/:id/toggle
const toggleTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });
    member.isActive = !member.isActive;
    await member.save();
    res.json({ success: true, message: `Member ${member.isActive ? "activated" : "deactivated"}`, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTeam, getAdminTeam, getTeamMember, createTeamMember, updateTeamMember, deleteTeamMember, toggleTeamMember };
