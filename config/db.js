const { MongoClient, ServerApiVersion } = require("mongodb");

let client;
let db;

async function connectDB() {
  if (db) return db;

  // 1. Initialize client with Stable API options
  client = new MongoClient(process.env.DB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // 2. Establish connection
    await client.connect();

    // 3. Optional: Verify connection with a ping
    await client.db("admin").command({ ping: 1 });
    
    db = client.db(); // default DB from URI
    console.log("✅ MongoDB connected (Native Driver with Stable API)");
    
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

module.exports = connectDB;
