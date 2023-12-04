const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller')

router.route('/api/login').post(passport.authenticate('local', { session: false }), authController.login);
router.route('/api/register').post(authController.validationChecks, authController.register);
router.route('/api/adminregister').post(passport.authenticate('jwt', { session: false }), authController.validationChecks, authController.adminregister);
router.route('/api/adminregisterdev').post(authController.validationChecks, authController.adminregisterdev);

module.exports = router;