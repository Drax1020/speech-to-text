// import React from "react";

// const TranscriptionList = ({ transcriptions }) => {
//   if (!transcriptions || transcriptions.length === 0) {
//     return (
//       <div className="text-gray-400 italic text-center py-4">
//         No transcriptions yet.
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {transcriptions.map((t) => (
//         <div
//           key={t._id}
//           className="bg-gray-800 bg-opacity-70 border border-purple-500/30 rounded-lg p-4 shadow-md hover:shadow-purple-500/20 transition"
//         >
//           <div className="text-sm text-gray-400 mb-1">
//             {new Date(t.createdAt).toLocaleString()}
//           </div>
//           <p className="text-gray-200 mb-2 max-h-32 overflow-y-auto whitespace-pre-wrap">
//             {t.text || "No transcription extracted."}
//           </p>

//           {t.audioUrl && (
//             <audio
//               controls
//               src={`http://localhost:5000/${t.filePath}`}
//               className="w-full mt-2"
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TranscriptionList;


import React, { useState } from "react";
import { Play, Pause, FileAudio } from "lucide-react";

const TranscriptionList = ({ transcriptions }) => {
    if (!transcriptions || transcriptions.length === 0) {
    return (
      <div className="text-gray-400 italic text-center py-4">
        No transcriptions yet.
      </div>
    );
  }
  console.log("Transcriptions:", transcriptions);
  const [playingId, setPlayingId] = useState(null);
  const [audio, setAudio] = useState(null);

  const togglePlay = (t) => {
    if (playingId === t._id) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    if (audio) audio.pause();

    const newAudio = new Audio(t.audioUrl);
    newAudio.play();
    setAudio(newAudio);
    setPlayingId(t._id);

    newAudio.onended = () => {
      setPlayingId(null);
      setAudio(null);
    };

    
  };

  return (
    <div className="space-y-3">
      {transcriptions.map((t) => (
        <div
          key={t._id}
          className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 shadow-md hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-200">{t.text || "No text extracted"}</p>
            {t.audioUrl && (
              <button
                onClick={() => togglePlay(t)}
                className="ml-3 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition"
              >
                {playingId === t._id ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
            <FileAudio size={14} />
            <span>{t.provider}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TranscriptionList;
