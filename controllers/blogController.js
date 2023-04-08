const Blog = require('../models/blog');
var express = require('express');

var app = express();
app.use(express.json());

const blog_index = (req, res) => { 
    Blog.find().sort({ createdAt: -1 })
    .then(result => {
        res.render('index', { blogs: result, title: 'All blogs'});
    })
    .catch(err => {
        console.log(err);
    });
}

const blog_create_post = (req, res) => {
    // console.log(req.body);
    const blog = new Blog(req.body);

    blog.save()
    .then(result => {
        res.redirect('/blogs');
    })
    .catch(err => {
        console.log(err);
    });
}

const blog_delete = (req, res) => {
    const id = req.params.id;
    // console.log(req.params.id);

    Blog.findByIdAndDelete(id)
    .then(result => {
        res.json({ redirect: '/blogs' });
    })
    .catch(err => {
        console.log(err);
    });
}

module.exports = {
    blog_index, 
    blog_create_post, 
    blog_delete
}