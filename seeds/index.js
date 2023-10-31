const mongoose=require('mongoose');
const cities=require('./cities');
const{places,descriptors}=require('./seedHelpers')
const Campground=require('../models/campground')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>
{
    console.log("connection open")
})
.catch(err=>{
console.log("error")
});
const sample = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const seedFunction=async()=>
{
await Campground.deleteMany({});
for( let i=0;i<200;i++)
{
const random1000=Math.floor(Math.random()*1000)
const prices=Math.floor(Math.random()*20)+10;
const camp=new Campground({
    author:'6535cdcdd25539f2ca339230',
    location:`${cities[random1000].city},${cities[random1000].state}`,
    title:`${sample(descriptors)} ${sample(places)}`,
    geometry:
    {type: 'Point',
    coordinates:[cities[random1000].longitude,
    cities[random1000].latitude,]
},
    images:[
        {
          url: 'https://res.cloudinary.com/dxnsofddg/image/upload/v1698362680/WildScape/es5lrdj9dg7pccbldsce.png',
          filename: 'es5lrdj9dg7pccbldsce',
          
        },
        {
          url: 'https://res.cloudinary.com/dxnsofddg/image/upload/v1698363500/WildScape/xofapvw37vmnujwjj4xs.webp',
          filename: 'WildScape/xofapvw37vmnujwjj4xs',
          
        },
        {
          url: 'https://res.cloudinary.com/dxnsofddg/image/upload/v1698354490/WildScape/t0canj5mr1vioeolqbyq.jpg',
          filename: 'WildScape/t0canj5mr1vioeolqbyq',
          
        },
        {
          url: 'https://res.cloudinary.com/dxnsofddg/image/upload/v1698354490/WildScape/gbd25kglvt6fudkn6wmo.jpg',
          filename: 'WildScape/gbd25kglvt6fudkn6wmo',
        
        }
      ],
    description: 'The world beyond your imaginations',
    price:`${prices}`
})
await camp.save();
}
}
seedFunction().then(()=>
{
   mongoose.connection.close();
})