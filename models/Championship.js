const db = require('../config/db');

exports.createChampionship = (championship, callback) => {
    const { name, location, date, logo, tatamis, tatamiNumber, active } = championship;

    db.run(
        `INSERT INTO championships (name, location, date, logo, tatamis, tatamiNumber, active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, location, date, logo, tatamis, tatamiNumber, active || 0],
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
    const { name, location, date, logo, tatamis, tatamiNumber, active } = championship;

    db.run(
        `UPDATE championships
         SET name = ?, location = ?, date = ?, logo = ?, tatamis = ?, tatamiNumber = ?, active = ?
         WHERE id = ?`,
        [name, location, date, logo, tatamis, tatamiNumber, active || 0, id],
        callback
    );
};

exports.getAllChampionships = (callback) => {
    db.all(
        `SELECT * FROM championships`,
        [],
        callback
    );
};

exports.updateChampionshipStatus = (id, active, callback) => {
    db.run(
        'UPDATE championships SET active = ? WHERE id = ?',
        [active, id],
        callback
    );
};

exports.getActiveChampionships = (callback) => {
    db.all(
        'SELECT * FROM championships WHERE active = 1',
        [],
        callback
    );
};

exports.deleteChampionship = (id, callback) => {
    db.run(
        `DELETE FROM championships WHERE id = ?`,
        [id],
        callback
    );
};