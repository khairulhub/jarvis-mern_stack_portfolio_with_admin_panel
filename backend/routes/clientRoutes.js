const express = require("express");
const router  = express.Router();
const {
  getClients, getAdminClients, getClient,
  createClient, updateClient, deleteClient, toggleClient,
} = require("../controllers/clientController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public
router.get("/",           getClients);

// Admin
router.get("/admin/all",       protect, adminOnly, getAdminClients);
router.post("/",               protect, adminOnly, createClient);
router.put("/:id",             protect, adminOnly, updateClient);
router.delete("/:id",          protect, adminOnly, deleteClient);
router.patch("/:id/toggle",    protect, adminOnly, toggleClient);

router.get("/:id",        getClient);

module.exports = router;