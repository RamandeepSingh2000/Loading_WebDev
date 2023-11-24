const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller')

router.route('/login').post(passport.authenticate('local', { session: false }), authController.login);
router.route('/register').post(authController.register);

module.exports = router;