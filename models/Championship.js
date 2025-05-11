const db = require('../config/db');

exports.createChampionship = (championship, callback) => {
    const { name, location, date, logo, tatamis, tatamiNumber } = championship;

    db.run(
        `INSERT INTO championships (name, location, date, logo, tatamis, tatamiNumber) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, location, date, logo, tatamis, tatamiNumber],
        callback
    );
};

exports.getChampionshipById = (id, callback) => {
    db.get(
        `SELECT * FROM championships WHERE id = ?`,
        [id],
        callback
    );
};

exports.updateChampionship = (id, championship, callback) => {
    const { name, location, date, logo, tatamis, tatamiNumber } = championship;

    db.run(
        `UPDATE championships
         SET name = ?, location = ?, date = ?, logo = ?, tatamis = ?, tatamiNumber = ?
         WHERE id = ?`,
        [name, location, date, logo, tatamis, tatamiNumber, id],
        callback
    );
};

// Adicionar ao arquivo models/Championship.js
exports.getAllChampionships = (callback) => {
    db.all(
        `SELECT * FROM championships`,
        [],
        callback
    );
};