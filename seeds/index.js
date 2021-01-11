const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedsHelper');

mongoose.connect('mongodb+srv://tselmen:a45bc374@idk.qw4hr.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log("Database connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random].city}, ${cities[random].state}`,
            image: 'https://images.unsplash.com/photo-1484190812281-2387e3ae33a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxfDB8MXxyYW5kb218fHx8fHx8fA&ixlib=rb-1.2.1&q=80&w=1080',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi, quaerat ex a debitis tempora amet exercitationem dolor obcaecati sunt nam provident totam delectus, similique magnam! Eveniet sit tempore distinctio tempora?',
            price: price
        });
        await camp.save();
    }
};
seedDB().then(() => {
    mongoose.connection.close();
});