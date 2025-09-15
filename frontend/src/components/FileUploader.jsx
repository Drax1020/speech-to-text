import React from "react";

function FileUploader({ onUpload }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file, file.name);
  };

  return (
   <label className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md cursor-pointer flex items-center gap-2 transition">
  📁 Upload
  
  <input
  type="file"
  name="file"
  accept=".mp3,.wav,.ogg,.mp4,.m4a,.webm,.txt,.pdf"
  className="hidden" 
  onChange={handleChange}
/>

</label>

  );
}

export default FileUploader;
