const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyFirebaseToken");
const userController = require("../controllers/userController");

// Create profile
router.post("/register", verifyToken, userController.createUser);

// Get profile
router.get("/me", verifyToken, userController.getProfile);

module.exports = router;
