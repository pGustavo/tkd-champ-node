const Championship = require('../models/Championship');

exports.createChampionship = (req, res) => {
    const championship = req.body;

    if (!championship.name || !championship.location || !championship.date) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    Championship.createChampionship(championship, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao criar campeonato', error: err.message });
        }
        res.status(201).json({ message: 'Campeonato criado com sucesso' });
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