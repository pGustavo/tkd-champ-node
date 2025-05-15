const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extrai o token do cabeçalho Authorization

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token
        req.user = decoded; // Armazena os dados decodificados no objeto `req` para uso posterior
        next(); // Permite que a requisição continue
    } catch (err) {
        console.error('Erro ao verificar token:', err);
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};

module.exports = authenticateToken;