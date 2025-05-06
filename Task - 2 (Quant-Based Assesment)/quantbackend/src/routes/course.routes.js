// File: backend/routes/course.routes.js

const router                   = require('express').Router();
const auth                     = require('../middleware/auth');
const courseCtrl               = require('../controller/course.controller');
const certificateController    = require('../controller/certificate.controller');
const progressRoutes           = require('./progress.routes');

// Course listing & detail
router.get('/',                auth, courseCtrl.getAll);
router.get('/:courseId',       auth, courseCtrl.getDetail);

// Purchase & subscribe
router.post('/upgrade/premium',                      auth, courseCtrl.upgradePremium);
router.post('/:courseId/subscribe-module/:moduleId', auth, courseCtrl.subscribeModule);

// Mount quiz‐submission routes
router.use(
  '/:courseId/modules',
  auth,
  progressRoutes
);

// Certificate status & download
router.get(
  '/:courseId/certificate',
  auth,
  certificateController.getCertificate
);
router.get(
  '/:courseId/certificate/download',
  auth,
  certificateController.downloadCertificate
);

module.exports = router;
