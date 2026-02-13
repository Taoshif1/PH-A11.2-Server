const express = require("express");
const router = express.Router();
const connectDB = require("../config/db"); 
const { ObjectId } = require("mongodb");

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
    console.error("Volunteer Route Error:", error);
    res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
// Update status
router.patch("/update-status/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const { status } = req.body;

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
