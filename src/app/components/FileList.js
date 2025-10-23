"use client";
import { useEffect, useState } from "react";

import PathSettings from './PathSettings';

export default function FileList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storagePath, setStoragePath] = useState('');

  useEffect(() => {
    // Load saved path from localStorage
    const savedPath = localStorage.getItem('fileshare_path') || 'C:\\share';
    setStoragePath(savedPath);
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/files", {
        headers: {
          'x-storage-path': storagePath
        }
      });
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
      // Validate filename
      if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new Error('Invalid file name');
      }

      // Clean and encode the filename
      const cleanName = name.trim();
      const encodedName = encodeURIComponent(cleanName);
      
      console.log('Initiating download:', {
        originalName: name,
        cleanName: cleanName,
        encodedName: encodedName
      });

      // Make the request
      const downloadUrl = `/api/download/${encodedName}`;
      console.log('Requesting from:', downloadUrl);
      
      const response = await fetch(downloadUrl);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download failed:', {
          status: response.status,
          error: errorText
        });
        throw new Error(errorText || `Download failed (${response.status})`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      console.log('Download successful:', { 
        size: blob.size, 
        type: blob.type,
        name: cleanName 
      });

      // Create download link
      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = cleanName;
      
      console.log('Triggering download with:', {
        url: link.href,
        filename: link.download
      });
      
      // Add to document and click
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        console.log('Download cleanup completed');
      }, 1000);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <PathSettings />
      <h3 style={{ color: 'var(--accent)', marginBottom: 8, marginTop: 16 }}>Files in Storage</h3>
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
                <div className="filename" title={file}>{file}</div>
                <div className="file-meta">{/* placeholder for size/date */}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  className="btn"
                  disabled={!file}
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
