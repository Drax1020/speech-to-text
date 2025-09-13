function TranscriptionBox({ transcription }) {
  if (!transcription) return null;
  if (transcription.loading) {
    return (
      <div className="p-4 border rounded-lg shadow bg-yellow-100 text-yellow-700">
        ⏳ Processing audio...
      </div>
    );
  }
  if (transcription.error) {
    return (
      <div className="p-4 border rounded-lg shadow bg-red-100 text-red-700">
        ❌ Error: {transcription.error}
      </div>
    );
  }
  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <p className="text-gray-800">{transcription.text}</p>
    </div>
  );
}

export default TranscriptionBox;
