const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athletesController');

router.post('/athletes', athleteController.saveAthletes);
router.get('/athletes', athleteController.getAllAthletes);

module.exports = router;