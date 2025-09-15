import React, { useEffect, useState } from "react";
import Recorder from "../components/Recorder";
import FileUploader from "../components/FileUploader";
import TranscriptionList from "../components/TranscriptionList";
import {
  fetchTranscriptions,
  uploadFile,
  clearAll,
  clearLatest,
} from "../services/api";

export default function Home() {
  const [latest, setLatest] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);
  const [isTranscribing, setIsTranscribing] = useState(false); // ⏳ new state

  useEffect(() => {
    loadTranscriptions();
  }, []);

  async function loadTranscriptions() {
    try {
      const data = await fetchTranscriptions();
      setTranscriptions(data);
      setLatest(data.length > 0 ? data[0] : null);
    } catch (err) {
      console.error("Failed to fetch transcriptions", err);
    }
  }

  async function handleUpload(file) {
    try {
      setIsTranscribing(true); // show loader
      const uploaded = await uploadFile(file);
      console.log("📥 Upload response from backend:", uploaded);
      setLatest(uploaded);
      setTranscriptions((prev) => [uploaded, ...prev]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsTranscribing(false); // hide loader
    }
  }

  async function handleClearLatest() {
    await clearLatest();
    await loadTranscriptions();
  }

  async function handleClearAll() {
    await clearAll();
    setLatest(null);
    setTranscriptions([]);
  }

    const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    window.location.reload();         // force re-render -> App.jsx shows AuthForm
  };

  return (


     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Top bar with logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Speech-to-Text Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
        >
          Logout
        </button>
      </div>

      {/* --- rest of your Home.jsx content here --- */}

<div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-900 bg-opacity-60 rounded-xl shadow-lg border border-purple-500/30 p-6">
        <h1 className="text-2xl font-bold text-purple-400 mb-4 text-center">
          Speech-to-Text Dashboard
        </h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Recorder onUpload={handleUpload} disabled={isTranscribing} />
          <FileUploader onUpload={handleUpload} disabled={isTranscribing} />

          <button
            onClick={handleClearLatest}
            disabled={!latest || isTranscribing}
            className={`px-4 py-2 rounded-md ${
              latest && !isTranscribing
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            Clear Latest
          </button>

          <button
            onClick={handleClearAll}
            disabled={transcriptions.length === 0 || isTranscribing}
            className={`px-4 py-2 rounded-md ${
              transcriptions.length > 0 && !isTranscribing
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            Clear All
          </button>
        </div>

        {/* Loader */}
        {isTranscribing && (
          <div className="flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-purple-400 border-opacity-75 mr-2"></div>
            <span className="text-purple-300">Transcribing...</span>
          </div>
        )}

        {/* Latest */}
        {latest && (
          <div className="mb-6 p-4 rounded-lg border border-purple-500/40 bg-gray-800 bg-opacity-70">
            <h2 className="text-lg font-semibold text-purple-300 mb-2">
              Latest Transcription
            </h2>
            <p className="text-gray-200 max-h-40 overflow-y-auto whitespace-pre-wrap">
              {latest.text}
            </p>
            {latest.filePath && (
              <audio
                controls
                src={`http://localhost:5000/${latest.filePath}`}
                className="w-full mt-2"
              />
            )}
          </div>
        )}

        {/* Recent */}
        <div>
          <h2 className="text-lg font-semibold text-purple-300 mb-3">
            Recent Transcriptions
          </h2>
          <TranscriptionList transcriptions={transcriptions.slice(1)} />
        </div>
      </div>
    </div>

    </div>
    
    
  );
}
