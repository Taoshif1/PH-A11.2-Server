const { MongoClient, ServerApiVersion } = require("mongodb");

let client;
let db;

async function connectDB() {
  if (db) return db;

  client = new MongoClient(process.env.DB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    db = client.db();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connected from config DB");
    return db;

    // collections: {
        // users: db.collection("users"),
        // parcels: db.collection("parcels"),
        // payments: db.collection("payments"),
        // riders: db.collection("riders"),
        // trackings: db.collection("trackings"),
      // }
  } 
  catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

module.exports = connectDB;
