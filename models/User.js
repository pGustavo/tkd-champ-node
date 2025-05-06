const db = require('../config/db');

exports.findByUsername = (username, callback) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], callback);
};

exports.createUser = (username, hashedPassword, callback) => {
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], callback);
};
