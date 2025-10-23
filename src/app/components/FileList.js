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
      console.log('Starting download for:', name);
      
      const encodedFilename = encodeURIComponent(name);
      const downloadUrl = `/api/download/${encodedFilename}`;
      
      console.log('Fetching from URL:', downloadUrl);
      
      // Use fetch with specific headers
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream',
        },
      });
      
      // Log response status and headers
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download failed:', errorText);
        throw new Error(`Download failed: ${response.status} ${errorText}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      console.log('Received blob:', {
        size: blob.size,
        type: blob.type
      });
      
      // Trigger download using blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 1000);
      
      console.log('Download initiated successfully');
    } catch (err) {
      console.error('Download error:', err);
      alert(`Download failed: ${err.message}`);
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
