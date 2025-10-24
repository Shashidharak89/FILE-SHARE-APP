"use client";
import { useEffect, useState } from "react";
import './styles/FileList.css';

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
      if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new Error('Invalid file name');
      }

      const cleanName = name.trim();
      const encodedName = encodeURIComponent(cleanName);
      
      console.log('Initiating download:', {
        originalName: name,
        cleanName: cleanName,
        encodedName: encodedName
      });

      const downloadUrl = `/api/download?filename=${encodedName}`;
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
      
      const blob = await response.blob();
      console.log('Download successful:', { 
        size: blob.size, 
        type: blob.type,
        name: cleanName 
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = cleanName;
      
      console.log('Triggering download with:', {
        url: link.href,
        filename: link.download
      });
      
      document.body.appendChild(link);
      link.click();
      
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
    <div className="file-list-container">
    
      <h3 className="file-list-title">Files in Storage</h3>
      <div className="file-list-actions">
        <button 
          className={`refresh-btn ${loading ? 'loading' : ''}`} 
          onClick={fetchFiles} 
          disabled={loading}
        >
          <span className="btn-content">
            {loading ? 'Loading...' : 'Refresh'}
          </span>
        </button>
      </div>

      {error ? (
        <p className="error-message fade-in">{error}</p>
      ) : loading ? (
        <div className="loading-container fade-in">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <p className="empty-state fade-in">No files found</p>
      ) : (
        <ul className="file-list">
          {files.map((file, idx) => (
            <li 
              key={idx} 
              className="file-item"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="file-info">
                <div className="filename" title={file}>{file}</div>
                <div className="file-meta">{/* placeholder for size/date */}</div>
              </div>
              <div className="file-actions">
                <button 
                  className="download-btn"
                  disabled={!file}
                  onClick={() => handleDownload(file)}
                >
                  <span className="btn-icon">↓</span>
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