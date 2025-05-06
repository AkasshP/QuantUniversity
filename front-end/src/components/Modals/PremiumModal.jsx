import React from 'react';
import './PremiumModal.css';

export default function PremiumModal({ onClose, onUpgrade }) {
  return (
    <div className="modal-backdrop">
      <div className="premium-modal">
        <h2>Go Premium</h2>
        <p>Unlock all modules across every course for <strong>$50</strong></p>
        <div className="buttons">
          <button className="btn-primary" onClick={onUpgrade}>
            Upgrade to Premium
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
