// File: frontend/src/pages/CourseDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }        from 'react-router-dom';
import { apiFetch }                       from '../../api';
import PurchaseModal                      from '../Modals/PurchaseModal';
import PremiumModal                       from '../Modals/PremiumModal';
import NavBar                             from '../navbar/NavBar';
import ProgressBar from '../ProgressBar/ProgressBar';
import { Lock }                           from 'lucide-react';
import './CourseDetail.css';

export default function CourseDetailPage() {
  const { courseId }  = useParams();
  const navigate  = useNavigate();
  const token  = localStorage.getItem('jwt');

  const [modules, setModules]     = useState([]);  
  const [progress, setProgress]   = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const titles = [
    'Module 1: Introduction to AI',
    'Module 2: Introduction to NLP',
    'Module 3: Introduction to deepLearning',
    'Module 4: IOS',
    'Module 5: Cloud Computing',
    'Module 6: Data Scientist',
    'Module 7: Robotics',
    'Module 8: Introduction to LLM',
  ];
  const [buyIdx, setBuyIdx]       = useState(-1);
  const [showPremium, setShow]    = useState(false);

  // Derived progress metrics
  const totalModules = titles.length;  // 8 modules total

  // Count how many are unlocked:
  //  – Module 1 (idx 0) is always unlocked,
  //  – or else check progress[moduleId].unlocked
  const unlockedModules = titles.filter((_, idx) => {
    const modId = modules[idx];
    return idx === 0 || progress[modId]?.unlocked;
  }).length;
  
  // Count how many are completed:
  //  – Module 1 (idx 0) we treat as “completed” too,
  //  – or else check progress[moduleId].completed
  const completedModules = titles.filter((_, idx) => {
    const modId = modules[idx];
    return idx === 0 || progress[modId]?.completed;
  }).length;


  const percentUnlocked = totalModules
  ? Math.round((unlockedModules / totalModules) * 100)
  : 0;

  const pct = totalModules
  ? Math.round((totalScore / totalModules) * 100)
  : 0;

  // Fetch modules & progress
  useEffect(() => {
    (async () => {
      const { course, progress: p, totalScore: ts } = await apiFetch(
        `/api/courses/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules(course.modules);
      setProgress(p);
      setTotalScore(ts || 0);
    })();
  }, [courseId, token]);

  const handleCard = idx => {
    const modId    = modules[idx];
    const unlocked = idx === 0 || progress[modId]?.unlocked;
    if (unlocked) {
      navigate(`/courses/${courseId}/modules/${modId}`);
    } else {
      setBuyIdx(idx);
    }
  };

  const refreshProgress = async () => {
    const { progress: p } = await apiFetch(
      `/api/courses/${courseId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setProgress(p);
  };

  if (!modules.length) return <p>Loading modules…</p>;

  return (
    <>
      <NavBar
        courseId={courseId}
        completedModules={completedModules}
        totalModules={totalModules}
        pct={totalScore}
      />

      <div className="course-detail">
      
        <header>
          <h1>All Modules</h1>
          <button onClick={() => setShow(true)}>Explore Plans</button>
        </header>
        <ProgressBar percent={percentUnlocked} />
        <div className="modules-grid">
          {modules.map((modId, idx) => {
            const unlocked = idx === 0 || progress[modId]?.unlocked;
            return (
              <div
                key={modId}
                className={`card ${unlocked ? 'unlocked' : 'locked'}`}
                onClick={() => handleCard(idx)}
              >
               <h3>{titles[idx]}</h3>
                {unlocked ? (
                  <p className="badge">Open</p>
                ) : (
                  <div className="locked-indicator">
                    <Lock size={20} color="#888"/> {/* lock icon */}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {buyIdx >= 0 && (
          <PurchaseModal
            moduleIndex={buyIdx}
            onClose={() => setBuyIdx(-1)}
            onPurchase={async () => {
              const modId = modules[buyIdx];
              await apiFetch(
                `/api/courses/${courseId}/subscribe-module/${modId}`,
                { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
              );
              await refreshProgress();
              setBuyIdx(-1);
            }}
          />
        )}

        {showPremium && (
          <PremiumModal
            onClose={() => setShow(false)}
            onUpgrade={async () => {
              await apiFetch('/api/courses/upgrade/premium', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
              });
              await refreshProgress();
              setShow(false);
            }}
          />
        )}

        {/* {completedModules === totalModules && pct >= 80 && (
        <div className="certificate-action">
          <button onClick={downloadCertificate}>
            Get Certificate
          </button>
        </div>
      )} */}
      <div className="progress-summary">
        You’ve unlocked {unlockedModules}/{totalModules} modules.
        <br />
        You’ve completed {completedModules}/{totalModules} modules.
      </div>
      </div>
    </>
  );
}
