const express = require('express');
const router = express.Router();
const tatamiController = require('../controllers/tatamiController');
const authenticateToken = require('../middlewares/authenticationToken');

// Criar um novo tatami
router.post('/tatamis/championship/:championshipId', authenticateToken, tatamiController.createTatami);

// Obter todos os tatamis
router.get('/tatamis', authenticateToken, tatamiController.getAllTatamis);

// Obter tatamis por campeonato
router.get('/tatamis/championship/:championshipId', authenticateToken, tatamiController.getTatamisByChampionshipId);

// Criar ou atualizar múltiplos tatamis para um campeonato
router.post('/tatamis/championship/:championshipId/batch', authenticateToken, tatamiController.createOrUpdateMultipleTatamis);

// Atualizar apenas os árbitros de um tatami
router.patch('/tatamis/:id/referees', authenticateToken, tatamiController.updateTatamiReferees);

// Rotas específicas por ID - devem vir por último
router.get('/tatamis/:id', authenticateToken, tatamiController.getTatamiById);
router.put('/tatamis/:id', authenticateToken, tatamiController.updateTatami);
router.delete('/tatamis/:id', authenticateToken, tatamiController.deleteTatami);

router.post('/tatamis/championship/:championshipId/tatami/:tatamiId/assign-referee', authenticateToken, tatamiController.assignRefereeToTatami);


module.exports = router;