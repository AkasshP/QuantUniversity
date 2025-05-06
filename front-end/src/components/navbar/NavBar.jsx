// File: frontend/src/components/navbar/NavBar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock }  from 'lucide-react';
import './NavBar.css';

export default function NavBar({ courseId, completedModules, totalModules, pct }) {
  const navigate = useNavigate();
  const canCertificate = completedModules === totalModules;

  return (
    <nav className="navbar">
      <div className="navbar__brand" onClick={() => navigate('/')}>
        AI Academy
      </div>
      <ul className="navbar__links">
        <li><Link to="/">Home</Link></li>
        <li><Link to={`/courses/${courseId}`}>My Course</Link></li>
        <li>
          {canCertificate ? (
            <Link to={`/certificate/${courseId}`} className="navbar__link--cert">
              Get Certificate
            </Link>
          ) : (
            <span className="navbar__link--cert navbar__link--disabled">
              <Lock size={16} className="icon-lock" /> Certificate
            </span>
          )}
        </li>
        <li><button onClick={() => { localStorage.removeItem('jwt'); navigate('/login'); }}>Log Out</button></li>
      </ul>
    </nav>
  );
}
