import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import NavBar            from './components/navbar/NavBar';
import Footer            from './components/footer/Footer';

import LoginPage         from './components/login/LoginPage';
import RegisterPage      from './components/registration/RegisterPage';
import CourseDetailPage  from './components/LandingPage/CourseDetail';
import ModulePage        from './components/ModulePage/ModulePage';
import CertificatePage   from './components/CertificatePage/CertificatePage';
import PurchasePage      from './components/purchase/PurchasePage';
import QuizPage          from './components/Quiz/QuizPage';

function Private({ children }) {
  return localStorage.getItem('jwt')
    ? children
    : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Root redirect */}
          <Route
            path="/"
            element={
              <Private>
                <Navigate to="/courses/68185ae28573ba5be58d4ef6" replace />
              </Private>
            }
          />

          {/* Course dashboard */}
          <Route
            path="/courses/:courseId"
            element={<Private><CourseDetailPage /></Private>}
          />

          {/* Module view */}
          <Route
            path="/courses/:courseId/modules/:moduleId"
            element={<Private><ModulePage /></Private>}
          />

          {/* Quiz */}
          <Route
            path="/courses/:courseId/modules/:moduleId/quiz"
            element={<Private><QuizPage /></Private>}
          />

          {/* Purchase */}
          <Route
            path="/purchase/module/:moduleId"
            element={<Private><PurchasePage /></Private>}
          />

          {/* Certificate */}
          <Route
            path="/certificate/:courseId"
            element={<Private><CertificatePage /></Private>}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
