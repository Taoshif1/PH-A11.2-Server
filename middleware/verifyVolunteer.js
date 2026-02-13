const connectDB  = require("../config/db");

const verifyVolunteer = async (req, res, next) => {
  try {
    const email = req.user?.email; 
    const db = await connectDB();
    
    const user = await db.collection("bloodapp2volunteer").findOne({ email: email });

    if (!email) return res.status(401).send({ message: "Unauthorized" });

    if (!user || user.role !== "volunteer") {
      return res.status(403).send({ message: "Forbidden: Access restricted to Volunteers only." });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: "Authorization Error" });
  }
};

module.exports = verifyVolunteer;