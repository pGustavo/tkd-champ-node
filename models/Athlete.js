const db = require('../config/db');

exports.saveAthlete = (athlete, callback) => {
    const fields = [
        'entryCode', 'firstName', 'lastName', 'birthdate', 'gender', 'nationality',
        'email', 'photo', 'graduation',
        'weightCategory', 'groupCategory', 'categoryType', 'clubId', 'coachId'
    ];

    const values = fields.map(field => athlete[field]); // Extract values dynamically

    db.run(
        `INSERT INTO athletes (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
        values,
        callback
    );
};

exports.getAllAthletes = (callback) => {
    db.all('SELECT * FROM athletes', [], callback);
};

exports.getAthleteById = (id, callback) => {
    db.get('SELECT * FROM athletes WHERE id = ?', [id], callback);
};

exports.updateAthlete = (id, updatedData, callback) => {
    const updates = Object.keys(updatedData).map(field => `${field} = ?`).join(', ');
    const values = [...Object.values(updatedData), id];

    db.run(`UPDATE athletes SET ${updates} WHERE id = ?`, values, callback);
};

exports.deleteAthlete = (id, callback) => {
    db.run('DELETE FROM athletes WHERE id = ?', [id], callback);
};