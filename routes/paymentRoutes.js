// routes/paymentRoutes.js

require("dotenv").config();
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyFirebaseToken");
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Get all funds (Private - Added verifyToken)
router.get("/funds", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const total = await db.collection("funds").countDocuments();
    const result = await db
      .collection("funds")
      .find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.status(200).send({ result, total });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch funds", error: error.message });
  }
});

// Save a successful payment to the database
router.post("/funds", verifyToken, async (req, res) => {
  try {
    const { userName, userEmail, amount, transactionId, date } = req.body;
    const db = await connectDB();

    const payment = {
      userName,
      userEmail,
      amount: parseFloat(amount),
      transactionId,
      date: new Date(date),
    };

    const result = await db.collection("funds").insertOne(payment);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to save payment", error });
  }
});

// Create Payment Intent (Stripe)
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { price } = req.body;

    // Math.round to avoid floating point math issues (e.g. 19.99 * 100)
    const amount = Math.round(parseFloat(price) * 100);

    if (!amount || amount < 1) {
      return res.status(400).send({ message: "Invalid price" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ message: "Stripe error", error: error.message });
  }
});

module.exports = router;
