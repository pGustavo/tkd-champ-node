const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Busca um usuário pelo nome de usuário
exports.findByUsername = (username, callback) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], callback);
};

// Busca um usuário pelo ID
exports.findById = (id, callback) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], callback);
};

// Autentica um usuário e gera um token
exports.authenticate = async (username, password) => {
    return new Promise((resolve, reject) => {
        exports.findByUsername(username, async (err, user) => {
            if (err) {
                return reject(err);
            }

            if (!user) {
                return resolve({
                    error: true,
                    status: 400,
                    message: 'Usuário não encontrado'
                });
            }

            // Verificar senha
            // Na versão de produção, usar bcrypt:
            // const isMatch = await bcrypt.compare(password, user.password);
            const isMatch = password == user.password;

            if (!isMatch) {
                return resolve({
                    error: true,
                    status: 400,
                    message: 'Credenciais inválidas'
                });
            }

            if (user.status !== 'accepted') {
                return resolve({
                    error: true,
                    status: 403,
                    message: 'Acesso negado',
                    reason: 'Usuário não está ativo',
                    userStatus: user.status
                });
            }

            // Criar token JWT
            const token = jwt.sign({
                id: user.id,
                username: user.username,
                role: user.role,
                permissions: user.permissions || []
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            // Salvar o token no DB
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);

            const tokenData = {
                userId: user.id,
                token: token,
                createdAt: new Date().toISOString(),
                expiresAt: expiresAt.toISOString(),
                isRevoked: 0
            };

            db.run(
                'INSERT INTO user_tokens (userId, token, createdAt, expiresAt, isRevoked) VALUES (?, ?, ?, ?, ?)',
                [tokenData.userId, tokenData.token, tokenData.createdAt, tokenData.expiresAt, tokenData.isRevoked],
                (err) => {
                    if (err) {
                        console.error('Erro ao salvar token:', err);
                        // Continuar mesmo com erro no salvamento do token
                    }

                    resolve({
                        token,
                        user: {
                            username: user.username,
                            role: user.role
                        }
                    });
                }
            );
        });
    });
};

// Obtém informações do usuário a partir do token
exports.getUserFromToken = (token) => {
    return new Promise((resolve, reject) => {
        // Verificar se o token está na base de dados e não foi revogado
        db.get('SELECT * FROM user_tokens WHERE token = ? AND isRevoked = 0', [token], (err, tokenRecord) => {
            if (err) {
                return reject({
                    status: 500,
                    message: 'Erro ao verificar token na base de dados'
                });
            }

            if (!tokenRecord) {
                return reject({
                    status: 401,
                    message: 'Token inválido ou revogado'
                });
            }

            // Verificar se o token expirou na base de dados
            const now = new Date();
            const expiresAt = new Date(tokenRecord.expiresAt);
            if (now > expiresAt) {
                return reject({
                    status: 401,
                    message: 'Token expirado'
                });
            }

            try {
                // Verificar assinatura do token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Buscar informações atualizadas do usuário
                exports.findById(decoded.id, (err, user) => {
                    if (err) {
                        return reject({
                            status: 500,
                            message: 'Erro ao buscar informações do usuário'
                        });
                    }

                    if (!user) {
                        return reject({
                            status: 404,
                            message: 'Usuário não encontrado'
                        });
                    }

                    resolve({
                        id: user.id,
                        username: user.username,
                        role: user.role,
                        permissions: user.permissions || [],
                        status: user.status
                    });
                });
            } catch (jwtError) {
                reject({
                    status: 401,
                    message: 'Token inválido'
                });
            }
        });
    });
};

// Revoga um token (logout)
exports.revokeToken = (token) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE user_tokens SET isRevoked = 1 WHERE token = ?',
            [token],
            (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            }
        );
    });
};

// Cria um novo usuário
exports.createUser = (userData, callback) => {
    const { username, password } = userData;
    const role = userData.role || 'nd'; // Papel padrão
    const status = userData.status || 'pending'; // Status padrão

    db.run(
        `INSERT INTO users (username, password, role, status)
         VALUES (?, ?, ?, ?)`,
        [username, password, role, status],
        function(err) {
            if (err) {
                callback(err);
            } else {
                // Retorna o ID do usuário recém-criado
                callback(null, { id: this.lastID, username, role, status });
            }
        }
    );
};

// Lista todos os usuários
exports.getAllUsers = (callback) => {
    db.all('SELECT id, username, role, status FROM users', [], callback);
};

// Atualiza um usuário existente
exports.updateUser = (userId, userData, callback) => {
    const updates = [];
    const values = [];

    // Para cada campo possível, verifique se foi fornecido
    if (userData.username !== undefined) {
        updates.push('username = ?');
        values.push(userData.username);
    }

    if (userData.password !== undefined) {
        updates.push('password = ?');
        values.push(userData.password);
    }

    if (userData.role !== undefined) {
        updates.push('role = ?');
        values.push(userData.role);
    }

    if (userData.status !== undefined) {
        updates.push('status = ?');
        values.push(userData.status);
    }

    // Se não houver campos para atualizar
    if (updates.length === 0) {
        return callback(new Error('Nenhum dado fornecido para atualização'));
    }

    // Adicione o ID para a cláusula WHERE
    values.push(userId);

    // Construa a query de atualização
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    // Execute a query
    db.run(query, values, function(err) {
        if (err) {
            return callback(err);
        }

        // Busque o usuário atualizado para retornar
        db.get('SELECT id, username, role, status FROM users WHERE id = ?', [userId], callback);
    });
};

// Remove um usuário
exports.deleteUser = (userId, callback) => {
    // Verificar se o usuário existe antes de deletar
    exports.findById(userId, (err, user) => {
        if (err) {
            return callback(err);
        }

        if (!user) {
            return callback(new Error('Usuário não encontrado'));
        }

        // Deletar o usuário
        db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
            if (err) {
                return callback(err);
            }

            // Revoga todos os tokens do usuário
            db.run('UPDATE user_tokens SET isRevoked = 1 WHERE userId = ?', [userId], (err) => {
                if (err) {
                    console.error('Erro ao revogar tokens do usuário:', err);
                }

                // Verifica se alguma linha foi afetada
                callback(null, { id: userId, deleted: this.changes > 0 });
            });
        });
    });
};