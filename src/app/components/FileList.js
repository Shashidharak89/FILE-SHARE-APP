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

  const handleDownload = (name) => {
    // open the download route in a new tab
    window.open(`/api/download/${encodeURIComponent(name)}`);
  };

  return (
    <div>
      <h3 style={{ color: 'var(--accent)', marginBottom: 8 }}>Files in C:/share</h3>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <button className="btn" onClick={fetchFiles}>Refresh</button>
      </div>

      {files.length === 0 ? (
        <p className="muted">No files found</p>
      ) : (
        <ul className="list">
          {files.map((file, idx) => (
            <li key={idx} className="list-item">
              <div>
                <div className="filename">{file}</div>
                <div className="file-meta">{/* placeholder for size/date */}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => handleDownload(file)}>Download</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
