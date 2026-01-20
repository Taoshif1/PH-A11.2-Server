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