const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedsHelper");
const nodeFetch = require("node-fetch")

mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "600e7eb3213f4e3788bb0294",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random].city}, ${cities[random].state}`,
      images: [
        {
          url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
          filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
        },
        {
          url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
          filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
        }
      ],
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi, quaerat ex a debitis tempora amet exercitationem dolor obcaecati sunt nam provident totam delectus, similique magnam! Eveniet sit tempore distinctio tempora?",
      price: price,
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});