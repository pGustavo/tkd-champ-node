const Championship = require('../models/Championship');

exports.createChampionship = (req, res) => {
    const championship = req.body;

    if (!championship.name || !championship.location || !championship.date) {
        return res.status(400).json({ message: 'Os campos Nome, localizacao e data são obrigatórios' });
    }

    // Define o valor padrão para active se não for fornecido
    if (championship.active === undefined) {
        championship.active = 0; // 0 = inativo, 1 = ativo
    }

    Championship.createChampionship(championship, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao criar campeonato', error: err.message });
        }
        res.status(201).json({ message: 'Campeonato criado com sucesso' });
    });
};

// Modificação no método updateChampionship
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

// Novo método para atualizar apenas o status "active"
exports.updateChampionshipStatus = (req, res) => {
    const { id } = req.params;
    const { active } = req.body;

    if (!id || active === undefined) {
        return res.status(400).json({ message: 'ID e status são obrigatórios' });
    }

    // Se estiver tentando definir o status como ativo (1)
    if (active === 1) {
        // Primeiro, verificar se já existe algum campeonato ativo
        Championship.getAllChampionships((err, championships) => {
            if (err) {
                return res.status(500).json({
                    message: 'Erro ao verificar campeonatos existentes',
                    error: err.message
                });
            }

            // Verificar se existe algum campeonato ativo (exceto o atual)
            const activeChampionship = championships.find(champ =>
                champ.active === 1 && champ.id != id
            );

            if (activeChampionship) {
                return res.status(400).json({
                    message: 'Já existe um campeonato ativo. Desative-o antes de ativar outro.',
                    activeChampionship: activeChampionship
                });
            }

            // Se não existe outro campeonato ativo, podemos ativar este
            Championship.updateChampionshipStatus(id, active, (err) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Erro ao atualizar status do campeonato',
                        error: err.message
                    });
                }
                res.status(200).json({ message: 'Status do campeonato atualizado com sucesso' });
            });
        });
    } else {
        // Se estiver desativando, simplesmente atualizar sem verificações adicionais
        Championship.updateChampionshipStatus(id, active, (err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Erro ao atualizar status do campeonato',
                    error: err.message
                });
            }
            res.status(200).json({ message: 'Status do campeonato atualizado com sucesso' });
        });
    }
};

// Novo método para buscar apenas campeonatos ativos
exports.getActiveChampionships = (req, res) => {
    Championship.getActiveChampionships((err, championships) => {
        if (err) {
            console.error('Erro ao buscar campeonatos ativos:', err.message);
            return res.status(500).json({ error: 'Erro ao buscar campeonatos ativos' });
        }

        res.status(200).json(championships);
    });
};

// Novo método para deletar um campeonato
exports.deleteChampionship = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'O ID é obrigatório' });
    }

    // Inicia uma transação para garantir exclusão atômica
    Championship.deleteAllRelatedData(id, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao deletar dados relacionados', error: err.message });
        }

        Championship.deleteChampionship(id, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao deletar campeonato', error: err.message });
            }
            res.status(200).json({ message: 'Campeonato e dados relacionados deletados com sucesso' });
        });
    });
};