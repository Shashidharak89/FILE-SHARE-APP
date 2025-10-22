"use client";
import { useState } from "react";
import UploadForm from "./components/UploadForm";
import FileList from "./components/FileList";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif", backgroundColor: "#ffffff" }}>
      <h1 style={{ color: "#FF6600", marginBottom: "30px" }}>LAN File Share</h1>

      <UploadForm onUploadSuccess={() => setRefresh(!refresh)} />
      <FileList key={refresh} />
    </main>
  );
}
