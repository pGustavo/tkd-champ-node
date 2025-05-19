// routes/athletesRoutes.js
const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athletesController');
const authenticateToken = require('../middlewares/authenticationToken');

/**
 * @swagger
 * /api/athletes:
 *   post:
 *     summary: Creates a new athlete
 *     tags:
 *       - Athletes
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
 *                 description: Athlete's name
 *                 example: John Doe
 *               age:
 *                 type: integer
 *                 description: Athlete's age
 *                 example: 25
 *               category:
 *                 type: string
 *                 description: Competition category
 *                 example: Senior
 *     responses:
 *       201:
 *         description: Athlete created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/athletes', authenticateToken, athleteController.saveAthletes);

/**
 * @swagger
 * /api/athletes:
 *   get:
 *     summary: Retrieves all athletes
 *     tags:
 *       - Athletes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of athletes retrieved successfully
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
 *                   age:
 *                     type: integer
 *                     example: 25
 *                   category:
 *                     type: string
 *                     example: Senior
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/athletes', authenticateToken, athleteController.getAllAthletes);

module.exports = router;