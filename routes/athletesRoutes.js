const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athletesController');
const authenticateToken = require("../middlewares/authenticationToken");

router.post('/athletes', authenticateToken,  athleteController.saveAthletes);
router.get('/athletes', authenticateToken,  athleteController.getAllAthletes);

module.exports = router;