// Em middlewares/authenticationToken.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Verificar se o token está na base de dados e não foi revogado
    db.get('SELECT * FROM user_tokens WHERE token = ? AND isRevoked = 0', [token], (err, tokenRecord) => {
        if (err) {
            console.error('Erro ao verificar token na base de dados:', err);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }

        if (!tokenRecord) {
            return res.status(401).json({ message: 'Token inválido ou revogado' });
        }

        // Verificar se o token expirou na base de dados
        const now = new Date();
        const expiresAt = new Date(tokenRecord.expiresAt);
        if (now > expiresAt) {
            return res.status(401).json({ message: 'Token expirado' });
        }

        // Verificar assinatura do token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token inválido' });
            }

            req.user = decoded;
            next();
        });
    });
}

module.exports = authenticateToken;