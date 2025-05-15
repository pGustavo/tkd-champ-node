const express = require('express');
const router = express.Router();
const championshipController = require('../controllers/championshipController');
const authenticateToken = require("../middlewares/authenticationToken");

router.post('/championship', authenticateToken, championshipController.createChampionship);
router.get('/championships', authenticateToken, championshipController.getAllChampionships);
router.get('/championship/active', authenticateToken, championshipController.getActiveChampionships);
router.get('/championship/:id', authenticateToken, championshipController.getChampionshipById);
router.put('/championship/:id', authenticateToken, championshipController.updateChampionship);
router.delete('/championship/:id', authenticateToken, championshipController.deleteChampionship);
router.patch('/championship/:id/status', authenticateToken, championshipController.updateChampionshipStatus);

module.exports = router;