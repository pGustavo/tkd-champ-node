const PoomsaeEntry = require('../models/PoomsaeEntry');


exports.createEntries = (req, res) => {
    const data = req.body;
    const { championshipId } = req.params;

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

function checkDuplicateEntry(entryData, callback) {
    PoomsaeEntry.findByEntryCodeAndPoomsae(
        entryData.entryCode,
        entryData.poomsae,
        entryData.championshipId,
        callback
    );
}

function processMultipleEntries(entries, res) {
    if (entries.length === 0) {
        return res.status(400).json({
            error: 'Nenhum dado fornecido para criar entradas'
        });
    }

    // Primeiro, verificar todas as entradas possíveis duplicatas
    const duplicateChecks = [];

    // Criar uma promessa para cada verificação de duplicata
    entries.forEach(entry => {
        duplicateChecks.push(new Promise((resolve) => {
            checkDuplicateEntry(entry, (err, existingEntry) => {
                if (err || existingEntry) {
                    // Se houve erro ou é duplicata
                    resolve({
                        entry: entry,
                        isDuplicate: !!existingEntry,
                        error: err
                    });
                } else {
                    resolve({
                        entry: entry,
                        isDuplicate: false
                    });
                }
            });
        }));
    });

    // Processar todas as verificações de duplicatas
    Promise.all(duplicateChecks).then(results => {
        const entriesToCreate = [];
        const duplicates = [];
        const errors = [];

        // Separar entradas que podem ser criadas das duplicadas
        results.forEach(result => {
            if (result.isDuplicate) {
                duplicates.push(result.entry);
            } else if (result.error) {
                errors.push({
                    entry: result.entry,
                    error: result.error
                });
            } else {
                preprocessEntry(result.entry);
                entriesToCreate.push(result.entry);
            }
        });

        // Se não há entradas para criar, retornar erro
        if (entriesToCreate.length === 0) {
            return res.status(400).json({
                error: 'Todas as entradas são duplicadas ou contêm erros',
                duplicates: duplicates,
                errors: errors
            });
        }

        // Criar entradas válidas
        const creationPromises = entriesToCreate.map(entry => {
            return new Promise((resolve) => {
                PoomsaeEntry.createEntry(entry, (err, result) => {
                    if (err) {
                        resolve({
                            success: false,
                            entry: entry,
                            error: err.message
                        });
                    } else {
                        resolve({
                            success: true,
                            entry: result
                        });
                    }
                });
            });
        });

        // Processar resultados da criação
        Promise.all(creationPromises).then(creationResults => {
            const successful = creationResults.filter(r => r.success);
            const failed = creationResults.filter(r => !r.success);

            const hasErrors = failed.length > 0 || duplicates.length > 0 || errors.length > 0;
            const statusCode = hasErrors ? 207 : 201; // Multi-Status ou Created

            res.status(statusCode).json({
                message: hasErrors
                    ? 'Algumas entradas foram processadas com erros ou são duplicadas'
                    : 'Todas as entradas foram criadas com sucesso',
                created: successful.length,
                duplicates: duplicates.length,
                errors: failed.length + errors.length,
                results: {
                    successful: successful.map(r => r.entry),
                    duplicates: duplicates,
                    failed: [...failed.map(r => ({ entry: r.entry, error: r.error })), ...errors]
                }
            });
        });
    });
}

function processSingleEntry(entryData, res) {
    // Validação básica
    if (!entryData.entryCode || !entryData.poomsae) {
        return res.status(400).json({
            error: 'Dados incompletos. Código de entrada e poomsae são obrigatórios.'
        });
    }

    preprocessEntry(entryData);

    // Verificar duplicação antes de criar
    checkDuplicateEntry(entryData, (err, existingEntry) => {
        if (err) {
            console.error('Erro ao verificar entrada duplicada:', err);
            return res.status(500).json({
                error: 'Falha ao verificar entrada duplicada'
            });
        }

        if (existingEntry) {
            return res.status(409).json({
                error: 'Entrada duplicada: já existe uma entrada com o mesmo código e poomsae'
            });
        }

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
    });
}

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

exports.getEntriesByLocked = (req, res) => {
    const locked = req.params.locked;

    PoomsaeEntry.getEntriesByLocked(locked, (err, entries) => {
        if (err) {
            console.error('Erro ao buscar entradas de poomsae por árbitro:', err);
            return res.status(500).json({
                error: 'Falha ao buscar entradas de poomsae'
            });
        }

        res.json(entries);
    });
};

exports.updateEntries = (req, res) => {
    const data = req.body;
    const { championshipId } = req.params;

    if (!championshipId) {
        return res.status(400).json({
            error: 'ID do campeonato é obrigatório'
        });
    }

    if (Array.isArray(data)) {
        const updatePromises = data.map(entry => {
            return new Promise((resolve) => {
                entry.championshipId = championshipId;

                if (!entry.id) {
                    resolve({
                        success: false,
                        entry: entry,
                        error: 'ID da entrada é obrigatório para atualização'
                    });
                    return;
                }

                // Buscar entrada existente no banco
                PoomsaeEntry.getEntryById(entry.id, (err, existingEntry) => {
                    if (err || !existingEntry) {
                        resolve({
                            success: false,
                            entry: entry,
                            error: err ? err.message : 'Entrada não encontrada'
                        });
                        return;
                    }

                    // Mesclar dados existentes com os novos
                    const updatedEntry = { ...existingEntry, ...entry };

                    // Verificar se todos os árbitros têm valores válidos
                    const allRefsFilled = [
                        updatedEntry.ref1A, updatedEntry.ref2A, updatedEntry.ref3A,
                        updatedEntry.ref4A, updatedEntry.ref5A,
                        updatedEntry.ref1T, updatedEntry.ref2T, updatedEntry.ref3T,
                        updatedEntry.ref4T, updatedEntry.ref5T
                    ].every(ref => ref != null && ref !== 0);

                    if (allRefsFilled) {
                        updatedEntry.locked = 1;
                    }

                    PoomsaeEntry.updateEntry(updatedEntry, (err, result) => {
                        if (err) {
                            resolve({
                                success: false,
                                entry: entry,
                                error: err.message
                            });
                        } else {
                            resolve({
                                success: true,
                                entry: result || updatedEntry
                            });
                        }
                    });
                });
            });
        });

        Promise.all(updatePromises).then(results => {
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);

            const hasErrors = failed.length > 0;
            const statusCode = hasErrors ? 207 : 200;

            res.status(statusCode).json({
                message: hasErrors
                    ? 'Algumas entradas foram atualizadas com erros'
                    : 'Todas as entradas foram atualizadas com sucesso',
                updated: successful.length,
                errors: failed.length,
                results: {
                    successful: successful.map(r => r.entry),
                    failed: failed.map(r => ({ entry: r.entry, error: r.error }))
                }
            });
        });
    } else {
        data.championshipId = championshipId;

        if (!data.id) {
            return res.status(400).json({
                error: 'ID da entrada é obrigatório para atualização'
            });
        }

        // Buscar entrada existente no banco
        PoomsaeEntry.getEntryById(data.id, (err, existingEntry) => {
            if (err) {
                console.error('Erro ao verificar entrada existente:', err);
                return res.status(500).json({
                    error: 'Falha ao verificar entrada existente'
                });
            }

            if (!existingEntry) {
                return res.status(404).json({
                    error: 'Entrada não encontrada'
                });
            }

            // Mesclar dados existentes com os novos
            const updatedEntry = { ...existingEntry, ...data };

            // Verificar se todos os árbitros têm valores válidos
            const allRefsFilled = [
                updatedEntry.ref1A, updatedEntry.ref2A, updatedEntry.ref3A,
                updatedEntry.ref4A, updatedEntry.ref5A,
                updatedEntry.ref1T, updatedEntry.ref2T, updatedEntry.ref3T,
                updatedEntry.ref4T, updatedEntry.ref5T
            ].every(ref => ref != null && ref !== 0);

            if (allRefsFilled) {
                updatedEntry.locked = 1;
            }

            PoomsaeEntry.updateEntry(updatedEntry, (err, result) => {
                if (err) {
                    console.error('Erro ao atualizar entrada de poomsae:', err);
                    return res.status(500).json({
                        error: 'Falha ao atualizar entrada de poomsae'
                    });
                }

                res.status(200).json({
                    message: 'Entrada de poomsae atualizada com sucesso',
                    data: result || updatedEntry
                });
            });
        });
    }
};

function updateSingleEntry(entryData, res) {
    if (!entryData.id) {
        return res.status(400).json({
            error: 'ID da entrada é obrigatório para atualização'
        });
    }

    PoomsaeEntry.getEntryById(entryData.id, (err, existingEntry) => {
        if (err) {
            console.error('Erro ao verificar entrada existente:', err);
            return res.status(500).json({
                error: 'Falha ao verificar entrada existente'
            });
        }

        if (!existingEntry) {
            return res.status(404).json({
                error: 'Entrada não encontrada'
            });
        }

        // Mescla os dados existentes com os novos
        const updatedEntry = { ...existingEntry, ...entryData };

        PoomsaeEntry.updateEntry(updatedEntry, (err, result) => {
            if (err) {
                console.error('Erro ao atualizar entrada de poomsae:', err);
                return res.status(500).json({
                    error: 'Falha ao atualizar entrada de poomsae'
                });
            }

            res.status(200).json({
                message: 'Entrada de poomsae atualizada com sucesso',
                data: result || updatedEntry
            });
        });
    });
}

function updateMultipleEntries(entries, res) {
    if (entries.length === 0) {
        return res.status(400).json({
            error: 'Nenhum dado fornecido para atualizar entradas'
        });
    }

    const updatePromises = entries.map(entry => {
        return new Promise((resolve) => {
            if (!entry.id) {
                resolve({
                    success: false,
                    entry: entry,
                    error: 'ID da entrada é obrigatório para atualização'
                });
                return;
            }

            PoomsaeEntry.getEntryById(entry.id, (err, existingEntry) => {
                if (err || !existingEntry) {
                    resolve({
                        success: false,
                        entry: entry,
                        error: err ? err.message : 'Entrada não encontrada'
                    });
                    return;
                }

                const updatedEntry = { ...existingEntry, ...entry };

                PoomsaeEntry.updateEntry(updatedEntry, (err, result) => {
                    if (err) {
                        resolve({
                            success: false,
                            entry: entry,
                            error: err.message
                        });
                    } else {
                        resolve({
                            success: true,
                            entry: result || updatedEntry
                        });
                    }
                });
            });
        });
    });

    Promise.all(updatePromises).then(results => {
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        const hasErrors = failed.length > 0;
        const statusCode = hasErrors ? 207 : 200;

        res.status(statusCode).json({
            message: hasErrors
                ? 'Algumas entradas foram atualizadas com erros'
                : 'Todas as entradas foram atualizadas com sucesso',
            updated: successful.length,
            errors: failed.length,
            results: {
                successful: successful.map(r => r.entry),
                failed: failed.map(r => ({ entry: r.entry, error: r.error }))
            }
        });
    });
}