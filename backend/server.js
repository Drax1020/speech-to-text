require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const transcriptionsRoute = require("./routes/transcriptions.js");
const passport = require("passport");
require("./config/passport");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("📂 Created uploads folder:", uploadsDir);
}

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/transcriptions", transcriptionsRoute);

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "✅ Speech-to-Text API is running" });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/speechtotext";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
