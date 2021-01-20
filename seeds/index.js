const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors,places} = require('./seedHelpers');
const Campground = require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
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
const sample = (array)=>{
    return array[Math.floor(Math.random() * array.length)];
}
const SeedDb = async()=>{
    await Campground.deleteMany({});
    for(let i = 0 ;i<350;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const newCamp = new Campground({
            author:'5ffb289d75cb580bc0bf123b',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            geometry:{
                type:'Point',
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae unde dicta nam amet alias id, eligendi pariatur excepturi eveniet, nulla reprehenderit tenetur maxime, voluptate asperiores deleniti exercitationem ut consequatur esse.',
            price
        })
        newCamp.images.push(
            {
                url: 'https://res.cloudinary.com/dionb6owj/image/upload/v1610648479/YelpCamp/sy2vsjbmvtybgewi5v0c.jpg',
                filename: 'YelpCamp/sy2vsjbmvtybgewi5v0c'
              },
              {
                
                url: 'https://res.cloudinary.com/dionb6owj/image/upload/v1610648479/YelpCamp/lgdt5cc62lvltdvg8ttc.jpg',
                filename: 'YelpCamp/lgdt5cc62lvltdvg8ttc'
              },
              {
               
                url: 'https://res.cloudinary.com/dionb6owj/image/upload/v1610729847/YelpCamp/suug1wspwwzgcvpwitee.jpg',
                filename: 'YelpCamp/suug1wspwwzgcvpwitee'
              }
        )
        await newCamp.save();    
    }
}
SeedDb().then((d)=>{
db.close()
})