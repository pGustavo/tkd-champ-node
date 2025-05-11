const Championship = require('../models/Championship');

exports.createChampionship = (req, res) => {
    const championship = req.body;

    if (!championship.name || !championship.location || !championship.date) {
        return res.status(400).json({ message: 'Os campos Nome, localizacao e data são obrigatórios' });
    }

    Championship.createChampionship(championship, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao criar campeonato', error: err.message });
        }
        res.status(201).json({ message: 'Campeonato criado com sucesso' });
    });
};

exports.updateChampionship = (req, res) => {
    const { id } = req.params;
    const championship = req.body;

    if (!id || !championship.name || !championship.location || !championship.date) {
        return res.status(400).json({ message: 'ID e todos os campos obrigatórios devem ser fornecidos' });
    }

    Championship.updateChampionship(id, championship, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao atualizar campeonato', error: err.message });
        }
        res.status(200).json({ message: 'Campeonato atualizado com sucesso' });
    });
};

exports.getChampionshipById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'O ID é obrigatório' });
    }

    Championship.getChampionshipById(id, (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar campeonato', error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Campeonato não encontrado' });
        }
        res.status(200).json(row);
    });
};

// Obter todos os campeonatos
exports.getAllChampionships = (req, res) => {
    Championship.getAllChampionships((err, championships) => {
        if (err) {
            console.error('Erro ao buscar campeonatos:', err.message);
            return res.status(500).json({ error: 'Erro ao buscar campeonatos' });
        }

        res.status(200).json(championships);
    });
};