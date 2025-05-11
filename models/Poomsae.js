// models/Poomsae.js
const db = require('../config/db');

// Criar um novo sorteio de poomsae
exports.createPoomsaeDraw = (poomsaeData, callback) => {
    const { championshipId, draw, attempts, DanEntries, DanAttempts, KupEntries, KupAttempts } = poomsaeData;

    db.run(
        `INSERT INTO poomseas (championshipId, draw, attempts, DanEntries, DanAttempts, KupEntries, KupAttempts) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [championshipId, draw, attempts || null, DanEntries || null, DanAttempts || null, KupEntries || null, KupAttempts || null],
        callback
    );
};

// Obter todos os sorteios de poomsae
exports.getAllPoomsaeDraws = (callback) => {
    db.all(
        `SELECT * FROM poomseas`,
        [],
        callback
    );
};

// Obter sorteios de poomsae por ID do campeonato
exports.getPoomsaeDrawsByChampionshipId = (championshipId, callback) => {
    db.all(
        `SELECT * FROM poomseas WHERE championshipId = ?`,
        [championshipId],
        callback
    );
};

// Atualizar um sorteio de poomsae por ID do campeonato
exports.updatePoomsaeDrawByChampionshipId = (championshipId, updatedData, callback) => {
    // Construir a consulta SQL dinamicamente com base nos campos fornecidos
    let updateFields = [];
    let values = [];

    if (updatedData.draw !== undefined) {
        updateFields.push("draw = ?");
        values.push(updatedData.draw);
    }

    if (updatedData.attempts !== undefined) {
        updateFields.push("attempts = ?");
        values.push(updatedData.attempts);
    }

    if (updatedData.DanEntries !== undefined) {
        updateFields.push("DanEntries = ?");
        values.push(updatedData.DanEntries);
    }

    if (updatedData.DanAttempts !== undefined) {
        updateFields.push("DanAttempts = ?");
        values.push(updatedData.DanAttempts);
    }

    if (updatedData.KupEntries !== undefined) {
        updateFields.push("KupEntries = ?");
        values.push(updatedData.KupEntries);
    }

    if (updatedData.KupAttempts !== undefined) {
        updateFields.push("KupAttempts = ?");
        values.push(updatedData.KupAttempts);
    }

    // Adicionar o championshipId ao array de valores
    values.push(championshipId);

    const sql = `UPDATE poomseas SET ${updateFields.join(", ")} WHERE championshipId = ?`;

    db.run(sql, values, callback);
};

// Excluir um sorteio de poomsae por ID do campeonato
exports.deletePoomsaeDrawByChampionshipId = (championshipId, callback) => {
    db.run(
        `DELETE FROM poomseas WHERE championshipId = ?`,
        [championshipId],
        callback
    );
};