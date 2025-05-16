const db = require('../config/db');

exports.createEntry = (entryData, callback) => {
    const {
        ref1T, ref2T, ref3T, ref4T, ref5T,
        ref1A, ref2A, ref3A, ref4A, ref5A,
        poomsae, total, entryCode, locked, championshipId
    } = entryData;

    const sql =
        `INSERT INTO poomsaeEntry (
            ref1T, ref2T, ref3T, ref4T, ref5T,
            ref1A, ref2A, ref3A, ref4A, ref5A,
            poomsae, total, entryCode, locked, championshipId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [
        ref1T, ref2T, ref3T, ref4T, ref5T,
        ref1A, ref2A, ref3A, ref4A, ref5A,
        poomsae, total, entryCode, locked, championshipId
    ], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, { id: this.lastID, ...entryData });
    });
};

// Nova função para buscar entradas por ID do campeonato
exports.getEntriesByChampionshipId = (championshipId, callback) => {
    const sql = 'SELECT * FROM poomsaeEntry WHERE championshipId = ?';

    db.all(sql, [championshipId], (err, rows) => {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
};

// Buscar todas as entradas (com opção de filtrar por championshipId)
exports.getAllEntries = (callback, championshipId = null) => {
    let sql = 'SELECT * FROM poomsaeEntry';
    let params = [];

    if (championshipId) {
        sql += ' WHERE championshipId = ?';
        params.push(championshipId);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
};

exports.getEntryById = (entryId, callback) => {
    db.get('SELECT * FROM poomsaeEntry WHERE id = ?', [entryId], callback);
};

exports.getEntriesByEntryCode = (entryCode, callback) => {
    db.all('SELECT * FROM poomsaeEntry WHERE entryCode = ?', [entryCode], callback);
};

exports.getEntriesByLocked = (locked, callback) => {
    db.all('SELECT * FROM poomsaeEntry WHERE locked = ?', [locked], callback);
};

// Adicione ao arquivo models/PoomsaeEntry.js
exports.findByEntryCodeAndPoomsae = (entryCode, poomsae, championshipId, callback) => {
    const sql = `
    SELECT * FROM poomsaeEntry
    WHERE entryCode = ? AND poomsae = ? AND championshipId = ?
    LIMIT 1
  `;

    db.get(sql, [entryCode, poomsae, championshipId], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row);
    });
};

exports.updateEntry = (entryData, callback) => {
    const {
        id, ref1T, ref2T, ref3T, ref4T, ref5T,
        ref1A, ref2A, ref3A, ref4A, ref5A,
        poomsae, total, entryCode, locked, championshipId
    } = entryData;

    const sql = `
        UPDATE poomsaeEntry
        SET ref1T = ?, ref2T = ?, ref3T = ?, ref4T = ?, ref5T = ?,
            ref1A = ?, ref2A = ?, ref3A = ?, ref4A = ?, ref5A = ?,
            poomsae = ?, total = ?, entryCode = ?, locked = ?, championshipId = ?
        WHERE id = ?
    `;

    db.run(sql, [
        ref1T, ref2T, ref3T, ref4T, ref5T,
        ref1A, ref2A, ref3A, ref4A, ref5A,
        poomsae, total, entryCode, locked, championshipId,
        id
    ], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, entryData);
    });
};