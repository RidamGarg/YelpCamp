const Campground = require('./models/campground');
const {campgroundSchema,reviewSchema} = require('./schema');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
module.exports.isLoggedin = (req,res,next)=>{
 if(!req.isAuthenticated()){// check whether the user is login or not
        req.session.returnTo = req.originalUrl ; //give original path at this time;
        req.flash('error','You must be logged in');
        return res.redirect('/login');
    }
    next();
}
module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
      req.flash('error',"You don't have permission to do that");
      return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.ValidateCampground = (req,res,next)=>{
    const{error}=campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}
module.exports.ValidateReviewSchema = (req,res,next)=>{
    const{error}=reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
      req.flash('error',"You don't have permission to do that");
      return res.redirect(`/campgrounds/${id}`);
    }
    next();
}