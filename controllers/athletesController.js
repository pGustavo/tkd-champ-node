const Athlete = require('../models/Athlete');
const db = require('../config/db');

exports.saveAthletes = (req, res) => {
    const athletes = req.body;

    if (!Array.isArray(athletes) || athletes.length === 0) {
        return res.status(400).json({ message: 'A entrada deve ser um array de atletas' });
    }

    db.serialize(() => {
        db.run('BEGIN TRANSACTION'); // Start bulk insertion

        athletes.forEach((athlete, index) => {
            Athlete.saveAthlete(athlete, (err) => {
                if (err) {
                    console.error(`Erro ao inserir atleta no índice ${index}:`, err.message);
                }
            });
        });

        db.run('COMMIT', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao finalizar transação', error: err.message });
            }
            res.status(201).json({ message: 'Atletas salvos com sucesso' });
        });
    });
};

exports.getAllAthletes = (req, res) => {
    Athlete.getAllAthletes((err, athletes) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar atletas', error: err.message });
        }
        res.json(athletes);
    });
};

exports.updateAthlete = (req, res) => {
    const { entryCode } = req.params;
    const updatedData = req.body;

    Athlete.updateAthlete(entryCode, updatedData, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao atualizar atleta', error: err.message });
        }
        res.json({ message: 'Atleta atualizado com sucesso' });
    });
};

exports.deleteAthlete = (req, res) => {
    const { entryCode } = req.params;

    Athlete.deleteAthlete(entryCode, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao deletar atleta', error: err.message });
        }
        res.json({ message: 'Atleta deletado com sucesso' });
    });
};

exports.deleteAllAthletes = (req, res) => {
    Athlete.deleteAllAthletes((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao deletar todos os atletas', error: err.message });
        }
        res.json({ message: 'Todos os atletas foram deletados com sucesso' });
    });
};