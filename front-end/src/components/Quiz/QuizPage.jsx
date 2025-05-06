// File: frontend/src/components/Quiz/QuizPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }       from 'react-router-dom';
import { apiFetch }                     from '../../api';
import './QuizPage.css';

export default function QuizPage() {
  const { courseId, moduleId } = useParams();
  const navigate               = useNavigate();
  const token                  = localStorage.getItem('jwt');

  const [questions, setQuestions]     = useState([]);
  const [moduleTitle, setModuleTitle] = useState('');
  const [answers, setAnswers]         = useState({});
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [quizScore, setQuizScore]     = useState(null);
  const [totalScore, setTotalScore]   = useState(null);

  // Load the quiz
  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch(
          `/api/courses/${courseId}/modules/${moduleId}/quiz`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestions(data.questions || []);
        setModuleTitle(data.title || '');
      } catch (err) {
        setError(err.error || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, moduleId, token]);

  const handleChange = (qIdx, option) => {
    setAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // 1) Compute the module’s score in the front‑end
    const score = questions.reduce(
      (sum, q, i) => sum + (answers[i] === q.correctAnswer ? 1 : 0),
      0
    );

    try {
      // 2) Submit to your new endpoint
      const { quizScore: returnedScore, totalScore: newTotal } = await apiFetch(
        `/api/courses/${courseId}/modules/${moduleId}/quiz`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ score })
        }
      );

      // 3) Update local state (if you want to display feedback)
      setQuizScore(returnedScore);
      setTotalScore(newTotal);

      // 4) Go back to the module page (or wherever)
      navigate(`/courses/${courseId}/modules/${moduleId}`, { replace: true });

    } catch (err) {
      setError(err.error || 'Failed to submit quiz');
    }
  };

  if (loading) return <p className="quiz-loading">Loading quiz…</p>;
  if (error)   return <p className="quiz-error">{error}</p>;

  return (
    <div className="quiz-page">
      <h2>Quiz: {moduleTitle}</h2>

      <form onSubmit={handleSubmit}>
        {questions.map((q, i) => (
          <div key={i} className="quiz-question">
            <p className="prompt">{i + 1}. {q.prompt}</p>
            {q.options.map(opt => (
              <label key={opt} className="option">
                <input
                  type="radio"
                  name={`q${i}`}
                  value={opt}
                  checked={answers[i] === opt}
                  onChange={() => handleChange(i, opt)}
                  required
                />
                {opt}
              </label>
            ))}
          </div>
        ))}

        <button type="submit" className="submit-btn">
          Submit Quiz
        </button>
      </form>

      {/* Optional: show feedback before redirect */}
      {quizScore !== null && (
        <div className="quiz-feedback">
          <p>You scored {quizScore} / {questions.length} on this module.</p>
          <p>Your total accumulated score is {totalScore}.</p>
        </div>
      )}
    </div>
  );
}
