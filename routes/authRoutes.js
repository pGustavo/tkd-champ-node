const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login); // Ensure this exists

module.exports = router;