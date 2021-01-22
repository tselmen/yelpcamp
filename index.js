const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const campgroundsRoute = require('./routes/campgrounds')
const reviewsRoute = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
}))

app.get('/', (req, res) => {
  res.render('home')
});

app.use('/campgrounds', campgroundsRoute);
app.use('/campgrounds/:id/reviews', reviewsRoute);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use(function (err, req, res, next) {
  const {statusCode = 500, message = "Something went wrong"} = err;
  res.status(statusCode).render('error', {err});
});

app.listen(3000, () => {
  console.log("Server started on port 3000")
});