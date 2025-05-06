// File: backend/routes/progress.routes.js

const router        = require('express').Router({ mergeParams: true });
const auth          = require('../middleware/auth');
const progressCtrl  = require('../controller/progress.controller');

/**
 * POST /api/courses/:courseId/modules/:moduleId/quiz
 * Grades the quiz, updates moduleProgress, recalculates totalScore.
 */
router.post(
  '/:moduleId/quiz',
  auth,
  progressCtrl.submitModuleQuiz
);

module.exports = router;
