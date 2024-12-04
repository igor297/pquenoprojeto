const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON onde os usuários serão armazenados
const usersFilePath = path.join(__dirname, '../data/users.json');

// Função para carregar usuários do arquivo JSON
const loadUsers = () => {
    try {
        if (!fs.existsSync(usersFilePath)) {
            fs.writeFileSync(usersFilePath, JSON.stringify([])); // Cria o arquivo vazio se não existir
        }
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao carregar usuários:", error.message);
        return [];
    }
};

// Função para salvar usuários no arquivo JSON
const saveUsers = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Erro ao salvar usuários:", error.message);
    }
};

// Função para listar todos os usuários
const getUsers = (req, res) => {
    try {
        const users = loadUsers();
        res.json(users);
    } catch (error) {
        console.error("Erro ao listar usuários:", error.message);
        res.status(500).json({ message: "Erro ao listar usuários." });
    }
};

// Função para buscar um único usuário pelo ID
const getUserById = (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const users = loadUsers();

        const user = users.find(user => user.id === userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json(user);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error.message);
        res.status(500).json({ message: "Erro ao buscar usuário." });
    }
};

// Função para criar um novo usuário
const createUser = (req, res) => {
    try {
        const users = loadUsers();
        const { nome, email, data_nascimento, genero, cpf, tipo_usuario_id } = req.body;

        // Validação de campos obrigatórios
        if (!nome || !email || !data_nascimento || !genero || !cpf || !tipo_usuario_id) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        // Validação de email único
        const emailExistente = users.some(user => user.email === email);
        if (emailExistente) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        // Criando o novo usuário
        const newUser = {
            id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
            nome,
            email,
            data_nascimento,
            genero,
            cpf,
            tipo_usuario_id,
        };

        users.push(newUser);
        saveUsers(users);

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Erro ao criar usuário:", error.message);
        res.status(500).json({ message: "Erro ao criar usuário." });
    }
};

// Função para editar um usuário
const updateUser = (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { nome, email, data_nascimento, genero, cpf, tipo_usuario_id } = req.body;

        const users = loadUsers();
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Validação de email único (exceto para o próprio usuário)
        if (email && users.some(user => user.email === email && user.id !== userId)) {
            return res.status(400).json({ message: 'Email já cadastrado por outro usuário.' });
        }

        // Atualizando o usuário
        users[userIndex] = {
            ...users[userIndex],
            nome: nome || users[userIndex].nome,
            email: email || users[userIndex].email,
            data_nascimento: data_nascimento || users[userIndex].data_nascimento,
            genero: genero || users[userIndex].genero,
            cpf: cpf || users[userIndex].cpf,
            tipo_usuario_id: tipo_usuario_id || users[userIndex].tipo_usuario_id,
        };

        saveUsers(users);
        res.json(users[userIndex]);
    } catch (error) {
        console.error("Erro ao editar usuário:", error.message);
        res.status(500).json({ message: "Erro ao editar usuário." });
    }
};

// Função para deletar um usuário
const deleteUser = (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        let users = loadUsers();

        const userExists = users.some(user => user.id === userId);
        if (!userExists) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        users = users.filter(user => user.id !== userId);

        saveUsers(users);
        res.json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error.message);
        res.status(500).json({ message: "Erro ao deletar usuário." });
    }
};

module.exports = {
    getUsers,
    getUserById, // Adicionado
    createUser,
    updateUser,
    deleteUser,
};