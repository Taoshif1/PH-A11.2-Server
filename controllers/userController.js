const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

exports.getProfile = async (req, res) => {
  try {
    const db = await connectDB();
    const email = req.user.email;

    // Check if the user is in the main users/donors collection
    let user = await db.collection("bloodapp2users").findOne({ email });

    // If not found, check the volunteer collection
    if (!user) {
      user = await db.collection("bloodapp2volunteer").findOne({ email });
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in any collection" });
    }

    res.json(user);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const db = await connectDB();
    const decoded = req.user;
    const email = decoded.email;

    // Check if user already exists in either collection
    const existingUser =
      (await db.collection("bloodapp2users").findOne({ email })) ||
      (await db.collection("bloodapp2volunteer").findOne({ email }));

    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User exists", user: existingUser });
    }

    const userData = {
      uid: decoded.uid,
      name: req.body.name,
      email: email,
      avatar: decoded.picture || null,
      bloodGroup: req.body.bloodGroup,
      district: req.body.district,
      upazila: req.body.upazila,
      role: "donor", // default for registration
      status: "active",
      createdAt: new Date(),
    };

    const result = await db.collection("bloodapp2users").insertOne(userData);
    const user = await db
      .collection("bloodapp2users")
      .findOne({ _id: result.insertedId });

    res.status(201).json({ message: "Success", user });
  } catch (err) {
    console.error("CreateUser Error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// UPDATE PROFILE
exports.updateUserProfile = async (req, res) => {
  try {
    const db = await connectDB();
    const email = req.user.email;
    const updateData = req.body;

    let collectionName = "bloodapp2users";
    let user = await db.collection("bloodapp2users").findOne({ email });

    if (!user) {
      user = await db.collection("bloodapp2volunteer").findOne({ email });
      collectionName = "bloodapp2volunteer";
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    delete updateData._id;

    const result = await db
      .collection(collectionName)
      .updateOne(
        { email: email },
        { $set: { ...updateData, updatedAt: new Date() } },
      );

    res.status(200).json({ message: "Profile updated successfully", result });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createVolunteer = async (req, res) => {
  try {
    const db = await connectDB();
    const { email } = req.body;

    const existingVolunteer = await db
      .collection("bloodapp2volunteer")
      .findOne({ email });
    if (existingVolunteer) {
      return res
        .status(400)
        .send({ message: "You are already registered as a volunteer!" });
    }

    const volunteerData = {
      ...req.body,
      createdAt: new Date(),
    };

    const result = await db
      .collection("bloodapp2volunteer")
      .insertOne(volunteerData);

    res.status(201).json(result);
  } catch (err) {
    console.error("Volunteer Creation Error:", err);
    res
      .status(500)
      .json({ error: "Server error during volunteer registration" });
  }
};

exports.registerVolunteer = async (req, res) => {
  try {
    const db = await connectDB();
    const volunteerData = req.body;

    const query = { email: volunteerData.email };
    const existingVolunteer = await db.collection("bloodapp2volunteer").findOne(query);

    if (existingVolunteer) {
      return res.status(400).send({ 
        message: "This email is already registered as a volunteer!" 
      });
    }

    const result = await db.collection("bloodapp2volunteer").insertOne(volunteerData);

    res.status(201).send(result);
  } catch (error) {
    console.error("Error saving volunteer:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
