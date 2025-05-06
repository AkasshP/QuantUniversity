// File: frontend/src/pages/ModulePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch }                    from '../../api';                  // one level up
import PurchaseModal                   from '../Modals/PurchaseModal'; // your modal path
import './ModulePage.css';

export default function ModulePage() {
  const { courseId, moduleId } = useParams();
  const navigate               = useNavigate();
  const token                  = localStorage.getItem('jwt');

  const [module, setModule]   = useState(null);
  const [locked, setLocked]   = useState(false);
  const [showPurchase, setBuy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch(
          `/api/courses/${courseId}/modules/${moduleId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.locked) {
          setLocked(true);
        } else {
          setModule(data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [courseId, moduleId, token]);

  if (locked) {
    return (
      <div className="locked-page">
        <p>This module is locked.</p>
        <button onClick={() => setBuy(true)}>Purchase to unlock</button>
        {showPurchase && (
          <PurchaseModal
            onClose={() => setBuy(false)}
            onPurchase={async () => {
              await apiFetch(
                `/api/courses/${courseId}/subscribe-module/${moduleId}`,
                { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
              );
              window.location.reload();
            }}
          />
        )}
      </div>
    );
  }

  if (!module) return <p>Loading module…</p>;

  // Determine if this is the last module
  const isLastModule = () => {
    // your API should return `totalModules` alongside `module`
    return module.index === module.totalModules - 1;
  };

  return (
    <div className="module-page">
      <h1>{module.title}</h1>

      {/* 1) Slides via PPT embed */}
      <div className="slides-container">
        <iframe
          src={
            module.slideUrl
          }
          title="Slide Deck"
          frameBorder="0"
          allowFullScreen
          width="100%"
          height="480"
        />
      </div>

      {/* 2) Video via YouTube embed */}
      <div className="video-container">
        <iframe
          src={module.videoUrl}
          title="Lecture Video"
          frameBorder="0"
          width="100%"
          height="360"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* 3) Text */}
      <div className="text-content">
        <p>{module.text}</p>
      </div>

      {/* 4) Navigate to separate QuizPage */}
      {module.index > 1 ? (
  <button
    onClick={() =>
      navigate(`/courses/${courseId}/modules/${moduleId}/quiz`)
    }
  >
    Take Quiz
  </button>
): <button
// onClick={() =>
//   navigate(`/courses/${courseId}/modules/${moduleId}/quiz`)
// }
disabled = {true}
>
Unlock Quizzes by becoming a subscriber
</button>}
    </div>
  );
}
