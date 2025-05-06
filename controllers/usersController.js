const db = require('../config/db');

exports.getAllUsers = (req, res) => {
    db.all('SELECT id, username FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows); // Returns an array of users
    });
};
