const db = require('../config/db');
const crypto = require('crypto');

exports.saveAthlete = (athlete, callback) => {
    // Função para gerar e verificar um código único
    const generateUniqueCode = () => {
        return new Promise((resolve, reject) => {
            const generateCode = () => {
                const timestamp = Date.now().toString();
                const randomString = crypto.randomBytes(3).toString('hex');
                return `ATH-${timestamp.slice(-6)}-${randomString}`;
            };

            const checkAndSave = (code) => {
                db.get('SELECT entryCode FROM athletes WHERE entryCode = ?', [code], (err, row) => {
                    if (err) return reject(err);
                    if (row) {
                        // Código já existe, gerar outro
                        checkAndSave(generateCode());
                    } else {
                        resolve(code);
                    }
                });
            };

            checkAndSave(generateCode());
        });
    };

    // Gerar código e prosseguir com a inserção
    generateUniqueCode()
        .then(uniqueCode => {
            athlete.entryCode = uniqueCode;

            const fields = [
                'entryCode', 'firstName', 'lastName', 'birthdate', 'gender', 'nationality',
                'email', 'photo', 'graduation',
                'weightCategory', 'groupCategory', 'categoryType', 'clubId', 'coachId'
            ];

            const values = fields.map(field => athlete[field]);

            db.run(
                `INSERT INTO athletes (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
                values,
                callback
            );
        })
        .catch(err => callback(err));
    // Adicione temporariamente ao controller para depuração
    db.all("PRAGMA table_info(athletes);", [], (err, columns) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Estrutura da tabela athletes:", columns);
        }
    });
};

exports.getAllAthletes = (callback) => {
    db.all('SELECT * FROM athletes', [], callback);
};

exports.getAthleteById = (entryCode, callback) => {
    db.get('SELECT * FROM athletes WHERE entryCode = ?', [entryCode], callback);
};

exports.updateAthlete = (entryCode, updatedData, callback) => {
    const updates = Object.keys(updatedData).map(field => `${field} = ?`).join(', ');
    const values = [...Object.values(updatedData), entryCode];

    db.run(`UPDATE athletes SET ${updates} WHERE entryCode = ?`, values, callback);
};

exports.deleteAthlete = (entryCode, callback) => {
    db.run('DELETE FROM athletes WHERE entryCode = ?', [entryCode], callback);
};

exports.deleteAllAthletes = (callback) => {
    db.run(`DELETE FROM athletes`, callback);
};