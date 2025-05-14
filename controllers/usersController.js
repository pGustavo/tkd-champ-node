const db = require('../config/db');
const User = require('../models/User');

exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Erro no banco de dados', error: err.message });
        }
        res.json(users);
    });
};

exports.createUser = (req, res) => {
    const { username, password } = req.body;

    // Validação básica
    if (!username || !password) {
        return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios' });
    }

    // Verificar se o usuário já existe
    User.findByUsername(username, (err, existingUser) => {
        if (err) {
            console.error('Erro ao verificar usuário existente:', err);
            return res.status(500).json({ error: 'Erro ao processar requisição' });
        }

        if (existingUser) {
            return res.status(400).json({ error: 'Nome de usuário já está em uso' });
        }

        // Criar o novo usuário
        User.createUser({ username, password }, (err, newUser) => {
            if (err) {
                console.error('Erro ao criar usuário:', err);
                return res.status(500).json({ error: 'Falha ao criar usuário' });
            }

            res.status(201).json({
                message: 'Usuário criado com sucesso',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    status: newUser.status,
                    role: newUser.role
                }
            });
        });
    });
};

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { username, password, role, status } = req.body;

    // Verificação básica
    if (!userId) {
        return res.status(400).json({ error: 'ID de usuário é obrigatório' });
    }

    // Se o username foi fornecido, verificamos se já existe
    if (username) {
        User.findByUsername(username, (err, existingUser) => {
            if (err) {
                console.error('Erro ao verificar usuário existente:', err);
                return res.status(500).json({ error: 'Erro ao processar requisição' });
            }

            // Se encontrou um usuário com o mesmo nome mas ID diferente
            if (existingUser && existingUser.id != userId) {
                return res.status(400).json({ error: 'Nome de usuário já está em uso' });
            }

            // Se o username está disponível, prosseguir com a atualização
            proceedWithUpdate();
        });
    } else {
        // Se o username não foi fornecido, prosseguir diretamente com a atualização
        proceedWithUpdate();
    }

    // Função para executar a atualização
    function proceedWithUpdate() {
        User.updateUser(userId, { username, role, status }, (err, updatedUser) => {
            if (err) {
                console.error('Erro ao atualizar usuário:', err);
                return res.status(500).json({ error: 'Falha ao atualizar usuário' });
            }

            if (!updatedUser) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.status(200).json({
                message: 'Usuário atualizado com sucesso',
                user: updatedUser
            });
        });
    }
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ error: 'ID de usuário é obrigatório' });
    }

    User.deleteUser(userId, (err, result) => {
        if (err) {
            if (err.message === 'Usuário não encontrado') {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            console.error('Erro ao deletar usuário:', err);
            return res.status(500).json({ error: 'Falha ao deletar usuário' });
        }

        res.status(200).json({
            message: 'Usuário excluído com sucesso',
            id: result.id
        });
    });
};