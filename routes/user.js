const express = require('express');
const router = express.Router();
const User = require('../models/user');
const users = require('../controller/user');
const passport = require('passport');
router.route('/register')
.get(users.renderRegister)
.post(users.Register)
router.route('/login')
.get(users.renderLogin)
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.Login)//passport function helps in authenticate user at local,it can be goggle or tweeter.
router.get('/logout',users.Logout)
module.exports = router ;