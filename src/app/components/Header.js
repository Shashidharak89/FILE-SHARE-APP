"use client";
import React from "react";
import './styles/Header.css';

export default function Header() {
  return (
    <header className="site-header container">
      <div className="brand">
        <div className="logo">
          <img src="/logo.svg" alt="File Share Logo" width="40" height="40" />
        </div>
        <div>
          <div className="title">LAN File Share</div>
          <div className="subtitle">Fast, local file sharing — no cloud required</div>
        </div>
      </div>
      <div className="small muted">Light • Responsive • Animated</div>
    </header>
  );
}
