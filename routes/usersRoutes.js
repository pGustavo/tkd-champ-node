const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/usersController');

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/register', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;