const sqlite3 = require('sqlite3').verbose();

// Create or connect to an existing SQLite database file
const db = new sqlite3.Database('./championshipDB.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        // Increase cache size and enable Write-Ahead Logging (WAL)
        db.run('PRAGMA cache_size = 100000');
        db.run('PRAGMA journal_mode = WAL');
        db.run('PRAGMA synchronous = NORMAL');

    }
});

// Create a users table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL
    )`);
});
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS athletes (
                                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                    entryCode TEXT UNIQUE NOT NULL,
                                                    firstName TEXT NOT NULL,
                                                    lastName TEXT NOT NULL,
                                                    birthdate TEXT NOT NULL,
                                                    gender TEXT NOT NULL,
                                                    nationality TEXT NOT NULL,
                                                    email TEXT,
                                                    photo TEXT,
                                                    graduation TEXT NOT NULL,
                                                    weightCategory TEXT NOT NULL,
                                                    groupCategory TEXT NOT NULL,
                                                    categoryType TEXT NOT NULL,
                                                    clubId INTEGER NOT NULL,
                                                    coachId INTEGER NOT NULL
            )`);
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS championships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        date TEXT NOT NULL,
        logo TEXT,
        tatamis TEXT,
        tatamiNumber INTEGER,
        active INTEGER
    )`);
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS poomseas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        championshipId INTEGER NOT NULL,
        draw TEXT NOT NULL,
        attempts INTEGER,
        DanEntries TEXT,
        DanAttempts INTEGER dEFAULT 0,
        KupEntries TEXT,
        KupAttempts INTEGER DEFAULT 0
    )`);
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS poomsaeEntry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ref1T INTEGER,
        ref2T INTEGER,
        ref3T INTEGER,
        ref4T INTEGER,
        ref5T INTEGER,
        ref1A INTEGER,
        ref2A INTEGER,
        ref3A INTEGER,
        ref4A INTEGER,
        ref5A INTEGER,
        poomsae TEXT,
        total INTEGER,
        entryCode TEXT,
        championshipId INTEGER NOT NULL,
        locked INTEGER DEFAULT 0
    )`);
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tatami (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        championshipId INTEGER NOT NULL,
        ref1 TEXT,
        ref2 TEXT,
        ref3 TEXT,
        ref4 TEXT,
        ref5 TEXT,
        area INTEGER
    )`);
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS user_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        token TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        expiresAt TEXT NOT NULL,
        isRevoked INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users (id)
    )`);
});

module.exports = db;
