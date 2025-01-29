const express = require('express');
const { Signup, Login, AllUsers, forgotPassword, resetPassword } = require('../controller/userController');
const isAuthenticated = require('../middleware/jwt');
const validation = require('../Helper/validator');
const upload = require('../middleware/multer');


const router = express.Router();

router.post('/signup',upload.single('image'), validation, Signup);
router.post('/login', Login )
router.get('/find',isAuthenticated, AllUsers)
router.post('/forgotpassword',forgotPassword)
router.post('/resetpass/:token',resetPassword)


module.exports = router
