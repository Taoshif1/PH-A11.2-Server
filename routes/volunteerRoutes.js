const express = require("express");
const router = express.Router();
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");
const verifyVolunteer = require("../middleware/verifyVolunteer");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// Get all requests (with filtering)
router.get("/all-requests", async (req, res) => {
  try {
    const db = await connectDB();
    const { status } = req.query;

    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const result = await db
      .collection("bloodRequests")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Fetch failed", error: error.message });
  }
});

// Update ONLY the status
router.patch("/update-status/:id", verifyFirebaseToken, verifyVolunteer, async (req, res) => {
  try {
    const db = await connectDB();
    const { status } = req.body;

    // Strict check Volunteers can ONLY update status
    const result = await db
      .collection("bloodRequests")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status: status, updatedAt: new Date() } },
      );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Update failed" });
  }
});

module.exports = router; 
