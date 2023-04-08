const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {username:'', email: '', password: ''};

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // username conflict/username duplicate
    if (err.message === 'username conflict') {
        errors.username = 'That username is already registered';
    }

    // duplicate email
    if(err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    // valdation errors
    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(properties);
            errors[properties.path] = properties.message;
        })
    }

    // password reset errors
    if (err.message === 'email not found') {
        errors.email = 'That email is not registered';
    }

    if (err.message === 'password length error') {
        errors.password = 'Minimum password length is 6 characters';
    }

    return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: maxAge
    });
};

const signup_post = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await User.signup(username);
        const user = await User.create({ username, email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    } 
}

const login_post = async (req, res) => {
    const  { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

const forgetpassemail_post = async (req, res) => {
    const  { email } = req.body;
    try {
        const user = await User.confirmemail(email);
        res.status(200).json({ id: user.id });
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const resetpass_patch = async (req, res) => {
    const id = req.params.id;
    const password = req.body.password;

    try {
        await User.passwordvalidation(password);
        const salt = await bcrypt.genSalt();
        const newpassword = await bcrypt.hash(password, salt);  
        let updates = { password: newpassword };

        const user = await User.findByIdAndUpdate(id, updates)
        res.status(200).json({ id: user.id });
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports = {
    signup_post, 
    login_post, 
    logout_get,
    forgetpassemail_post,
    resetpass_patch
}