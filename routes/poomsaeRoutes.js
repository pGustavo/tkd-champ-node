const express = require('express');
const router = express.Router();
const poomsaeController = require('../controllers/poomsaeController');

// Criar um novo sorteio de poomsae
router.post('/draw', poomsaeController.createDraw);

// Obter todos os sorteios de poomsae
router.get('/draw', poomsaeController.getAllDraws);

// Obter sorteio por ID do campeonato
router.get('/draw/championship/:championshipId', poomsaeController.getDrawsByChampionshipId);

// Atualizar um sorteio de poomsae por ID do campeonato
router.put('/draw/championship/:championshipId', poomsaeController.updateDrawByChampionshipId);

// Excluir um sorteio de poomsae por ID do campeonato
router.delete('/draw/championship/:championshipId', poomsaeController.deleteDrawByChampionshipId);

module.exports = router;