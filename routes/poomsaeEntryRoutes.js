const express = require('express');
const router = express.Router();
const poomsaeEntryController = require('../controllers/poomsaeEntryController');
const authenticateToken = require("../middlewares/authenticationToken");

// Criar uma nova entrada (com championshipId como parâmetro de URL)
router.post('/entries/poomsae-entries/championship/:championshipId', authenticateToken,  poomsaeEntryController.createEntries);

// Obter todas as entradas
router.get('/entries/poomsae-entries', authenticateToken, poomsaeEntryController.getAllEntries);

// Obter entradas por campeonato
router.get('/entries/poomsae-entries/championship/:championshipId', authenticateToken,  poomsaeEntryController.getEntriesByChampionshipId);

// Rotas com parâmetros específicos devem vir ANTES da rota com :id
// Obter entradas por código
router.get('/entries/poomsae-entries/entry-code/:entryCode', authenticateToken, poomsaeEntryController.getEntriesByEntryCode);

// Obter entradas por árbitro
router.get('/entries/poomsae-entries/referee/:referee', authenticateToken, poomsaeEntryController.getEntriesByReferee);

// Obter uma entrada específica pelo ID - esta rota deve vir por último
router.get('/entries/poomsae-entries/:id', authenticateToken, poomsaeEntryController.getEntryById);

module.exports = router;