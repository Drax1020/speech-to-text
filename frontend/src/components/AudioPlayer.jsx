// // src/components/AudioPlayer.jsx
// import { useState } from "react";

// export default function AudioPlayer({ audioRef }) {
//   const [isPlaying, setIsPlaying] = useState(false);

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <div className="flex items-center justify-between bg-gray-800 text-white rounded-full px-4 py-2 shadow-lg">
//       {/* Play / Pause Button */}
//       <button
//         onClick={togglePlay}
//         className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
//       >
//         {isPlaying ? "⏸️" : "▶️"}
//       </button>

//       {/* Hidden native audio element */}
//       <audio ref={audioRef} className="hidden" controls />

//       {/* Track Label */}
//       <span className="text-sm font-medium truncate px-3">
//         Now Playing
//       </span>

//       {/* Volume Icon */}
//       <button className="p-2 rounded-full hover:bg-gray-700 transition">
//         🔊
//       </button>
//     </div>
//   );
// }


import React, { useState, useRef } from "react";
import { Play, Pause } from "lucide-react"; // icons

export default function AudioPlayer({ src, small }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef();

  const togglePlay = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={togglePlay}
        className={`${
          small ? "w-10 h-10" : "w-14 h-14"
        } flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-600 transition`}
      >
        {playing ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
    </div>
  );
}
