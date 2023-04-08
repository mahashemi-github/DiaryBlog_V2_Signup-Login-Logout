const jwt = require('jsonwebtoken');
const User = require('../models/User');

// in order to generate a unique ACCESS_TOKEN_SECRET, write this command in terminal 'node' and then this commandpress Enter:
// require('crypto').randomBytes(64).toString('hex')

// const crypto = require('crypto');
// const ACCESS_TOKEN_SECRET = crypto.randomBytes(64).toString('hex');

require('dotenv').config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
                // console.log(err.message);
                res.redirect('/loginsignup');
            } else {
                // console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/loginsignup');
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, checkUser };