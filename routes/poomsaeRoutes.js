const express = require('express');
const router = express.Router();
const poomsaeController = require('../controllers/poomsaeController');
const authenticateToken = require("../middlewares/authenticationToken");

// Criar um novo sorteio de poomsae
router.post('/draw', authenticateToken, poomsaeController.createDraw);

// Obter todos os sorteios de poomsae
router.get('/draw', authenticateToken, poomsaeController.getAllDraws);

// Obter sorteio por ID do campeonato
router.get('/draw/championship/:championshipId', authenticateToken, poomsaeController.getDrawsByChampionshipId);

// Atualizar um sorteio de poomsae por ID do campeonato
router.put('/draw/championship/:championshipId', authenticateToken, poomsaeController.updateDrawByChampionshipId);

// Excluir um sorteio de poomsae por ID do campeonato
router.delete('/draw/championship/:championshipId', authenticateToken, poomsaeController.deleteDrawByChampionshipId);

module.exports = router;