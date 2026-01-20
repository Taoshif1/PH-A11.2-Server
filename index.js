const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT;
const dbUri = process.env.DB_URI;
const accessToken = process.env.ACCESS_TOKEN;

// Global Middleware
app.use(cors());
app.use(express.json());

console.log(`Server is running on port ${port}`);
console.log(`MongoDB URI: ${dbUri}`);
console.log(`Access Token Loaded: ${accessToken ? "YES ✅" : "NO ❌"}`);


// --------------------
// Health Check / Root
// --------------------
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
        // Later: connect DB here
        // Later: attach collections
        // Later: init models
        // Later: init controllers
        // Later: register routes

        app.listen(port, () => {
            console.log(`🚀 Server is officially live at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();




