const db = require('../config/db');

exports.createChampionship = (championship, callback) => {
    const { name, location, date, logo } = championship;

    db.run(
        `INSERT INTO championships (name, location, date, logo) VALUES (?, ?, ?, ?)`,
        [name, location, date, logo],
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