const router   = require('express').Router();
const authCtrl = require('../controller/auth.controller');

router.post('/register', authCtrl.register);
router.post('/login',    authCtrl.login);

module.exports = router;
