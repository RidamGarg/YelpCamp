
const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const Review = require('./review');
const ImageSchema = new Schema({
    url:String,
    filename:String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})
const opt = {
  toJSON:{
    virtuals:true
  }
}
const CampgroundSchema = new Schema({
    title:String,
    images:[ImageSchema],
    price:Number,
    location:String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    description:String,
    author:{
     type:Schema.Types.ObjectId,
     ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
},opt)
CampgroundSchema.virtual('properties.PopupMarkup').get(function(){
  return `<h3><a href='/campgrounds/${this._id}'>${this.title}</a></h3><p>${this.description.substring(0,30)}...</p>`
})
CampgroundSchema.post('findOneAndDelete',async(doc)=>{
    if(doc){
      await Review.deleteMany({
          _id:{
              $in:doc.reviews
          }
      })
    }
})
module.exports = mongoose.model('Campground',CampgroundSchema);
