const express = require('express');
const { Signup, Login, AllUsers, forgotPassword, resetPassword } = require('../controller/userController');
const isAuthenticated = require('../middleware/jwt');
const validation = require('../Helper/validator');


const router = express.Router();

router.post('/signup',validation, Signup);
router.post('/login', Login )
router.get('/find',isAuthenticated, AllUsers)
router.post('/forgotpassword',forgotPassword)
router.post('/resetpass/:token',resetPassword)


module.exports = router
