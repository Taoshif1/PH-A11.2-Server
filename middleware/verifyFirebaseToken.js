const admin = require("../config/firebase");

async function verifyFirebaseToken(req, res, next) {
      console.log("Request Headers Received:", req.headers); 
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    console.log("Auth Header:", authHeader);

    req.user = decoded;
    next();
  } catch (e) {
    console.error("Error verifying Firebase token:", e);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
module.exports = verifyFirebaseToken;
