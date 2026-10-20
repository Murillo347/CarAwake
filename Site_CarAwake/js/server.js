const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o MySQL (ajuste a senha se necessário)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '347@GOMes_',
    database: 'carawake_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Base de dados MySQL conectada com sucesso!');
});

// Rota para gravar um alerta (POST)
app.post('/api/alertas', (req, res) => {
    const { tipo, status } = req.body;
    const query = 'INSERT INTO alertas (tipo, status) VALUES (?, ?)';
    
    db.query(query, [tipo, status], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ mensagem: 'Alerta registado com sucesso!', id: result.insertId });
    });
});

// Rota para listar os alertas (GET)
app.get('/api/alertas', (req, res) => {
    db.query('SELECT * FROM alertas ORDER BY data DESC LIMIT 10', (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Servidor a correr na porta 3000');
});