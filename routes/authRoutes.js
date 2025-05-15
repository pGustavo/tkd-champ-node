const express = require('express');
const { login, getAuthUser} = require('../controllers/authController');
const authenticateToken = require("../middlewares/authenticationToken");
const router = express.Router();

router.post('/login', login);
router.get('/auth-user', authenticateToken, getAuthUser);

module.exports = router;