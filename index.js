const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ObjectId } = require('mongodb');

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const verifyAdmin = require("./middleware/verifyAdmin");
const verifyFirebaseToken = require("./middleware/verifyFirebaseToken");
const verifyVolunteer = require("./middleware/verifyVolunteer");

const app = express();
const port = process.env.PORT || 5000;
const dbUri = process.env.DB_URI;
const accessToken = process.env.ACCESS_TOKEN;

// --------------------
// Global Middleware
// --------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bloodapp2client.vercel.app", //  Vercel frontend
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/donation-requests", donationRoutes);
app.use("/api/admin", verifyFirebaseToken, verifyAdmin, adminRoutes);
app.use(
  "/api/volunteer",
  verifyFirebaseToken,
  verifyVolunteer,
  volunteerRoutes,
);

console.log(`Server is running on port ${port}`);
console.log(`MongoDB URI Loaded: ${process.env.DB_URI ? "YES ✅" : "NO ❌"}`);
console.log(`Access Token Loaded: ${accessToken ? "YES ✅" : "NO ❌"}`);

// ------------------------------
// Health Check / Root endpoint
// ------------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🩸 LifeStream Server is running successfully!",
    status: 200,
  });
});

// Get single blood request by ID for VIEWING DETAILS (No auth required)
app.get("/api/requests/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = await connectDB();
    
    // Check if ID is valid to prevent server crash
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid ID format" });
    }

    const query = { _id: new ObjectId(id) };
    const result = await db.collection("bloodRequests").findOne(query);
    
    if (!result) {
      return res.status(404).send({ message: "Request not found" });
    }
    
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// --------------------
// Server
// --------------------
async function startServer() {
  try {
    // connect DB here
    await connectDB();

    // Start Server
    app.listen(port, () => {
      console.log(
        `🚀 MongoDB Connected & Server is officially live at http://localhost:${port}`,
      );
    });
  } catch (e) {
    console.error("❌ Failed to start server:", e);
    process.exit(1);
  }
}

startServer();
