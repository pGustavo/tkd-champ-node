const db = require('../config/db');

// Criar um novo tatami
exports.createTatami = (tatamiData, callback) => {
    const {
        championshipId,
        area,        // Adicionado campo area
        ref1,
        ref2,
        ref3,
        ref4,
        ref5
    } = tatamiData;

    const sql = `
        INSERT INTO tatami (
            championshipId,
            area,
            ref1,
            ref2,
            ref3,
            ref4,
            ref5
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
        championshipId,
        area || null,  // Garantir que área seja salva
        ref1 || null,
        ref2 || null,
        ref3 || null,
        ref4 || null,
        ref5 || null
    ], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, { id: this.lastID, ...tatamiData });
    });
};

// Buscar todos os tatamis
exports.getAllTatamis = (callback) => {
    const sql = 'SELECT * FROM tatami';

    db.all(sql, [], (err, rows) => {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
};

// Buscar tatami por ID
exports.getTatamiById = (tatamiId, callback) => {
    const sql = 'SELECT * FROM tatami WHERE id = ?';

    db.get(sql, [tatamiId], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row);
    });
};

// Buscar tatamis por ID do campeonato
exports.getTatamisByChampionshipId = (championshipId, callback) => {
    const sql = 'SELECT * FROM tatami WHERE championshipId = ?';

    db.all(sql, [championshipId], (err, rows) => {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
};

// Atualizar um tatami existente
// Atualizar um tatami existente
exports.updateTatami = (tatamiId, tatamiData, callback) => {
    const {
        championshipId,
        area,        // Adicionado campo area
        ref1,
        ref2,
        ref3,
        ref4,
        ref5
    } = tatamiData;

    const sql = `
        UPDATE tatami
        SET championshipId = ?,
            area = ?,
            ref1 = ?,
            ref2 = ?,
            ref3 = ?,
            ref4 = ?,
            ref5 = ?
        WHERE id = ?
    `;

    db.run(sql, [
        championshipId,
        area,
        ref1,
        ref2,
        ref3,
        ref4,
        ref5,
        tatamiId
    ], function(err) {
        if (err) {
            return callback(err);
        }

        if (this.changes === 0) {
            return callback(new Error('Tatami não encontrado'));
        }

        callback(null, { id: tatamiId, ...tatamiData });
    });
};

// Atualizar apenas os árbitros de um tatami
exports.updateTatamiReferees = (tatamiId, refereeData, callback) => {
    const { ref1, ref2, ref3, ref4, ref5 } = refereeData;

    const sql = `
        UPDATE tatami
        SET ref1 = ?,
            ref2 = ?,
            ref3 = ?,
            ref4 = ?,
            ref5 = ?
        WHERE id = ?
    `;

    db.run(sql, [ref1, ref2, ref3, ref4, ref5, tatamiId], function(err) {
        if (err) {
            return callback(err);
        }

        if (this.changes === 0) {
            return callback(new Error('Tatami não encontrado'));
        }

        callback(null, { id: tatamiId, ...refereeData });
    });
};

// Excluir um tatami
exports.deleteTatami = (tatamiId, callback) => {
    const sql = 'DELETE FROM tatami WHERE id = ?';

    db.run(sql, [tatamiId], function(err) {
        if (err) {
            return callback(err);
        }

        if (this.changes === 0) {
            return callback(new Error('Tatami não encontrado'));
        }

        callback(null, { id: tatamiId, deleted: true });
    });
};

// Verificar se um tatami existe
exports.tatamiExists = (tatamiId, callback) => {
    const sql = 'SELECT 1 FROM tatami WHERE id = ? LIMIT 1';

    db.get(sql, [tatamiId], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, !!row);
    });
};

// Atualizar um árbitro específico em um tatami
exports.updateSpecificReferee = (tatamiId, position, refereeId, callback) => {
    // Validar a posição para evitar injeção SQL
    const validPositions = ['ref1', 'ref2', 'ref3', 'ref4', 'ref5'];
    if (!validPositions.includes(position)) {
        return callback(new Error('Posição de árbitro inválida'));
    }

    // Construir a consulta SQL de forma segura
    const sql = `UPDATE tatami SET ${position} = ? WHERE id = ?`;

    db.run(sql, [refereeId, tatamiId], function(err) {
        if (err) {
            return callback(err);
        }

        if (this.changes === 0) {
            return callback(new Error('Tatami não encontrado'));
        }

        // Buscar o tatami atualizado para retornar
        exports.getTatamiById(tatamiId, callback);
    });
};