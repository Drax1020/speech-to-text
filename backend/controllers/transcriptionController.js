const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { createClient } = require("@deepgram/sdk");
const Transcription = require("../models/Transcription");

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// Upload + Handle Any File
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file);

    const ext = path.extname(req.file.originalname).toLowerCase();
    let transcriptionText = "";

    // 🎤 AUDIO/VIDEO → Deepgram
    if ([".mp3", ".wav", ".ogg", ".mp4", ".m4a", ".webm"].includes(ext)) {
      try {
        const response = await deepgram.listen.prerecorded.transcribeFile(
          fs.createReadStream(req.file.path),
          { model: "nova-3" }
        );

        transcriptionText =
          response.result?.results?.channels?.[0]?.alternatives?.[0]?.transcript ||
          "[No transcription found]";
      } catch (err) {
        console.error("Deepgram transcription error:", err);
        return res.status(500).json({ error: "Deepgram transcription failed", details: err.message });
      }
    }

    // 📝 TXT
    else if (ext === ".txt") {
      try {
        transcriptionText = fs.readFileSync(req.file.path, "utf8");
      } catch (err) {
        console.error("TXT parse error:", err);
        return res.status(500).json({ error: "TXT parsing failed", details: err.message });
      }
    }

    // 📄 PDF
    else if (ext === ".pdf") {
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        transcriptionText = pdfData.text || "[No text found in PDF]";
      } catch (err) {
        console.error("PDF parse error:", err);
        return res.status(500).json({ error: "PDF parsing failed", details: err.message });
      }
    }

    // ❓ Other File Types
    else {
      transcriptionText = "[File uploaded but not transcribed]";
    }

    // Save in DB
    const newDoc = new Transcription({
      text: transcriptionText,
      filename: req.file.filename,
      provider: ext === ".pdf" || ext === ".txt" ? "local-parser" : "deepgram",
      createdAt: new Date(),
    });

    await newDoc.save();

    res.json({
      message: "File uploaded & processed",
      transcription: newDoc,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
};

// List all files/transcriptions
exports.listTranscriptions = async (req, res) => {
  try {
    const docs = await Transcription.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({ error: "Failed to fetch transcriptions" });
  }
};

// Get single file/transcription
exports.getTranscription = async (req, res) => {
  try {
    const doc = await Transcription.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: "File/Transcription not found" });
    }
    res.json(doc);
  } catch (err) {
    console.error("Get error:", err);
    res.status(500).json({ error: "Failed to fetch transcription" });
  }
};

exports.clearAllTranscriptions = async (req, res) => {
  try {
    await Transcription.deleteMany({});
    res.json({ message: "All transcriptions cleared" });
  } catch (err) {
    console.error("Clear error:", err);
    res.status(500).json({ error: "Failed to clear transcriptions" });
  }
};

