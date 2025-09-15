const mongoose = require("mongoose");

const TranscriptionSchema = new mongoose.Schema({
  text: { type: String, default: null },       // transcription text (if audio)
  filename: String,                            // stored filename
  originalName: String,                        // original name from client
  mimetype: String,                            // file type (pdf, video, etc.)
  provider: String,
  audioUrl: String,                            // "openai" or "file"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transcription", TranscriptionSchema);

