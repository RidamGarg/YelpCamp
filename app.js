if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const userRouter = require('./routes/user');
const User = require('./models/user');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.dbUrl||'mongodb://localhost:27017/yelp-camp' ;
//'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log('we are connected!');
});
const secret = process.env.SECRET||'thisisbettersecret'
const store = new MongoStore({
    url:dbUrl,
    secret,
    touchAfter:24*60*60 //old data will be deleted(data:which user login)
})
const sessionConfig = {
    store,
    secret,
    name:'Session',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize());//aplicable on only query strings
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css',
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dionb6owj/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//Strategies range from verifying a username and password
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.get('/',(req,res)=>res.render('home'))
app.use('/campgrounds',campgroundRouter);
app.use('/campgrounds/:id/reviews',reviewRouter);
app.use('/',userRouter);

app.all('*',(req,res,next)=>{
 next(new ExpressError('Page Not Found',400))
})
app.use((err,req,res,next)=>{
    const{statusCode=500}=err;
    if(!err.message){
        err.message='Oh boy Something went wrong'
    }
    res.status(statusCode).render('error',{err});
})
const port = process.env.PORT||3000 ;
app.listen(port,()=>{
    console.log('Listening');
})

