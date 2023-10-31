const catchAsync=require('../utils/catchAsync')
const User=require('../models/user');
const passport=require('passport')

module.exports.registerUser=async(req,res)=>
{
try{
const{email,username,password}=req.body;
const user=new User({email,username});
const registeredUser=await User.register(user,password);
req.login(registeredUser,err=>{
    if(err)
    return next(err);
    req.flash('success','welcome to the yelp camp');
res.redirect('/campgrounds')
})
}catch(e){
req.flash('error',e.message);
res.redirect('/register');
}
}

module.exports.renderRegister=(req,res)=>
{
 res.render('./users/register')   
}

module.exports.loginUser=(req,res)=>
{
    res.render('./users/login')
}

module.exports.loginAuthenticate=(req,res)=>
{
req.flash('success','welcome back')
const redirectUrl=req.session.returnTo || '/campgrounds';
delete req.session.returnTo;
res.redirect(redirectUrl)
}

module.exports.logout=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}