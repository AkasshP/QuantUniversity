// File: src/routes/certificate.routes.js
const router           = require('express').Router();
const auth             = require('../middleware/auth');
const certController   = require('../controller/certificate.controller');

router.get('/:courseId', auth, certController.getCertificate);

module.exports = router;
