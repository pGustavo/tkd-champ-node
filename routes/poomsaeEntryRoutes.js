// routes/poomsaeEntryRoutes.js
const express = require('express');
const router = express.Router();
const poomsaeEntryController = require('../controllers/poomsaeEntryController');
const authenticateToken = require("../middlewares/authenticationToken");

/**
 * @swagger
 * /api/entries/poomsae-entries/championship/{championshipId}:
 *   post:
 *     summary: Creates new poomsae entries for a championship
 *     tags:
 *       - Poomsae Entries
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
 *               entries:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     athleteId:
 *                       type: integer
 *                       description: ID of the athlete
 *                       example: 1
 *                     category:
 *                       type: string
 *                       description: Competition category
 *                       example: Senior
 *     responses:
 *       201:
 *         description: Entries created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/entries/poomsae-entries/championship/:championshipId', authenticateToken, poomsaeEntryController.createEntries);

/**
 * @swagger
 * /api/entries/poomsae-entries:
 *   get:
 *     summary: Retrieves all poomsae entries
 *     tags:
 *       - Poomsae Entries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of poomsae entries retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/entries/poomsae-entries', authenticateToken, poomsaeEntryController.getAllEntries);

/**
 * @swagger
 * /api/entries/poomsae-entries/championship/{championshipId}:
 *   get:
 *     summary: Retrieves poomsae entries by championship ID
 *     tags:
 *       - Poomsae Entries
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
 *         description: List of poomsae entries retrieved successfully
 *       404:
 *         description: Championship not found
 *       500:
 *         description: Internal server error
 */
router.get('/entries/poomsae-entries/championship/:championshipId', authenticateToken, poomsaeEntryController.getEntriesByChampionshipId);

/**
 * @swagger
 * /api/entries/poomsae-entries/entry-code/{entryCode}:
 *   get:
 *     summary: Retrieves poomsae entries by entry code
 *     tags:
 *       - Poomsae Entries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entryCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Entry code
 *     responses:
 *       200:
 *         description: Poomsae entry retrieved successfully
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Internal server error
 */
router.get('/entries/poomsae-entries/entry-code/:entryCode', authenticateToken, poomsaeEntryController.getEntriesByEntryCode);

/**
 * @swagger
 * /api/entries/poomsae-entries/locked/{locked}:
 *   get:
 *     summary: Retrieves poomsae entries by locked status
 *     tags:
 *       - Poomsae Entries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locked
 *         required: true
 *         schema:
 *           type: boolean
 *         description: Locked status of the entries
 *     responses:
 *       200:
 *         description: List of poomsae entries retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/entries/poomsae-entries/locked/:locked', authenticateToken, poomsaeEntryController.getEntriesByLocked);

/**
 * @swagger
 * /api/entries/poomsae-entries/{id}:
 *   get:
 *     summary: Retrieves a specific poomsae entry by ID
 *     tags:
 *       - Poomsae Entries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the poomsae entry
 *     responses:
 *       200:
 *         description: Poomsae entry retrieved successfully
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Internal server error
 */
router.get('/entries/poomsae-entries/:id', authenticateToken, poomsaeEntryController.getEntryById);

/**
 * @swagger
 * /api/entries/poomsae-entries/championship/{championshipId}:
 *   put:
 *     summary: Updates poomsae entries for a championship
 *     tags:
 *       - Poomsae Entries
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
 *               entries:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     athleteId:
 *                       type: integer
 *                       description: ID of the athlete
 *                       example: 1
 *                     category:
 *                       type: string
 *                       description: Competition category
 *                       example: Senior
 *     responses:
 *       200:
 *         description: Entries updated successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.put('/entries/poomsae-entries/championship/:championshipId', authenticateToken, poomsaeEntryController.updateEntries);

module.exports = router;