import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';

export default function PurchasePage() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');

  const handlePremium = async () => {
    await apiFetch('/api/courses/upgrade/premium', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate(`/courses/${courseId}`);
  };

  const handleModule = async () => {
    await apiFetch(`/api/courses/${courseId}/subscribe-module/${moduleId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="purchase-page">
      <h1>Upgrade Your Plan</h1>
      <button onClick={handleModule}>
        Unlock This Module Only
      </button>
      <button onClick={handlePremium}>
        Upgrade to Premium (Unlock All Modules)
      </button>
    </div>
  );
}
