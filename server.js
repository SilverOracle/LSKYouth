const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const config = require('config');
const fs = require('fs');
const gm = require('gm');

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');

const app = express();
// Add path to images
app.use("/public", express.static(path.join(__dirname, 'public')));

//app.use(express.static(path.join(__dirname + 'views')));

app.set('view engine', 'pug');

// Navigation
app.get('/', function (req, res) { 
    res.render('index.pug');
});
app.get('/views/home.pug', function (req, res) { 
    res.render('home.pug');
});
app.get('/views/news.pug', function (req, res) { 
    res.render('news.pug');
});
app.get('/views/about.pug', function (req, res) { 
    res.render('about.pug');
});
app.get('/views/services.pug', function (req, res) { 
    res.render('services.pug');
});
app.get('/views/projects.pug', function (req, res) { 
    res.render('projects.pug');
});
app.get('/views/contacts.pug', function (req, res) { 
    res.render('contacts.pug');
});

app.get('/views/user/signup.pug', function (req, res) { 
    res.render('signup.pug');
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = config.get('mongoURI');

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true }) // Removed deprecation warrning
  .then(() => console.log('MongoDB Connected'))
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