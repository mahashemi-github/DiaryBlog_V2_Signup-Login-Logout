const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
}, {timestamps: true});

// hash password before doc saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);  
    next();
});

// static method to signup user
userSchema.statics.signup = async function(username) {
    const duplicate = await this.findOne({ username });
    if (duplicate) throw Error('username conflict');
};

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });  
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

// static method to confirm the user's email to allow password reset
userSchema.statics.confirmemail = async function(email) {
    const user = await this.findOne({ email });
    if (user) {
        return user;
    } else {    
        throw Error('email not found');
    }
};

// static method to confirm the new password validation to allow password reset
userSchema.statics.passwordvalidation = async function(password) {
    if ( password.length < 6 ) {
        throw Error('password length error');
    } 
};

const User = mongoose.model('user', userSchema);
module.exports = User;