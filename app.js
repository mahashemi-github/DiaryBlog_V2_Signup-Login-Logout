const express = require('express');
const mongoose = require('mongoose');
const allRoutes = require('./routes/allRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// express app
const app = express();

// middleware & static files
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//register view engine
app.set('view engine', 'ejs'); 

// connect to mongodb
const PORT = 3000 || process.env.PORT;
const dbURI = 'mongodb://127.0.0.1:27017/bookestore';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify:false })
.then(result => {
    app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}...`)});
    console.log('connected to db');
})
.catch(err => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => { res.redirect('/blogs')});
app.get('/loginsignup', (req, res) => res.render('loginsignup', {title: 'login-signup'}));
app.get('/create', requireAuth, (req, res) => res.render('create', {title: 'Create a New Blog'}));
app.use(allRoutes);  
app.use((req, res) => { res.status(404).render('404', { title: '404' })});
