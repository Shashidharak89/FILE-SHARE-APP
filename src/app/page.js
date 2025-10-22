"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);

  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => setFiles(data.files || []));
  }, []);

  const handleUpload = async () => {
    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("files", file);
    }
    await fetch("/api/upload", { method: "POST", body: formData });
    alert("Uploaded!");
    location.reload(); // reload to show updated files list
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>File Share</h1>

      <input type="file" multiple onChange={(e) => setSelectedFiles(e.target.files)} />
      <button onClick={handleUpload}>Upload</button>

      <h2>Available Files</h2>
      <ul>
        {files.map((file, idx) => (
          <li key={idx}>
            <a href={`/api/download/${file}`} download>{file}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
