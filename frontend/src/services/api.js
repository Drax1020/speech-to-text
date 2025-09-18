// src/services/api.js

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const FILE_BASE = import.meta.env.VITE_FILE_BASE || "http://localhost:5000/uploads";

// ✅ Get all transcriptions
export async function fetchTranscriptions() {
  console.log("📤 Fetching transcriptions from:", `${API_BASE}/transcriptions`);
  const res = await fetch(`${API_BASE}/transcriptions`);
  if (!res.ok) {
    throw new Error(`Failed to fetch transcriptions: ${res.status}`);
  }
  return res.json();
}

// ✅ Upload File
export async function uploadFile(file, filename = file.name) {
  const formData = new FormData();
  formData.append("file", file, filename);


  const res = await fetch(`${API_BASE}/transcriptions/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} - ${text}`);
  }
  return res.json();
}

// ✅ Get transcription by ID
export async function getTranscription(id) {
  const res = await fetch(`${API_BASE}/transcriptions/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch transcription ${id}`);
  }
  return res.json();
}

// ✅ Build URL for audio playback
export function getFileUrl(filename) {
  return `${FILE_BASE}/${filename}`;
}


export async function clearLatest() {
  const res = await fetch(`${API_BASE}/transcriptions/clear-latest`, {
    method: "DELETE",
  });
  return res.json();
}

export async function clearAll() {
  const res = await fetch(`${API_BASE}/transcriptions/clear-all`, {
    method: "DELETE",
  });
  return res.json();
}
