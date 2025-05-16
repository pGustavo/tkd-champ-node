const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Delega a autenticação para o modelo
        const result = await User.authenticate(username, password);

        if (result.error) {
            return res.status(result.status || 400).json({
                message: result.message,
                reason: result.reason,
                status: result.userStatus
            });
        }

        res.json({
            token: result.token,
            user: result.user
        });
    } catch (error) {
        console.error('Erro na autenticação:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

exports.getAuthUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        // Delega a verificação e busca para o modelo
        const userData = await User.getUserFromToken(token);
        res.json(userData);
    } catch (error) {
        console.error('Erro ao obter usuário pelo token:', error);
        res.status(error.status || 401).json({ message: error.message || 'Token inválido ou expirado' });
    }
};

exports.logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token não fornecido' });
    }

    try {
        // Delega a revogação do token para o modelo
        await User.revokeToken(token);
        res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        res.status(500).json({ message: 'Erro ao fazer logout' });
    }
};