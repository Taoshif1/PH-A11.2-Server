const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyFirebaseToken");
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");


router.get("/recent", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const donationCollection = db.collection("bloodRequests");

    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const query = { requesterEmail: email };
    const result = await donationCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();

    res.send(result);
  } catch (error) {
    console.error("Error fetching recent requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET all requests for a specific user (Donor)
router.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const donationCollection = db.collection("bloodRequests");

    const email = req.user.email; 
    const query = { requesterEmail: email };

    const result = await donationCollection
      .find(query)
      .sort({ createdAt: -1 }) // Newest first
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// GET single request by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("bloodRequests").findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch request" });
  }
});

// PUT (Update) the request
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const id = req.params.id;
    const filter = { _id: new ObjectId(id), requesterEmail: req.user.email };
    const updatedRequest = { $set: { ...req.body } };
    const result = await db.collection("bloodRequests").updateOne(filter, updatedRequest);
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

// POST a new donation request
router.post("/", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const donationCollection = db.collection("bloodRequests");

    const newRequest = {
      ...req.body,
      status: "pending", // Status is always pending initially
      createdAt: new Date(),
    };

    const result = await donationCollection.insertOne(newRequest);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create request" });
  }
});

// DELETE a request
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const query = {
      _id: new ObjectId(req.params.id),
      requesterEmail: req.user.email,
    };
    const result = await db.collection("bloodRequests").deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// PATCH update request status (Done/Canceled)
router.patch("/status/:id", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const { status } = req.body; // 'done' or 'canceled'
    const query = {
      _id: new ObjectId(req.params.id),
      requesterEmail: req.user.email,
    };
    const updateDoc = { $set: { status: status } };
    const result = await db
      .collection("bloodRequests")
      .updateOne(query, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: "Status update failed" });
  }
});

module.exports = router;
