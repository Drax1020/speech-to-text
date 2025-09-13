const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const controller = require("../controllers/transcriptionController");

const router = express.Router();

// Upload directory (same as in server.js)
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});

// ✅ Allow ALL file types (audio, video, pdf, txt, etc.)
const upload = multer({ storage });

// Upload (handles audio/video → Deepgram, pdf/txt → extract, others → store metadata)
router.post("/upload", upload.single("file"), controller.uploadFile);

// Get all records
router.get("/", controller.listTranscriptions);

// Get single record
router.get("/:id", controller.getTranscription);

router.delete("/clear", controller.clearAllTranscriptions);


module.exports = router;
