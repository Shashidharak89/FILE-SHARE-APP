import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer container">
      <div>© {new Date().getFullYear()} LAN File Share</div>
      <div className="muted">Built for local networks — no telemetry</div>
    </footer>
  );
}
