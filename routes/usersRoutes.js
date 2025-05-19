// routes/usersRoutes.js
const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/usersController');
const authenticateToken = require("../middlewares/authenticationToken");

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieves all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     example: john.doe@example.com
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/users', authenticateToken, getAllUsers);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Creates a new user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/register', authenticateToken, createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Updates a user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the user
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 description: Updated email of the user
 *                 example: jane.doe@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/users/:id', authenticateToken, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deletes a user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/users/:id', authenticateToken, deleteUser);

module.exports = router;