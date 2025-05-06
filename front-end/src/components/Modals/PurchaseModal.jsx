import React, { useState } from 'react';
import './PurchaseModal.css';

export default function PurchaseModal({ moduleIndex, onClose, onPurchase }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry]         = useState('');
  const [cvv, setCvv]               = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onPurchase({ cardNumber, expiry, cvv });
  };

  return (
    <div className="modal-backdrop">
      <div className="purchase-modal">
        <h2>Unlock Module {moduleIndex + 1}</h2>
        <p>Pay $10 to unlock this module</p>

        <form onSubmit={handleSubmit}>
          <label>
            Card Number
            <input
              type="text"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              required
            />
          </label>

          <div className="two-col">
            <label>
              Expiry (MM/YY)
              <input
                type="text"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                placeholder="MM/YY"
                required
              />
            </label>

            <label>
              CVV
              <input
                type="text"
                value={cvv}
                onChange={e => setCvv(e.target.value)}
                placeholder="123"
                required
              />
            </label>
          </div>

          <div className="buttons">
            <button type="submit" className="btn-primary">
              Pay $10
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
