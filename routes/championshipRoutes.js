// routes/championshipRoutes.js
const express = require('express');
const router = express.Router();
const championshipController = require('../controllers/championshipController');
const authenticateToken = require('../middlewares/authenticationToken');

/**
 * @swagger
 * /api/championship:
 *   post:
 *     summary: Creates a new championship
 *     tags:
 *       - Championships
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
 *                 description: Championship name
 *                 example: National Taekwondo Championship
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Championship date
 *                 example: 2023-12-01
 *               location:
 *                 type: string
 *                 description: Championship location
 *                 example: Seoul, South Korea
 *     responses:
 *       201:
 *         description: Championship created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/championship', authenticateToken, championshipController.createChampionship);

/**
 * @swagger
 * /api/championships:
 *   get:
 *     summary: Retrieves all championships
 *     tags:
 *       - Championships
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of championships retrieved successfully
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
 *                     example: National Taekwondo Championship
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2023-12-01
 *                   location:
 *                     type: string
 *                     example: Seoul, South Korea
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/championships', authenticateToken, championshipController.getAllChampionships);

/**
 * @swagger
 * /api/championship/active:
 *   get:
 *     summary: Retrieves active championships
 *     tags:
 *       - Championships
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active championships retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/championship/active', authenticateToken, championshipController.getActiveChampionships);

/**
 * @swagger
 * /api/championship/{id}:
 *   get:
 *     summary: Retrieves a championship by ID
 *     tags:
 *       - Championships
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Championship ID
 *     responses:
 *       200:
 *         description: Championship retrieved successfully
 *       404:
 *         description: Championship not found
 *       500:
 *         description: Internal server error
 */
router.get('/championship/:id', authenticateToken, championshipController.getChampionshipById);

/**
 * @swagger
 * /api/championship/{id}:
 *   put:
 *     summary: Updates a championship by ID
 *     tags:
 *       - Championships
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Championship ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated championship name
 *                 example: Updated Championship Name
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Updated championship date
 *                 example: 2023-12-15
 *               location:
 *                 type: string
 *                 description: Updated championship location
 *                 example: Busan, South Korea
 *     responses:
 *       200:
 *         description: Championship updated successfully
 *       404:
 *         description: Championship not found
 *       500:
 *         description: Internal server error
 */
router.put('/championship/:id', authenticateToken, championshipController.updateChampionship);

/**
 * @swagger
 * /api/championship/{id}:
 *   delete:
 *     summary: Deletes a championship by ID
 *     tags:
 *       - Championships
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Championship ID
 *     responses:
 *       200:
 *         description: Championship deleted successfully
 *       404:
 *         description: Championship not found
 *       500:
 *         description: Internal server error
 */
router.delete('/championship/:id', authenticateToken, championshipController.deleteChampionship);

/**
 * @swagger
 * /api/championship/{id}/status:
 *   patch:
 *     summary: Updates the status of a championship by ID
 *     tags:
 *       - Championships
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Championship ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the championship
 *                 example: Active
 *     responses:
 *       200:
 *         description: Championship status updated successfully
 *       404:
 *         description: Championship not found
 *       500:
 *         description: Internal server error
 */
router.patch('/championship/:id/status', authenticateToken, championshipController.updateChampionshipStatus);

module.exports = router;