const express = require('express');
const { AdminSignup, AdminLogin } = require('../controller/adminController');
const router = express.Router();

router.post('/signup', AdminSignup);
router.post('/login', AdminLogin);


module.exports = router;