const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/login', authController.login);

router.post('/register', [verifyToken, verifyAdmin] ,authController.registerUser);

module.exports = router;
