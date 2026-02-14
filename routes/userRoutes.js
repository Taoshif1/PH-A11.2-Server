const express = require("express");
const router = express.Router();
const connectDB = require("../config/db");

const verifyToken = require("../middleware/verifyFirebaseToken");
const userController = require("../controllers/userController");

// Create profile
router.post("/register", verifyToken, userController.createUser);

// Get profile
router.get("/me", verifyToken, userController.getProfile);

// Update Profile
router.patch("/update-profile", verifyToken, userController.updateUserProfile);

// Register as Volunteer
router.post("/register-volunteer", userController.registerVolunteer);

// Public Search for Donors
router.get("/donors/search", async (req, res) => {
  try {
    const db = await connectDB();
    const { bloodGroup, district, upazila } = req.query;

    let query = { status: "pending" };

    if (bloodGroup && bloodGroup !== "") query.bloodGroup = bloodGroup;
    if (district && district !== "") query.recipientDistrict = district;
    if (upazila && upazila !== "") query.recipientUpazila = upazila;
    
    const result = await db.collection("bloodRequests").find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).send({ message: "Search failed" });
  }
});

module.exports = router;
