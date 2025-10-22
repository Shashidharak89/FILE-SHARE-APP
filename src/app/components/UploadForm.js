"use client";
import { useState } from "react";

export default function UploadForm({ onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return alert("Select files first");
    setLoading(true);

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok) {
        alert("Uploaded: " + (data.saved || []).join(", "));
        setSelectedFiles(null);
        document.getElementById("fileInput").value = "";
        if (onUploadSuccess) onUploadSuccess();
      } else {
        alert("Upload failed: " + (data.error || "unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: "20px",
      border: "1px solid #FFA500",
      borderRadius: "10px",
      marginBottom: "20px",
      backgroundColor: "#FFF8F0"
    }}>
      <h2 style={{ color: "#FF6600", marginBottom: "12px" }}>Upload Files</h2>
      <input
        id="fileInput"
        type="file"
        multiple
        onChange={(e) => setSelectedFiles(e.target.files)}
        style={{ marginBottom: "10px" }}
      />
      <br />
      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          backgroundColor: "#FF6600",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
