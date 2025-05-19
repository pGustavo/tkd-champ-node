// routes/poomsaeRoutes.js
const express = require('express');
const router = express.Router();
const poomsaeController = require('../controllers/poomsaeController');
const authenticateToken = require("../middlewares/authenticationToken");

/**
 * @swagger
 * /api/poomsae/draw:
 *   post:
 *     summary: Creates a new poomsae draw
 *     tags:
 *       - Poomsae
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               championshipId:
 *                 type: integer
 *                 description: ID of the championship
 *                 example: 1
 *               athletes:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of athlete IDs
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Poomsae draw created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/draw', authenticateToken, poomsaeController.createDraw);

/**
 * @swagger
 * /api/poomsae/draw:
 *   get:
 *     summary: Retrieves all poomsae draws
 *     tags:
 *       - Poomsae
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of poomsae draws retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/draw', authenticateToken, poomsaeController.getAllDraws);

/**
 * @swagger
 * /api/poomsae/draw/championship/{championshipId}:
 *   get:
 *     summary: Retrieves poomsae draws by championship ID
 *     tags:
 *       - Poomsae
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: championshipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the championship
 *     responses:
 *       200:
 *         description: Poomsae draws retrieved successfully
 *       404:
 *         description: Championship not found
 *       500:
 *         description: Internal server error
 */
router.get('/draw/championship/:championshipId', authenticateToken, poomsaeController.getDrawsByChampionshipId);

/**
 * @swagger
 * /api/poomsae/draw/championship/{championshipId}:
 *   put:
 *     summary: Updates a poomsae draw by championship ID
 *     tags:
 *       - Poomsae
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: championshipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the championship
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               athletes:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Updated list of athlete IDs
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Poomsae draw updated successfully
 *       404:
 *         description: Championship not found
 *       500:
 *         description: Internal server error
 */
router.put('/draw/championship/:championshipId', authenticateToken, poomsaeController.updateDrawByChampionshipId);

/**
 * @swagger
 * /api/poomsae/draw/championship/{championshipId}:
 *   delete:
 *     summary: Deletes a poomsae draw by championship ID
 *     tags:
 *       - Poomsae
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: championshipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the championship
 *     responses:
 *       200:
 *         description: Poomsae draw deleted successfully
 *       404:
 *         description: Championship not found
 *       500:
 *         description: Internal server error
 */
router.delete('/draw/championship/:championshipId', authenticateToken, poomsaeController.deleteDrawByChampionshipId);

module.exports = router;