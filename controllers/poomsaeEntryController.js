const PoomsaeEntry = require('../models/PoomsaeEntry');


exports.createEntries = (req, res) => {
    const data = req.body;
    const { championshipId } = req.params; // Obter championshipId da URL

    if (!championshipId) {
        return res.status(400).json({
            error: 'ID do campeonato é obrigatório'
        });
    }

    // Verifica se é um array ou objeto único
    if (Array.isArray(data)) {
        // Adiciona championshipId a todas as entradas
        data.forEach(entry => {
            entry.championshipId = championshipId;
        });
        processMultipleEntries(data, res);
    } else {
        // Adiciona championshipId à entrada única
        data.championshipId = championshipId;
        processSingleEntry(data, res);
    }
};

// Processa múltiplas entradas
function processMultipleEntries(entries, res) {
    if (entries.length === 0) {
        return res.status(400).json({
            error: 'Nenhum dado fornecido para criar entradas'
        });
    }

    const results = [];
    let completed = 0;
    let hasError = false;

    entries.forEach(entryData => {
        preprocessEntry(entryData);

        PoomsaeEntry.createEntry(entryData, (err, result) => {
            completed++;

            if (err) {
                hasError = true;
                results.push({ error: err.message || 'Erro ao criar entrada', data: entryData });
            } else {
                results.push({ success: true, data: result });
            }

            // Quando todas as operações estiverem concluídas
            if (completed === entries.length) {
                const status = hasError ? 207 : 201; // Multi-Status ou Created
                res.status(status).json({
                    message: hasError ? 'Algumas entradas foram criadas com sucesso' :
                        'Todas as entradas foram criadas com sucesso',
                    results: results
                });
            }
        });
    });
}

// Processa uma única entrada
function processSingleEntry(entryData, res) {
    // Validação básica
    if (!entryData.entryCode || !entryData.poomsae) {
        return res.status(400).json({
            error: 'Dados incompletos. Código de entrada e poomsae são obrigatórios.'
        });
    }

    preprocessEntry(entryData);

    PoomsaeEntry.createEntry(entryData, (err, result) => {
        if (err) {
            console.error('Erro ao criar entrada de poomsae:', err);
            return res.status(500).json({
                error: 'Falha ao criar entrada de poomsae'
            });
        }

        res.status(201).json({
            message: 'Entrada de poomsae criada com sucesso',
            data: result
        });
    });
}

// Função auxiliar para pré-processar entradas
function preprocessEntry(entryData) {
    // Calcular o total se não for fornecido
    if (!entryData.total) {
        const technicalScores = [
            entryData.ref1T || 0,
            entryData.ref2T || 0,
            entryData.ref3T || 0,
            entryData.ref4T || 0,
            entryData.ref5T || 0
        ];

        const presentationScores = [
            entryData.ref1A || 0,
            entryData.ref2A || 0,
            entryData.ref3A || 0,
            entryData.ref4A || 0,
            entryData.ref5A || 0
        ];

        // Remove maior e menor nota técnica
        if (technicalScores.filter(Boolean).length >= 3) {
            technicalScores.sort((a, b) => a - b);
            technicalScores.shift(); // Remove o menor
            technicalScores.pop();   // Remove o maior
        }

        // Remove maior e menor nota de apresentação
        if (presentationScores.filter(Boolean).length >= 3) {
            presentationScores.sort((a, b) => a - b);
            presentationScores.shift(); // Remove o menor
            presentationScores.pop();   // Remove o maior
        }

        // Soma as notas restantes
        const technicalTotal = technicalScores.reduce((sum, score) => sum + score, 0);
        const presentationTotal = presentationScores.reduce((sum, score) => sum + score, 0);

        entryData.total = technicalTotal + presentationTotal;
    }
}

exports.getEntriesByChampionshipId = (req, res) => {
    const championshipId = req.params.championshipId;

    PoomsaeEntry.getEntriesByChampionshipId(championshipId, (err, entries) => {
        if (err) {
            console.error('Erro ao buscar entradas por campeonato:', err);
            return res.status(500).json({
                error: 'Falha ao buscar entradas de poomsae'
            });
        }

        res.json(entries);
    });
};


exports.getAllEntries = (req, res) => {
    PoomsaeEntry.getAllEntries((err, entries) => {
        if (err) {
            console.error('Erro ao buscar entradas de poomsae:', err);
            return res.status(500).json({
                error: 'Falha ao buscar entradas de poomsae'
            });
        }

        res.json(entries);
    });
};

exports.getEntryById = (req, res) => {
    const entryId = req.params.id;

    PoomsaeEntry.getEntryById(entryId, (err, entry) => {
        if (err) {
            console.error('Erro ao buscar entrada de poomsae:', err);
            return res.status(500).json({
                error: 'Falha ao buscar entrada de poomsae'
            });
        }

        if (!entry) {
            return res.status(404).json({
                error: 'Entrada de poomsae não encontrada'
            });
        }

        res.json(entry);
    });
};

exports.getEntriesByEntryCode = (req, res) => {
    const entryCode = req.params.entryCode;

    PoomsaeEntry.getEntriesByEntryCode(entryCode, (err, entries) => {
        if (err) {
            console.error('Erro ao buscar entradas de poomsae por código de entrada:', err);
            return res.status(500).json({
                error: 'Falha ao buscar entradas de poomsae'
            });
        }

        res.json(entries);
    });
};

exports.getEntriesByReferee = (req, res) => {
    const referee = req.params.referee;

    PoomsaeEntry.getEntriesByReferee(referee, (err, entries) => {
        if (err) {
            console.error('Erro ao buscar entradas de poomsae por árbitro:', err);
            return res.status(500).json({
                error: 'Falha ao buscar entradas de poomsae'
            });
        }

        res.json(entries);
    });
};