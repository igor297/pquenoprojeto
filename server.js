const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota de autenticação
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Credenciais fixas para autenticação
    if (email === 'marcio@gmail.com' && password === '1234') {
        return res.json({ token: 'fake-jwt-token', message: 'Login realizado com sucesso.' });
    }

    res.status(401).json({ message: 'Email ou senha inválidos.' });
});

// Usando as rotas definidas
app.use('/', userRoutes);

// Rota padrão para evitar erro "Cannot GET"
app.get('/', (req, res) => {
    res.send('Servidor funcionando. Use as rotas definidas, como /usuarios.');
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});