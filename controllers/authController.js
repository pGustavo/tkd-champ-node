const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const { username, password } = req.body;

    User.findByUsername(username, async (err, user) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }

        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        const isMatch = password == user.password; // Use bcrypt.compare se as senhas estiverem com hash
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        if (user.status !== 'accepted') {
            return res.status(403).json({
                message: 'Acesso negado',
                reason: 'Usuário não está ativo',
                status: user.status
            });
        }

        const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};

exports.getAuthUser = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extrai o token do cabeçalho Authorization

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o token
        res.json({
            username: decoded.username,
            permissions: decoded.role // Ou outro campo que represente permissões
        });
    } catch (err) {
        console.error('Erro ao verificar token:', err);
        res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};