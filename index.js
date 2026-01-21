const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');


const app = express();
const port = process.env.PORT || 5000;
const dbUri = process.env.DB_URI;
const accessToken = process.env.ACCESS_TOKEN;

// --------------------
// Global Middleware
// --------------------
app.use(cors());
app.use(express.json());

console.log(`Server is running on port ${port}`);
console.log(`MongoDB URI Loaded: ${process.env.DB_URI ? "YES ✅" : "NO ❌"}`);
console.log(`Access Token Loaded: ${accessToken ? "YES ✅" : "NO ❌"}`);



// ------------------------------
// Health Check / Root endpoint
// ------------------------------
app.get('/', (req, res)=>{
    res.status(200).json({
        message: "🩸 LifeStream Server is running successfully!",
        status: 200
    });
})


// --------------------
// Server Bootstrap
// --------------------
async function startServer() {
    try {
        // connect DB here
        await connectDB();
        
        // Start Server
        app.listen(port, () =>{
            console.log(`🚀 MongoDB Connected & Server is officially live at http://localhost${port}`);
        });
        // Later: attach collections
        // Later: init models
        // Later: init controllers
        // Later: register routes

    } catch (e) {
        console.error('❌ Failed to start server:', e);
        process.exit(1);
    }
}

startServer();




