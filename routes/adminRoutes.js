// routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyFirebaseToken");
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

// GET Users with Pagination & Search
router.get("/users", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await db.collection("bloodapp2users").countDocuments();
    const result = await db.collection("bloodapp2users")
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({ result, totalUsers, totalPages: Math.ceil(totalUsers / limit) });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch users" });
  }
});

// Optimized Admin Stats
router.get("/admin-stats", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();

    // Parallel execution for speed
    const [users, bloodRequests, donors, payments] = await Promise.all([
      db.collection("bloodapp2users").estimatedDocumentCount(),
      db.collection("bloodRequests").estimatedDocumentCount(),
      db.collection("bloodapp2users").countDocuments({ role: "donor" }),
      db.collection("funds").aggregate([
        { $group: { _id: null, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
      ]).toArray()
    ]);

    res.send({
      users,
      bloodRequests,
      totalDonors: donors,
      totalAmount: payments[0]?.totalAmount || 0,
      totalDonations: payments[0]?.count || 0
    });
  } catch (error) {
    console.log("Error-> ", error);
    res.status(500).send({ message: "Stats failure" });
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
