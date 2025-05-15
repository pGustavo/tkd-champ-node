const express = require('express');
const router = express.Router();
const championshipController = require('../controllers/championshipController');
const authenticateToken = require("../middlewares/authenticationToken");

router.post('/championships', authenticateToken, championshipController.createChampionship);
router.get('/championships', authenticateToken, championshipController.getAllChampionships);
router.get('/championships/active', authenticateToken, championshipController.getActiveChampionships);
router.get('/championships/:id', authenticateToken, championshipController.getChampionshipById);
router.put('/championships/:id', authenticateToken, championshipController.updateChampionship);
router.delete('/championships/:id', authenticateToken, championshipController.deleteChampionship);
router.patch('/championships/:id/status', authenticateToken, championshipController.updateChampionshipStatus);

module.exports = router;