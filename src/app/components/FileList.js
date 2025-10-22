"use client";
import { useEffect, useState } from "react";

export default function FileList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/files");
      if (!res.ok) throw new Error('Failed to fetch files');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDownload = async (name) => {
    try {
      const encodedFilename = encodeURIComponent(name);
      const downloadUrl = `/api/download/${encodedFilename}`;
      
      // First check if file exists
      const checkRes = await fetch(downloadUrl);
      if (!checkRes.ok) {
        throw new Error('File not found or unable to download');
      }
      
      // If file exists, trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = name; // Set the download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <div>
      <h3 style={{ color: 'var(--accent)', marginBottom: 8 }}>Files in C:/share</h3>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <button className="btn" onClick={fetchFiles} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error ? (
        <p style={{ color: 'var(--error)', marginBottom: 12 }}>{error}</p>
      ) : loading ? (
        <p className="muted">Loading files...</p>
      ) : files.length === 0 ? (
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
                <button 
                  className="btn" 
                  onClick={() => handleDownload(file)}
                >
                  Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
