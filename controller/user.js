const User = require('../models/user');
module.exports.renderRegister = async(req,res)=>{
    res.render('users/signup');
    }
module.exports.Register = async(req,res,next)=>{
    try{
    const{username,email,password}=req.body ;
    const user = new User({username,email});
    const newUser = await User.register(user,password);
    req.login(newUser,function(err){
        if(err){
            return next(err);
        }
        req.flash('success','Welcome to Yelp Camp!');
        res.redirect('/campgrounds')
    })
   }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
}
module.exports.renderLogin = (req,res)=>{ 
    res.render('users/signin');
}
module.exports.Login = async(req,res)=>{
    req.flash('success','Welcome Back');
    const redirect = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo ; 
    res.redirect(redirect);
}
module.exports.Logout = (req,res)=>{
    req.logout();
    req.flash('success','GoodBye');
    res.redirect('/campgrounds');
}