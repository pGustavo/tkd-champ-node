// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authenticationToken');

// Rota de login - não requer autenticação
router.post('/login', authController.login);

// Rota para obter usuário autenticado - requer autenticação
router.get('/me', authenticateToken, authController.getAuthUser);

// Rota de logout - requer autenticação
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;