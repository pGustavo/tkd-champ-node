const express = require('express');
const router = express.Router();
const championshipsController = require('../controllers/championshipController');

router.post('/championship', championshipsController.createChampionship);
router.get('/championship/:id', championshipsController.getChampionshipById);
router.put('/championship/:id', championshipsController.updateChampionship);
router.get('/championships', championshipsController.getAllChampionships);

module.exports = router;