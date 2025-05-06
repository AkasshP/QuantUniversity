// File: frontend/src/components/CertificatePage/CertificatePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams }                 from 'react-router-dom';
import { apiFetch }                  from '../../api';
import './CertificatePage.css';

export default function CertificatePage() {
  const { courseId } = useParams();
  const token        = localStorage.getItem('jwt');

  const [status, setStatus] = useState({
    loading: true,
    eligible: false,
    message: '',
    totalScore: 0
  });

  // 1) Fetch certificate eligibility + score
  useEffect(() => {
    (async () => {
      try {
        // apiFetch prefixes with REACT_APP_API_URL + /api
        const data = await apiFetch(
          `/api/certificate/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStatus({
          loading: false,
          eligible: data.eligible,
          message: data.message,
          totalScore: data.totalScore
        });
      } catch (err) {
        setStatus({
          loading: false,
          eligible: false,
          message: err.message || 'Could not fetch certificate status',
          totalScore: 0
        });
      }
    })();
  }, [courseId, token]);

  // 2) While loading…
  if (status.loading) {
    return <p className="certificate-page__loading">Checking your eligibility…</p>;
  }

  // 3) If not eligible…
  if (!status.eligible) {
    return (
      <div className="certificate-page ineligible">
        <div className="certificate-page__card">
          <h2>No Certificate Yet</h2>
          <p>{status.message}</p>
        </div>
      </div>
    );
  }

  // 4) Download handler that sends JWT header
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/courses/${courseId}/certificate/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `certificate-${courseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Download failed');
    }
  };

  // 5) Render eligible UI
  return (
    <div className="certificate-page eligible">
      <div className="certificate-page__card">
        <h2>Congratulations!</h2>
        <p className="certificate-page__score">
          Your total score: <strong>{status.totalScore}</strong>
        </p>
        <button
          className="certificate-page__download-btn"
          onClick={handleDownload}
        >
          Download Your Certificate
        </button>
      </div>
    </div>
  );
}
