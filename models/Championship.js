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

exports.deleteAllRelatedData = (championshipId, callback) => {
    const queries = [
        `DELETE FROM poomsaeEntry WHERE championshipId = ?`,
        `DELETE FROM poomseas WHERE championshipId = ?`,
        `DELETE FROM tatami WHERE championshipId = ?`,
        `DELETE FROM championships WHERE id = ?`
    ];

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        try {
            queries.forEach(query => {
                db.run(query, [championshipId], (err) => {
                    if (err) throw err;
                });
            });
            db.run('COMMIT', callback);
        } catch (err) {
            db.run('ROLLBACK');
            callback(err);
        }
    });
};