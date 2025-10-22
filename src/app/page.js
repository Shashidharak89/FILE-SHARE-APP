// app/page.js
"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      console.error(e);
    }
  }

  function onFileChange(e) {
    setSelectedFiles(e.target.files);
  }

  async function upload() {
    if (!selectedFiles || selectedFiles.length === 0) return alert("Select files first");
    setLoading(true);
    const fd = new FormData();
    // append multiple files with the same field name "files"
    for (let i = 0; i < selectedFiles.length; i++) {
      fd.append("files", selectedFiles[i]);
    }

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) {
        alert("Uploaded: " + (data.saved || []).join(", "));
        setSelectedFiles(null);
        // clear file input manually
        document.getElementById("fileInput").value = "";
        fetchFiles();
      } else {
        alert("Upload failed: " + (data.error || "unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    } finally {
      setLoading(false);
    }
  }

  function download(name) {
    // navigate to download endpoint
    window.location = `/api/download?name=${encodeURIComponent(name)}`;
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>LAN File Share (C:/share)</h1>

      <div style={{ marginBottom: 12 }}>
        <input id="fileInput" type="file" multiple onChange={onFileChange} />
        <button onClick={upload} disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <h2>Files in C:/share</h2>
      <button onClick={fetchFiles} style={{ marginBottom: 8 }}>
        Refresh
      </button>

      {files.length === 0 ? (
        <p>No files found</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Size (bytes)</th>
              <th>Modified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.name}>
                <td>{f.name}</td>
                <td>{f.size}</td>
                <td>{new Date(f.mtime).toLocaleString()}</td>
                <td>
                  <button onClick={() => download(f.name)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
