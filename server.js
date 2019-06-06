const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const gm = require('gm');

const users = require('./routes/api/Users');

const app = express();
// Add path to images
app.use("/public", express.static(path.join(__dirname, 'public')));

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

// BodyParser
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// onnect to Mongo
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Use routes
app.use('/api/Users', users);

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server started on port ${port}`));