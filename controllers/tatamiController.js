const Tatami = require('../models/Tatami');

// Criar um novo tatami
exports.createTatami = (req, res) => {
    const tatamiData = req.body;
    const {championshipId} = req.params;

    if (!championshipId) {
        return res.status(400).json({
            error: 'ID do campeonato é obrigatório'
        });
    }

    // Garantir que o championshipId esteja no objeto
    tatamiData.championshipId = championshipId;

    // Converter area para número inteiro se for fornecido como string
    if (tatamiData.area !== undefined && tatamiData.area !== null) {
        tatamiData.area = parseInt(tatamiData.area, 10);

        if (isNaN(tatamiData.area)) {
            return res.status(400).json({
                error: 'O campo area deve ser um número válido'
            });
        }
    }

    Tatami.createTatami(tatamiData, (err, result) => {
        if (err) {
            console.error('Erro ao criar tatami:', err);
            return res.status(500).json({
                error: 'Falha ao criar tatami'
            });
        }

        res.status(201).json({
            message: 'Tatami criado com sucesso',
            data: result
        });
    });
};

// Obter todos os tatamis
exports.getAllTatamis = (req, res) => {
    Tatami.getAllTatamis((err, tatamis) => {
        if (err) {
            console.error('Erro ao buscar tatamis:', err);
            return res.status(500).json({
                error: 'Falha ao buscar tatamis'
            });
        }

        res.status(200).json({
            count: tatamis.length,
            data: tatamis
        });
    });
};

// Obter tatami por ID
exports.getTatamiById = (req, res) => {
    const {id} = req.params;

    Tatami.getTatamiById(id, (err, tatami) => {
        if (err) {
            console.error('Erro ao buscar tatami:', err);
            return res.status(500).json({
                error: 'Falha ao buscar tatami'
            });
        }

        if (!tatami) {
            return res.status(404).json({
                error: 'Tatami não encontrado'
            });
        }

        res.status(200).json({
            data: tatami
        });
    });
};

// Obter tatamis por championshipId
exports.getTatamisByChampionshipId = (req, res) => {
    const {championshipId} = req.params;

    if (!championshipId) {
        return res.status(400).json({
            error: 'ID do campeonato é obrigatório'
        });
    }

    Tatami.getTatamisByChampionshipId(championshipId, (err, tatamis) => {
        if (err) {
            console.error('Erro ao buscar tatamis do campeonato:', err);
            return res.status(500).json({
                error: 'Falha ao buscar tatamis do campeonato'
            });
        }

        res.status(200).json({
            count: tatamis.length,
            data: tatamis
        });
    });
};

// Atualizar tatami
exports.updateTatami = (req, res) => {
    const {id} = req.params;
    const tatamiData = req.body;

    // Validação básica
    if (!id) {
        return res.status(400).json({
            error: 'ID do tatami é obrigatório'
        });
    }

    if (!tatamiData.championshipId) {
        return res.status(400).json({
            error: 'ID do campeonato é obrigatório'
        });
    }

    // Converter area para número inteiro se for fornecido como string
    if (tatamiData.area !== undefined && tatamiData.area !== null) {
        tatamiData.area = parseInt(tatamiData.area, 10);

        if (isNaN(tatamiData.area)) {
            return res.status(400).json({
                error: 'O campo area deve ser um número válido'
            });
        }
    }

    Tatami.updateTatami(id, tatamiData, (err, result) => {
        if (err) {
            if (err.message === 'Tatami não encontrado') {
                return res.status(404).json({
                    error: 'Tatami não encontrado'
                });
            }
            console.error('Erro ao atualizar tatami:', err);
            return res.status(500).json({
                error: 'Falha ao atualizar tatami'
            });
        }

        res.status(200).json({
            message: 'Tatami atualizado com sucesso',
            data: result
        });
    });
};

// Atualizar árbitros de um tatami
exports.updateTatamiReferees = (req, res) => {
    const {id} = req.params;
    const refereeData = req.body;

    // Validação básica
    if (!id) {
        return res.status(400).json({
            error: 'ID do tatami é obrigatório'
        });
    }

    Tatami.updateTatamiReferees(id, refereeData, (err, result) => {
        if (err) {
            if (err.message === 'Tatami não encontrado') {
                return res.status(404).json({
                    error: 'Tatami não encontrado'
                });
            }
            console.error('Erro ao atualizar árbitros do tatami:', err);
            return res.status(500).json({
                error: 'Falha ao atualizar árbitros do tatami'
            });
        }

        res.status(200).json({
            message: 'Árbitros do tatami atualizados com sucesso',
            data: result
        });
    });
};

// Excluir tatami
exports.deleteTatami = (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.status(400).json({
            error: 'ID do tatami é obrigatório'
        });
    }

    Tatami.deleteTatami(id, (err, result) => {
        if (err) {
            if (err.message === 'Tatami não encontrado') {
                return res.status(404).json({
                    error: 'Tatami não encontrado'
                });
            }
            console.error('Erro ao excluir tatami:', err);
            return res.status(500).json({
                error: 'Falha ao excluir tatami'
            });
        }

        res.status(200).json({
            message: 'Tatami excluído com sucesso',
            data: result
        });
    });
};

// Criar ou atualizar múltiplos tatamis
exports.createOrUpdateMultipleTatamis = (req, res) => {
    const {championshipId} = req.params;
    const tatamis = req.body;

    if (!championshipId) {
        return res.status(400).json({
            error: 'ID do campeonato é obrigatório'
        });
    }

    if (!Array.isArray(tatamis)) {
        return res.status(400).json({
            error: 'Formato inválido. É esperado um array de tatamis'
        });
    }

    // Adicionar championshipId e converter area para número em todos os tatamis
    tatamis.forEach(tatami => {
        tatami.championshipId = championshipId;

        if (tatami.area !== undefined && tatami.area !== null) {
            tatami.area = parseInt(tatami.area, 10);

            if (isNaN(tatami.area)) {
                tatami.area = null; // Definir como null se não for um número válido
            }
        }
    });

    // Processar cada tatami (criar novo ou atualizar existente)
    const operations = tatamis.map(tatami => {
        return new Promise((resolve) => {
            if (tatami.id) {
                // Atualizar tatami existente
                Tatami.updateTatami(tatami.id, tatami, (err, result) => {
                    if (err) {
                        resolve({
                            success: false,
                            error: err.message,
                            tatami
                        });
                    } else {
                        resolve({
                            success: true,
                            operation: 'update',
                            data: result
                        });
                    }
                });
            } else {
                // Criar novo tatami
                Tatami.createTatami(tatami, (err, result) => {
                    if (err) {
                        resolve({
                            success: false,
                            error: err.message,
                            tatami
                        });
                    } else {
                        resolve({
                            success: true,
                            operation: 'create',
                            data: result
                        });
                    }
                });
            }
        });
    });

    Promise.all(operations).then(results => {
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        const created = successful.filter(r => r.operation === 'create');
        const updated = successful.filter(r => r.operation === 'update');

        res.status(failed.length > 0 ? 207 : 200).json({
            message: failed.length > 0
                ? 'Alguns tatamis foram processados com erros'
                : 'Todos os tatamis foram processados com sucesso',
            summary: {
                total: results.length,
                successful: successful.length,
                created: created.length,
                updated: updated.length,
                failed: failed.length
            },
            results: {
                created: created.map(r => r.data),
                updated: updated.map(r => r.data),
                failed: failed.map(r => ({
                    tatami: r.tatami,
                    error: r.error
                }))
            }
        });
    });
};

// Atribuir um árbitro ao primeiro slot vazio em um tatami
exports.assignRefereeToTatami = (req, res) => {
    const { championshipId, tatamiId } = req.params;
    const { refereeId } = req.body;

    // Validação básica
    if (!championshipId || !tatamiId) {
        return res.status(400).json({
            error: 'ID do campeonato e ID do tatami são obrigatórios'
        });
    }

    if (!refereeId) {
        return res.status(400).json({
            error: 'ID do árbitro é obrigatório'
        });
    }

    // Primeiro, buscar o tatami para verificar quais posições estão vazias
    Tatami.getTatamiById(tatamiId, (err, tatami) => {
        if (err) {
            console.error('Erro ao buscar tatami:', err);
            return res.status(500).json({
                error: 'Falha ao buscar informações do tatami'
            });
        }

        if (!tatami) {
            return res.status(404).json({
                error: 'Tatami não encontrado'
            });
        }

        // Verificar se o tatami pertence ao campeonato especificado
        if (tatami.championshipId != championshipId) {
            return res.status(400).json({
                error: 'O tatami não pertence ao campeonato especificado'
            });
        }

        // Verificar se o árbitro já está atribuído a alguma posição neste tatami
        if (
            tatami.ref1 == refereeId ||
            tatami.ref2 == refereeId ||
            tatami.ref3 == refereeId ||
            tatami.ref4 == refereeId ||
            tatami.ref5 == refereeId
        ) {
            return res.status(400).json({
                error: 'Este árbitro já está atribuído a uma posição neste tatami',
                tatami: tatami
            });
        }

        // Encontrar a primeira posição vazia
        let positionAssigned = null;
        const refereeData = {};

        if (!tatami.ref1) {
            refereeData.ref1 = refereeId;
            positionAssigned = "ref1";
        } else if (!tatami.ref2) {
            refereeData.ref2 = refereeId;
            positionAssigned = "ref2";
        } else if (!tatami.ref3) {
            refereeData.ref3 = refereeId;
            positionAssigned = "ref3";
        } else if (!tatami.ref4) {
            refereeData.ref4 = refereeId;
            positionAssigned = "ref4";
        } else if (!tatami.ref5) {
            refereeData.ref5 = refereeId;
            positionAssigned = "ref5";
        }

        if (!positionAssigned) {
            return res.status(400).json({
                error: 'Não há posições disponíveis neste tatami para atribuir o árbitro',
                tatami: tatami
            });
        }

        // Atualizar apenas o campo específico que estava vazio
        Tatami.updateSpecificReferee(tatamiId, positionAssigned, refereeId, (err, result) => {
            if (err) {
                console.error('Erro ao atribuir árbitro ao tatami:', err);
                return res.status(500).json({
                    error: 'Falha ao atribuir árbitro ao tatami'
                });
            }

            res.status(200).json({
                message: 'Árbitro atribuído com sucesso',
                position: positionAssigned,
                data: result
            });
        });
    });
};