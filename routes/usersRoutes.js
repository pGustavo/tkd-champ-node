const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/usersController');
const authenticateToken = require("../middlewares/authenticationToken");

const router = express.Router();

router.get('/users', authenticateToken,  getAllUsers);
router.post('/register', authenticateToken, createUser);
router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);

module.exports = router;