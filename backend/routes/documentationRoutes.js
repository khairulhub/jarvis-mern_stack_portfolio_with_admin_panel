const express = require("express");
const router  = express.Router();
const { getAllDocs, getDoc, createDoc, updateDoc, deleteDoc } = require("../controllers/documentationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/",      getAllDocs);                           // public — list all
router.get("/:id",   getDoc);                              // public — single page

router.post("/",           protect, adminOnly, createDoc); // admin
router.put("/:id",         protect, adminOnly, updateDoc); // admin
router.delete("/:id",      protect, adminOnly, deleteDoc); // admin

module.exports = router;
