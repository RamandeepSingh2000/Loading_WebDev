const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller')

router.route('/api/login').post(passport.authenticate('local', { session: false }), authController.login);
router.route('/api/register').post(authController.register);

module.exports = router;