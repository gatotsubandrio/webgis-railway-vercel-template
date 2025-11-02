const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
  res.send("🌍 Backend Node.js WebGIS is running!");
});

// Example API endpoint
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Node.js backend!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
