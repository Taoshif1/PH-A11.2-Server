const UserModel = require("../models/UserModel");
const connectDB = require("../config/db");
const jwt = require("jsonwebtoken");

let userModel;

// Connect to DB and initialize model
(async () => {
  const db = await connectDB();
  userModel = new UserModel(db.collection("bloodapp2users"));
})();

exports.createUser = async (req, res) => {
  try {
    const decoded = req.user; 
    const userData = {
      uid: decoded.uid,
      name: req.body.name,
      email: decoded.email,
      avatar: decoded.picture || null,
      bloodGroup: req.body.bloodGroup,
      district: req.body.district,
      upazila: req.body.upazila,
    };

    let user = await userModel.findByEmail(userData.email);

    if (!user) {
        const result = await userModel.create(userData);
        user = await userModel.findById(result.insertedId);
    }

    const token = jwt.sign(
      { email: user.email, role: user.role }, 
      process.env.ACCESS_TOKEN, 
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Success",
      token, 
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// MAKE SURE THIS IS EXPORTED CORRECTLY
exports.getProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await userModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
