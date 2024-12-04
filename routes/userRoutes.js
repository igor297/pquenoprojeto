const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para listar todos os usuários
router.get('/usuarios', userController.getUsers);

// Rota para buscar um usuário pelo ID
router.get('/usuarios/:id', userController.getUserById); // Adicionada para corrigir o erro ao carregar usuário para edição

// Rota para criar um usuário
router.post('/usuarios', userController.createUser);

// Rota para editar um usuário
router.put('/usuarios/:id', userController.updateUser);

// Rota para excluir um usuário
router.delete('/usuarios/:id', userController.deleteUser);

module.exports = router;