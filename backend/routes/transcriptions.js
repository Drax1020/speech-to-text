const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  uploadFile,
  listTranscriptions,
  getTranscription,
  clearLatest,
  clearAll,
} = require("../controllers/transcriptionController");

const router = express.Router();

// ✅ Ensure uploads folder exists (safety check here too)
const uploadsPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("file"), uploadFile);
router.get("/", listTranscriptions);
router.get("/:id", getTranscription);
router.delete("/clear-latest", clearLatest);
router.delete("/clear-all", clearAll);

module.exports = router;
