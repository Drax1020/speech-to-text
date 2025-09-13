import React, { useState, useEffect, useRef } from "react";
import Recorder from "../components/Recorder";
import FileUploader from "../components/FileUploader";
import TranscriptionBox from "../components/TranscriptionBox";
import TranscriptionList from "../components/TranscriptionList";
import AudioPlayer from "../components/AudioPlayer";
import { fetchTranscriptions, uploadFile, getFileUrl, clearTranscriptions } from "../services/api";

function Home() {
  const [transcription, setTranscription] = useState(null);
  // const [latestTranscription, setLatestTranscription] = useState(null);
  const [list, setList] = useState([]);
  const audioRef = useRef();

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    try {
      const data = await fetchTranscriptions();
      setList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (blobOrFile, filename) => {
    setTranscription({ loading: true });
    try {
      const data = await uploadFile(blobOrFile, filename);
      if (data?.transcription) {
        setTranscription(data.transcription);
        loadList();
      } else {
        setTranscription({ error: data?.error || "Unknown error" });
      }
    } catch (err) {
      setTranscription({ error: err.message });
    }
  };

  const playAudio = (filename) => {
    const url = getFileUrl(filename);
    audioRef.current.src = url;
    audioRef.current.play();
  };

  const handleLatestTranscription = async () => {
    await clearTranscriptions();
    setTranscription([]);         // clears the latest trasncription
  };

  const handleRecentTrasncription = async () => {
    await clearTranscriptions();
    setList([]); // clears recent transcriptions
  }


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
        🎙️ Speech <span className="text-blue-600">→</span> Text
      </h1>

      {/* Controls */}
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl mb-8">
        
        <div className="flex flex-wrap gap-4">
          <Recorder onUpload={handleUpload} />
          <FileUploader onUpload={handleUpload} />
          <button
            onClick={handleLatestTranscription}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow"
          >
            ❌ Clear
          </button>


        </div>
      </div>

      {/* Latest Transcription */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">✨ Latest Transcription</h2>
        <TranscriptionBox transcription={transcription || list[0]} />
      </div>

      {/* Recent Transcriptions */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl">
        <div className="flex gap-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">📜 Recent Transcriptions</h2>
          <button
            onClick={handleRecentTrasncription}
            className="px-2 py-1  bg-red-500 text-white rounded-lg hover:bg-gray-600 transition shadow"
          >
            Remove
          </button>
        </div>
        <TranscriptionList list={list.slice(1)} playAudio={playAudio} />
      </div>

      {/* Audio Player */}
      {/* Mini Audio Player - Fixed Bottom */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-50">
        <AudioPlayer audioRef={audioRef} />
      </div>



    </div>
  );
}

export default Home;
