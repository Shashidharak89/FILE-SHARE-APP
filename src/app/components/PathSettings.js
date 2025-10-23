"use client";
import { useState, useEffect } from 'react';

export default function PathSettings() {
  const [path, setPath] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved path from localStorage
    const savedPath = localStorage.getItem('fileshare_path') || 'C:\\share';
    setPath(savedPath);
  }, []);

  const handlePathChange = async (newPath) => {
    try {
      // Validate and save the new path
      const response = await fetch('/api/validate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: newPath }),
      });

      const data = await response.json();

      if (data.valid) {
        localStorage.setItem('fileshare_path', newPath);
        setPath(newPath);
        setError('');
        setIsEditing(false);
        // Trigger page refresh to update file list
        window.location.reload();
      } else {
        setError(data.error || 'Invalid path');
      }
    } catch (err) {
      setError('Failed to validate path');
    }
  };

  return (
    <div className="path-settings">
      <div className="path-display">
        <span className="path-label">Storage Path: </span>
        {isEditing ? (
          <div className="path-edit">
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="path-input"
              placeholder="Enter storage path"
            />
            <button 
              onClick={() => handlePathChange(path)}
              className="btn"
              style={{ marginLeft: 8 }}
            >
              Save
            </button>
            <button 
              onClick={() => {
                setIsEditing(false);
                setError('');
              }}
              className="btn"
              style={{ marginLeft: 8 }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="path-view">
            <span className="current-path">{path}</span>
            <button 
              onClick={() => setIsEditing(true)}
              className="btn"
              style={{ marginLeft: 8 }}
            >
              Change
            </button>
          </div>
        )}
      </div>
      {error && <div className="error-message" style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}