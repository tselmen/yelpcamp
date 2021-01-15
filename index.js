const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('./campgroundSchema')
const Review = require('./models/review')
// noinspection JSIgnoredPromiseFromCall
mongoose.connect('mongodb+srv://tselmen:a45bc374@idk.qw4hr.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log("Database connected")
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
  const {error} = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}
const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds})
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
});

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
  // if(!req.body.campground) throw new ExpressError('Invalid values', 400)

  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
  res.render('campgrounds/show', {campground})
}));

app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
  // noinspection JSUnresolvedVariable
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id)
  res.redirect('/campgrounds')
})

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review)
  campground.reviews.push(review)
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
  const {id, reviewId} = req.params
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
  await Review.findByIdAndRemove(reviewId)
  res.redirect(`/campgrounds/${id}`)
}))

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404))
})

app.use(function (err, req, res, next) {
  const {statusCode = 500, message = "Something went wrong"} = err
  res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
  console.log("Server started on port 3000")
});