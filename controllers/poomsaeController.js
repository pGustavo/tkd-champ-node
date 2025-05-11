// controllers/poomsaeController.js
const Poomsae = require('../models/Poomsae');

// Criar um novo sorteio de poomsae
exports.createDraw = (req, res) => {
    const { championshipId, draw } = req.body;

    if (!championshipId || !draw) {
        return res.status(400).json({ error: 'Dados incompletos. ChampionshipId e draw são obrigatórios.' });
    }

    // Verificar se já existe um sorteio para este campeonato
    Poomsae.getPoomsaeDrawsByChampionshipId(championshipId, (err, existingDraws) => {
        if (err) {
            console.error(`Erro ao verificar sorteios existentes:`, err.message);
            return res.status(500).json({ error: 'Erro ao verificar sorteios existentes' });
        }

        // Se já existe um sorteio para este campeonato, atualizar em vez de criar um novo
        if (existingDraws && existingDraws.length > 0) {
            const updatedData = {
                draw,
                attempts: (existingDraws[0].attempts || 0) + 1
            };

            Poomsae.updatePoomsaeDrawByChampionshipId(championshipId, updatedData, function(err) {
                if (err) {
                    console.error(`Erro ao atualizar sorteio existente para o campeonato ${championshipId}:`, err.message);
                    return res.status(500).json({ error: 'Erro ao atualizar sorteio existente' });
                }

                res.status(200).json({
                    message: 'Sorteio de poomsae atualizado com sucesso',
                    championshipId: championshipId,
                    attempts: updatedData.attempts
                });
            });
        } else {
            // Caso não exista, criar um novo sorteio
            const poomsaeData = {
                championshipId,
                draw,
                attempts: 1
            };

            Poomsae.createPoomsaeDraw(poomsaeData, function(err) {
                if (err) {
                    console.error('Erro ao criar sorteio de poomsae:', err.message);
                    return res.status(500).json({ error: 'Erro ao criar sorteio de poomsae' });
                }

                res.status(201).json({
                    message: 'Sorteio de poomsae criado com sucesso',
                    id: this.lastID,
                    championshipId: championshipId,
                    attempts: poomsaeData.attempts
                });
            });
        }
    });
};

// Obter todos os sorteios de poomsae
exports.getAllDraws = (req, res) => {
    Poomsae.getAllPoomsaeDraws((err, draws) => {
        if (err) {
            console.error('Erro ao buscar sorteios de poomsae:', err.message);
            return res.status(500).json({ error: 'Erro ao buscar sorteios de poomsae' });
        }

        res.status(200).json(draws);
    });
};

// Obter sorteios de poomsae por ID do campeonato
exports.getDrawsByChampionshipId = (req, res) => {
    const { championshipId } = req.params;

    Poomsae.getPoomsaeDrawsByChampionshipId(championshipId, (err, draws) => {
        if (err) {
            console.error(`Erro ao buscar sorteios para o campeonato ${championshipId}:`, err.message);
            return res.status(500).json({ error: 'Erro ao buscar sorteios de poomsae' });
        }

        res.status(200).json(draws[0]);
    });
};

// Atualizar um sorteio de poomsae por ID do campeonato
exports.updateDrawByChampionshipId = (req, res) => {
    const { championshipId } = req.params;
    const { draw, DanEntries, KupEntries } = req.body;

    // Verificar se há pelo menos um campo para atualizar
    if (!draw && !DanEntries && !KupEntries) {
        return res.status(400).json({ error: 'É necessário fornecer draw, DanEntries ou KupEntries' });
    }

    // Primeiro, obter o registro atual para verificar os valores existentes
    Poomsae.getPoomsaeDrawsByChampionshipId(championshipId, (err, draws) => {
        if (err) {
            console.error(`Erro ao buscar sorteio para o campeonato ${championshipId}:`, err.message);
            return res.status(500).json({ error: 'Erro ao buscar sorteio existente' });
        }

        if (!draws || draws.length === 0) {
            return res.status(404).json({ error: 'Sorteio não encontrado para este campeonato' });
        }

        const currentDraw = draws[0];
        const updatedData = {};

        // Atualizar draw se fornecido
        if (draw) {
            updatedData.draw = draw;
        }

        // Atualizar DanEntries e incrementar DanAttempts se fornecido
        if (DanEntries) {
            updatedData.DanEntries = DanEntries;
            updatedData.DanAttempts = (currentDraw.DanAttempts || 0) + 1;
        }

        // Atualizar KupEntries e incrementar KupAttempts se fornecido
        if (KupEntries) {
            updatedData.KupEntries = KupEntries;
            updatedData.KupAttempts = (currentDraw.KupAttempts || 0) + 1;
        }

        // Realizar a atualização com os dados preparados
        Poomsae.updatePoomsaeDrawByChampionshipId(championshipId, updatedData, function(err) {
            if (err) {
                console.error(`Erro ao atualizar sorteio para o campeonato ${championshipId}:`, err.message);
                return res.status(500).json({ error: 'Erro ao atualizar sorteio' });
            }

            // Buscar os dados atualizados para incluir na resposta
            Poomsae.getPoomsaeDrawsByChampionshipId(championshipId, (err, updatedDraws) => {
                if (err) {
                    console.error(`Erro ao buscar sorteio atualizado:`, err.message);
                    return res.status(500).json({ error: 'Erro ao buscar sorteio atualizado' });
                }

                if (!updatedDraws || updatedDraws.length === 0) {
                    return res.status(404).json({ error: 'Não foi possível recuperar o sorteio atualizado' });
                }

                const updatedDraw = updatedDraws[0];

                res.status(200).json({
                    message: 'Sorteio de poomsae atualizado com sucesso',
                    championshipId,
                    changes: this.changes,
                    updatedFields: Object.keys(updatedData),
                    DanAttempts: updatedDraw.DanAttempts,
                    KupAttempts: updatedDraw.KupAttempts
                });
            });
        });
    });
};

// Excluir um sorteio de poomsae por ID do campeonato
exports.deleteDrawByChampionshipId = (req, res) => {
    const { championshipId } = req.params;

    Poomsae.deletePoomsaeDrawByChampionshipId(championshipId, function(err) {
        if (err) {
            console.error(`Erro ao excluir sorteio de poomsae para o campeonato ${championshipId}:`, err.message);
            return res.status(500).json({ error: 'Erro ao excluir sorteio de poomsae' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'sorteio de poomsae não encontrado para este campeonato' });
        }

        res.status(200).json({
            message: 'sorteio de poomsae excluído com sucesso',
            changes: this.changes
        });
    });
};