const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyFirebaseToken");
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

// GET all users
router.get("/users", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("bloodapp2users").find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch users" });
  }
});

// Dashboard Stats
router.get("/admin-stats", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const usersCount = await db
      .collection("bloodapp2users")
      .estimatedDocumentCount();
    const bloodRequestsCount = await db
      .collection("bloodRequests")
      .estimatedDocumentCount();

    // If you want to be specific about donors:
    const donorsCount = await db
      .collection("bloodapp2users")
      .countDocuments({ role: "donor" });

    res.send({
      users: usersCount,
      bloodRequests: bloodRequestsCount,
      totalDonors: donorsCount,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch stats" });
  }
});

// GET all donation requests with filtering and sorting
router.get("/all-requests", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const filterStatus = req.query.status;
    const sortOrder = req.query.sort === "asc" ? 1 : -1; // 1 for old-to-new, -1 for new-to-old

    let query = {};
    if (filterStatus && filterStatus !== "all") {
      query.status = filterStatus;
    }

    const result = await db
      .collection("bloodRequests")
      .find(query)
      .sort({ createdAt: sortOrder })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch requests" });
  }
});

// PATCH update user status/role
router.patch("/users/:id", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const id = req.params.id;
    const { role, status } = req.body;

    const updateDoc = { $set: {} };
    if (role) updateDoc.$set.role = role;
    if (status) updateDoc.$set.status = status;

    const result = await db
      .collection("bloodapp2users")
      .updateOne({ _id: new ObjectId(id) }, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Update failed" });
  }
});

module.exports = router;
