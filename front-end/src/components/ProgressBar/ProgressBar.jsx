// src/components/ProgressBar/ProgressBar.jsx
import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ percent }) {
  return (
    <div className="progress-bar">
      <div
        className="progress-bar__fill"
        style={{ width: `${percent}%` }}
      />
      <span className="progress-bar__label">
        {percent}% Modules Unlocked
      </span>
    </div>
  );
}
