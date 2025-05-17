// routes/tatamiRoutes.js
const express = require('express');
const router = express.Router();
const tatamiController = require('../controllers/tatamiController');
const authenticateToken = require('../middlewares/authenticationToken');

/**
 * @swagger
 * /api/tatamis/championship/{championshipId}:
 *   post:
 *     summary: Creates a new tatami for a championship
 *     tags:
 *       - Tatamis
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
 *               name:
 *                 type: string
 *                 description: Name of the tatami
 *                 example: Tatami 1
 *     responses:
 *       201:
 *         description: Tatami created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/tatamis/championship/:championshipId', authenticateToken, tatamiController.createTatami);

/**
 * @swagger
 * /api/tatamis:
 *   get:
 *     summary: Retrieves all tatamis
 *     tags:
 *       - Tatamis
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tatamis retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/tatamis', authenticateToken, tatamiController.getAllTatamis);

/**
 * @swagger
 * /api/tatamis/championship/{championshipId}:
 *   get:
 *     summary: Retrieves tatamis by championship ID
 *     tags:
 *       - Tatamis
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
 *         description: List of tatamis retrieved successfully
 *       404:
 *         description: Championship not found
 *       500:
 *         description: Internal server error
 */
router.get('/tatamis/championship/:championshipId', authenticateToken, tatamiController.getTatamisByChampionshipId);

/**
 * @swagger
 * /api/tatamis/championship/{championshipId}/batch:
 *   post:
 *     summary: Creates or updates multiple tatamis for a championship
 *     tags:
 *       - Tatamis
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
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the tatami
 *                   example: Tatami 1
 *     responses:
 *       200:
 *         description: Tatamis created or updated successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/tatamis/championship/:championshipId/batch', authenticateToken, tatamiController.createOrUpdateMultipleTatamis);

/**
 * @swagger
 * /api/tatamis/{id}/referees:
 *   patch:
 *     summary: Updates referees for a specific tatami
 *     tags:
 *       - Tatamis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the tatami
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referees:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of referee IDs
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Referees updated successfully
 *       404:
 *         description: Tatami not found
 *       500:
 *         description: Internal server error
 */
router.patch('/tatamis/:id/referees', authenticateToken, tatamiController.updateTatamiReferees);

/**
 * @swagger
 * /api/tatamis/{id}:
 *   get:
 *     summary: Retrieves a specific tatami by ID
 *     tags:
 *       - Tatamis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the tatami
 *     responses:
 *       200:
 *         description: Tatami retrieved successfully
 *       404:
 *         description: Tatami not found
 *       500:
 *         description: Internal server error
 */
router.get('/tatamis/:id', authenticateToken, tatamiController.getTatamiById);

/**
 * @swagger
 * /api/tatamis/{id}:
 *   put:
 *     summary: Updates a specific tatami by ID
 *     tags:
 *       - Tatamis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the tatami
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the tatami
 *                 example: Tatami 2
 *     responses:
 *       200:
 *         description: Tatami updated successfully
 *       404:
 *         description: Tatami not found
 *       500:
 *         description: Internal server error
 */
router.put('/tatamis/:id', authenticateToken, tatamiController.updateTatami);

/**
 * @swagger
 * /api/tatamis/{id}:
 *   delete:
 *     summary: Deletes a specific tatami by ID
 *     tags:
 *       - Tatamis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the tatami
 *     responses:
 *       200:
 *         description: Tatami deleted successfully
 *       404:
 *         description: Tatami not found
 *       500:
 *         description: Internal server error
 */
router.delete('/tatamis/:id', authenticateToken, tatamiController.deleteTatami);

/**
 * @swagger
 * /api/tatamis/championship/{championshipId}/tatami/{tatamiId}/assign-referee:
 *   post:
 *     summary: Assigns a referee to a specific tatami
 *     tags:
 *       - Tatamis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: championshipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the championship
 *       - in: path
 *         name: tatamiId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the tatami
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refereeId:
 *                 type: integer
 *                 description: ID of the referee
 *                 example: 1
 *     responses:
 *       200:
 *         description: Referee assigned successfully
 *       404:
 *         description: Tatami or referee not found
 *       500:
 *         description: Internal server error
 */
router.post('/tatamis/championship/:championshipId/tatami/:tatamiId/assign-referee', authenticateToken, tatamiController.assignRefereeToTatami);

module.exports = router;