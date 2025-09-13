// src/components/AudioPlayer.jsx
import { useState } from "react";

export default function AudioPlayer({ audioRef }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 text-white rounded-full px-4 py-2 shadow-lg">
      {/* Play / Pause Button */}
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>

      {/* Hidden native audio element */}
      <audio ref={audioRef} className="hidden" controls />

      {/* Track Label */}
      <span className="text-sm font-medium truncate px-3">
        Now Playing
      </span>

      {/* Volume Icon */}
      <button className="p-2 rounded-full hover:bg-gray-700 transition">
        🔊
      </button>
    </div>
  );
}
