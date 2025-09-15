// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const controller = require("../controllers/transcriptionController");

// const router = express.Router();

// // Upload directory (same as in server.js)
// const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");

// // Ensure upload directory exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + "-" + file.originalname);
//   },
// });

// // ✅ Allow ALL file types (audio, video, pdf, txt, etc.)
// const upload = multer({ storage });

// // Upload (handles audio/video → Deepgram, pdf/txt → extract, others → store metadata)
// router.post("/upload", upload.single("file"), controller.uploadFile);

// // Get all records
// router.get("/", controller.listTranscriptions);

// // Get single record
// router.get("/:id", controller.getTranscription);

// // 🔹 new routes
// router.delete("/clear-latest", controller.clearLatest);
// router.delete("/clear-all", controller.clearAll);

// console.log("Controller keys:", Object.keys(controller));



// module.exports = router;

// routes/transcriptions.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  uploadFile,
  listTranscriptions,
  getTranscription,
  clearLatest,
  clearAll,
} = require("../controllers/transcriptionController");

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
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
