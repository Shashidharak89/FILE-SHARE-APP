'use client';
import { useState, useEffect } from 'react';

export default function SystemFileList() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPath, setSelectedPath] = useState('C:/share');

    useEffect(() => {
        fetchSystemFiles();
    }, [selectedPath]);

    const fetchSystemFiles = async () => {
        try {
            const response = await fetch('/api/system-files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: selectedPath })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch system files');
            }
            const data = await response.json();
            setFiles(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveFile = async (filename) => {
        try {
            const response = await fetch(`/api/system-files/save/${encodeURIComponent(filename)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sourcePath: path.join(selectedPath, filename)
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save file');
            }
            
            alert('File saved successfully!');
            // Refresh the file list
            fetchSystemFiles();
        } catch (err) {
            alert('Error saving file: ' + err.message);
        }
    };

    if (loading) return <div>Loading system files...</div>;
    if (error) return <div>Error: {error}</div>;

    const handlePathChange = async (e) => {
        e.preventDefault();
        const directoryInput = document.createElement('input');
        directoryInput.type = 'file';
        directoryInput.webkitdirectory = true;
        
        directoryInput.onchange = (e) => {
            if (e.target.files.length > 0) {
                const path = e.target.files[0].path.split('\\').slice(0, -1).join('\\');
                setSelectedPath(path);
            }
        };
        
        directoryInput.click();
    };

    return (
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">System Files</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{selectedPath}</span>
                    <button 
                        onClick={handlePathChange}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Change Folder
                    </button>
                </div>
            </div>
            {files.length === 0 ? (
                <p>No files found in system folder</p>
            ) : (
                <ul className="space-y-2">
                    {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <span>{file.name}</span>
                            <div>
                                <button
                                    onClick={() => handleSaveFile(file.name)}
                                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Save to App
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}