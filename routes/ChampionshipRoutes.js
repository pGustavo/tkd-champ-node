const express = require('express');
const router = express.Router();
const championshipsController = require('../controllers/championshipController');

router.post('/championship', championshipsController.createChampionship);
router.get('/championship/:id', championshipsController.getChampionshipById);

module.exports = router;