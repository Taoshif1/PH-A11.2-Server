const connectDB = require("../config/db");

const verifyAdmin = async (req, res, next) => {
    const email = req.user?.email;
    const db = await connectDB();
    
    const user = await db.collection("bloodapp2users").findOne({ email });

    if (!user || user.role !== "admin") {
        return res.status(403).send({ message: "Forbidden: Admins only" });
    }
    next();
};

module.exports = verifyAdmin;