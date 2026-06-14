const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const Local = require('passport-local');
const {saveRedirectUrl} = require('../middleware.js');
const userController = require('../controllers/users.js');

// user signup From
// user signup
router.route('/signup')
    .get(userController.signupForm)
    .post(wrapAsync(userController.signup))

// login user form
// login user
router.route('/login')
    .get(userController.loginForm)
    .post(saveRedirectUrl ,passport.authenticate('local', {failureRedirect : "/login", failureFlash : true}) ,userController.login);

router.get('/logout', userController.logout);

module.exports = router;