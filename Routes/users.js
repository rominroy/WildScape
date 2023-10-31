const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync')
const User=require('../models/user');
const passport=require('passport')
const users=require('../controllers/users')

router.get('/register',users.renderRegister);
router.post('/register',catchAsync(users.registerUser));
router.get('/login',users.loginUser)
router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),users.loginAuthenticate)

router.get('/logout', users.logout); 

module.exports=router;