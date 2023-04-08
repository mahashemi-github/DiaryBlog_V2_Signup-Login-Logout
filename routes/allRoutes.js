const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

var app = express()
app.use(express.json());
const router = express.Router();

router.get('/blogs', blogController.blog_index);
router.post('/blogs', blogController.blog_create_post);
router.delete('/blogs/:id', blogController.blog_delete);

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.post('/forgetpassemail', authController.forgetpassemail_post);
router.patch('/resetpass/:id', authController.resetpass_patch);

module.exports = router;