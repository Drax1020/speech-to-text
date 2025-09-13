import React from "react";

function TranscriptionList({ list, playAudio }) {
  if (!list || list.length === 0) {
    return (
      <div className="p-4 text-gray-500 italic">
        No past transcriptions yet.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {list.map((item) => (
       <li
  key={item._id}
  className="p-4 bg-gray-50 border rounded-xl shadow hover:shadow-lg transition"
>
  <p className="text-gray-800 font-medium">{item.text}</p>
  <div className="mt-2 flex items-center justify-between">
    <span className="text-sm text-gray-500">
      {new Date(item.createdAt).toLocaleString()}
    </span>
    {item.filename && (
      <button
        onClick={() => playAudio(item.filename)}
        className="px-3 py-1 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition"
      >
        ▶ Play
      </button>
    )}
  </div>
</li>

      ))}
    </ul>
  );
}

export default TranscriptionList;
