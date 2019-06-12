const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const gm = require('gm');

const users = require('./routes/api/users');
const articles = require('./routes/api/articles');
const reportages = require('./routes/api/reportages');
const events = require('./routes/api/events');
const app = express();
// Add path to images
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname + 'views')));

app.set('view engine', 'pug');

// Navigation
app.get('/', function (req, res) { 
    res.render('index');
});
app.get('/news', function (req, res) { 
    res.render('news');
});
app.get('/about', function (req, res) { 
    res.render('about');
});
app.get('/services', function (req, res) { 
    res.render('services');
});
app.get('/projects', function (req, res) { 
    res.render('projects');
});
app.get('/contacts', function (req, res) { 
    res.render('contacts');
});

app.get('/login', function (req, res) { 
    res.render('./user/login');
});
app.get('/register', function (req, res) { 
    res.render('./user/register');
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true }) // Removed deprecation warrning
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/articles', articles);
app.use('/api/reportages', reportages);
app.use('/api/events', events);

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server running on port ${port}`));