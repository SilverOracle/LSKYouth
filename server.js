const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const gm = require('gm');

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');

const app = express();
// Add path to images
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname + 'views')));

app.set('view engine', 'pug');

// Navigation
app.get('/', function (req, res) { 
    res.render('index.pug');
});
app.get('/news', function (req, res) { 
    res.render('news.pug');
});
app.get('/about', function (req, res) { 
    res.render('about.pug');
});
app.get('/services', function (req, res) { 
    res.render('services.pug');
});
app.get('/projects', function (req, res) { 
    res.render('projects.pug');
});
app.get('/contacts', function (req, res) { 
    res.render('contacts.pug');
});

app.get('/login', function (req, res) { 
    res.render('./user/login.pug');
});
app.get('/register', function (req, res) { 
    res.render('./user/signup.pug');
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
app.use('/api/posts', posts);

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server running on port ${port}`));