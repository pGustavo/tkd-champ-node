const db = require('../config/db');

exports.findByUsername = (username, callback) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], callback);
};

exports.createUser = (userData, callback) => {
    const { username, password } = userData;
    const role = 'nd'; // Papel padrão
    const status = 'pending'; // Status padrão

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

exports.findByUsername = (username, callback) => {
    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        callback
    );
};

exports.getAllUsers = (callback) => {
    db.all('SELECT id, username, role, status FROM users', [], callback);
};

exports.updateUser = (userId, userData, callback) => {
    // Crie um array de atualizações e valores
    const updates = [];
    const values = [];

    // Para cada campo possível, verifique se foi fornecido
    if (userData.username !== undefined) {
        updates.push('username = ?');
        values.push(userData.username);
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

exports.deleteUser = (userId, callback) => {
    // Verificar se o usuário existe antes de deletar
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
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

            // Verifica se alguma linha foi afetada
            callback(null, { id: userId, deleted: this.changes > 0 });
        });
    });
};
