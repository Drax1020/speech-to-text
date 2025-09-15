// controllers/transcriptionController.js
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { createClient } = require("@deepgram/sdk");
const Transcription = require("../models/Transcription");

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// ------------------ Upload & Transcribe ------------------
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
    const mimeType = req.file.mimetype;
    console.log("📂 Uploaded file:", req.file);

    let text = "";
    let provider = "local-parser";
    let audioUrl = null;

    // AUDIO/VIDEO (Deepgram)
    if (mimeType.startsWith("audio/") || mimeType.startsWith("video/")) {
      try {
        const buffer = fs.readFileSync(filePath);

        const dgResponse = await deepgram.listen.prerecorded.transcribeFile(buffer, {
          model: "nova-2",
          mimetype: mimeType,
        });

        console.log("🎤 Deepgram response:", JSON.stringify(dgResponse, null, 2));

        text = dgResponse?.result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
        provider = "deepgram";
        // audioUrl = `/uploads/${req.file.filename}`;
        audioUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      } catch (err) {
        console.error("❌ Deepgram error:", err);
        return res.status(500).json({ error: "Deepgram transcription failed" });
      }
    }

    // PDF
    else if (mimeType === "application/pdf") {
      try {
        const buffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(buffer);
        text = pdfData.text.trim() || "[No text extracted from PDF]";
      } catch (err) {
        console.error("❌ PDF parse error:", err);
        return res.status(500).json({ error: "Failed to parse PDF" });
      } finally {
        fs.unlinkSync(filePath); // cleanup
      }
    }

    // TXT
    else if (mimeType === "text/plain") {
      try {
        text = fs.readFileSync(filePath, "utf-8").trim() || "[Empty text file]";
      } catch (err) {
        console.error("❌ TXT read error:", err);
        return res.status(500).json({ error: "Failed to read TXT file" });
      } finally {
        fs.unlinkSync(filePath); // cleanup
      }
    }

    else {
      fs.unlinkSync(filePath); // cleanup unknown files
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Save to DB
    const newTranscription = new Transcription({
      text,
      provider,
      audioUrl,
    });
    await newTranscription.save();

    console.log("✅ Saved transcription:", newTranscription);

    return res.json({
      id: newTranscription._id,
      text: newTranscription.text,
      provider: newTranscription.provider,
      audioUrl: newTranscription.audioUrl,
    });

  } catch (err) {
    console.error("❌ Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
};

// ------------------ Get All ------------------
exports.listTranscriptions = async (req, res) => {
  try {
    const items = await Transcription.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch transcriptions" });
  }
};

// ------------------ Get One ------------------
exports.getTranscription = async (req, res) => {
  try {
    const item = await Transcription.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch transcription" });
  }
};

// ------------------ Clear Latest ------------------
exports.clearLatest = async (req, res) => {
  try {
    const latest = await Transcription.findOne().sort({ createdAt: -1 });
    if (!latest) return res.json({ message: "No transcription to delete" });

    await Transcription.findByIdAndDelete(latest._id);
    return res.json({ message: "Latest transcription deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete latest transcription" });
  }
};

// ------------------ Clear All ------------------
exports.clearAll = async (req, res) => {
  try {
    await Transcription.deleteMany({});
    return res.json({ message: "All transcriptions deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete all transcriptions" });
  }
};
