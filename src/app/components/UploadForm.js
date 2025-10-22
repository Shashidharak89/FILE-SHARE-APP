"use client";
import { useState, useRef } from "react";

export default function UploadForm({ onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const onFiles = (files) => {
    setSelectedFiles(Array.from(files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) onFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Select files first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.ok) {
        alert("Uploaded: " + (data.saved || []).join(", "));
        setSelectedFiles([]);
        if (inputRef.current) inputRef.current.value = "";
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
    <div>
      <h3 style={{ color: "#FF6600", marginBottom: 8 }}>Upload files</h3>

      <div
        className="upload-drop"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ border: "2px dashed #FF6600", padding: 16, borderRadius: 8 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <div className="small muted">Drag & drop files here or</div>
            <div className="input-row" style={{ marginTop: 10 }}>
              <input
                ref={inputRef}
                className="file-input"
                id="fileInput"
                type="file"
                multiple
                onChange={(e) => onFiles(e.target.files)}
              />
              <button
                className="btn"
                onClick={() => inputRef.current && inputRef.current.click()}
                type="button"
                style={{
                  backgroundColor: "#FF6600",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  marginLeft: 8,
                  borderRadius: 5,
                  cursor: "pointer"
                }}
              >
                Choose
              </button>
            </div>
          </div>

          <div style={{ minWidth: 120, textAlign: "right" }}>
            <button
              className="btn"
              onClick={handleUpload}
              disabled={loading}
              style={{
                backgroundColor: "#FF6600",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: 5,
                cursor: "pointer"
              }}
            >
              {loading ? "Uploading…" : "Upload"}
            </button>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="small muted">Selected:</div>
            <ul style={{ marginTop: 8, paddingLeft: 0, listStyle: "none" }}>
              {selectedFiles.map((f, i) => (
                <li key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #eee" }}>
                  <div>{f.name}</div>
                  <div style={{ fontSize: "0.85em", color: "#666" }}>{(f.size / 1024).toFixed(1)} KB</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
