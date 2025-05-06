import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} AI Academy</div>
      <div className="footer-links">
        <a href="/terms">Terms</a>
        <a href="/privacy">Privacy</a>
        <a href="https://github.com/your-repo" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </footer>
  );
}
