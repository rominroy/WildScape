if(process.env.NODE_ENV !=="production")
{
    require('dotenv').config();

}
const express = require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('connect-flash');
const ejsMate=require('ejs-mate')
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./models/user');

const ExpressError=require('./utils/ExpressError')
const methodOverride=require('method-override')
const Campground=require('./models/campground')
const Review=require('./models/review');

const userRoutes=require('./Routes/users')
const campgrounds=require('./Routes/campgrounds')
const reviews=require('./Routes/reviews');
const { request } = require('http');
const mongoSanitize=require('express-mongo-sanitize');
const { db } = require('./models/user');

const dbUrl=process.env.DB_URL||'mongodb://127.0.0.1:27017/yelp-camp';
const MongoDBStore=require("connect-mongo")(session);

mongoose.connect(dbUrl)
.then(()=>
{
    console.log("connection open")
})
.catch(()=>{
console.log("error")
console.log(dbUrl)
});

const secret= process.env.SECRET||'thisshouldbeabettersecret';
const store=new MongoDBStore(
    {
        url:dbUrl,
        secret,
        touchAfter:24*60*60
    }
)
store.on("error",function(e)
{
    console.log("session store error")
})
const sessionConfig=
{
    store,
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:
    {
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>
{
res.locals.currentUser=req.user;
res.locals.success=req.flash('success');
res.locals.error=req.flash('error');
next();
})


app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

app.use('/',userRoutes)
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize())

app.get('/',(req,res)=>
{
    res.render('home')
})


//app.get('/makecampground',async (req,res)=>
//{
   // const camp = new Campground({title:'mybackyard'});
   // await camp.save();
   // res.send(camp)
//})
app.all('*',(req,res,next)=>
{
    console.log(`Error: ${req.path} not found`);
    next(new ExpressError('pagenotfound',404))
})
app.use((err,req,res)=>
{
const{statusCode=500}=err;
if(!err.message) err.message='oh no something went wrong'
res.status(statusCode).render('error',{err});
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
