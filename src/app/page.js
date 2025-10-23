"use client";
import { useState } from "react";
import UploadForm from "./components/UploadFormNew";
import FileList from "./components/FileList";
import SystemFileList from "./components/SystemFileList";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  return (
    <section>
      <div className="hero container">
        <div>
          <h1>Share files on your LAN — instantly</h1>
          <p className="muted">Drag & drop or select files to share across devices on the same network. Lightweight and private.</p>
        </div>
        <div className="small muted">Drop files under C:/share to make them available</div>
      </div>

      <div className="container">
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div className="panel" style={{ minHeight: 220 }}>
            <UploadForm onUploadSuccess={() => setRefresh(!refresh)} />
          </div>

          <aside className="panel">
            <FileList key={String(refresh)} />
          </aside>
        </div>

        {/* System Files Section */}
        <div className="mt-8">
          <SystemFileList />
        </div>
      </div>
    </section>
  );
}
