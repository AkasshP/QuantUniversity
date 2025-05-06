const router     = require('express').Router({ mergeParams: true });
const moduleCtrl = require('../controller/module.controller');
const auth       = require('../middleware/auth');
const mc     = require('../controller/module.controller');
router.get('/:moduleId',            auth, moduleCtrl.getModule);
router.post('/:moduleId/complete',  auth, moduleCtrl.complete);
router.post(
    '/subscribe-module/:moduleId',  // front end POSTs to
    auth,
    moduleCtrl.purchaseModule
  )
router.get('/:moduleId/quiz', auth, mc.getQuiz);
module.exports = router;
