"use client";
import React from "react";

export default function Header() {
  return (
    <header className="site-header container">
      <div className="brand">
        <div className="logo">FS</div>
        <div>
          <div className="title">LAN File Share</div>
          <div className="subtitle">Fast, local file sharing — no cloud required</div>
        </div>
      </div>
      <div className="small muted">Light • Responsive • Animated</div>
    </header>
  );
}
