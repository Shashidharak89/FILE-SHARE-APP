"use client";
import { useEffect, useState } from "react";

export default function FileList() {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{
      padding: "20px",
      border: "1px solid #FFA500",
      borderRadius: "10px",
      backgroundColor: "#FFF8F0"
    }}>
      <h2 style={{ color: "#FF6600", marginBottom: "12px" }}>Files in C:/share</h2>
      <button
        onClick={fetchFiles}
        style={{
          backgroundColor: "#FF6600",
          color: "#fff",
          border: "none",
          padding: "8px 15px",
          borderRadius: "5px",
          marginBottom: "10px",
          cursor: "pointer"
        }}
      >
        Refresh
      </button>

      {files.length === 0 ? (
        <p>No files found</p>
      ) : (
        <ul>
          {files.map((file, idx) => (
            <li key={idx} style={{ padding: "5px 0", color: "#333" }}>
              {file}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
