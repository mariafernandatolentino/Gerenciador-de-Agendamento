const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const porta = 3030;

const db = new sqlite3.Database('consultorio.db');

db.run(`
  CREATE TABLE IF NOT EXISTS consultas (
      id INTEGER PRIMARY KEY, 
      data TEXT, 
      hora TEXT, 
      paciente TEXT, 
      medico TEXT, 
      status TEXT
  )
`);

app.use(express.json());
app.use(cors());

// Agendando uma consulta 
app.post('/agendar', (req, res) => {
  const { data, hora, paciente, medico } = req.body;

// Insirindo uma consulta no banco de dados
  db.run(
    'INSERT INTO consultas (data, hora, paciente, medico, status) VALUES (?, ?, ?, ?, ?)',
    [data, hora, paciente, medico, 'marcado'],
    (erro) => {
      if (erro) {
        return res.status(500).json({ erro: erro.message });
      }
      res.status(201).json({ message: 'Consulta agendada com sucesso' });
    }
  );
});

// Listando as consultas agendadas
app.get('/consultas', (req, res) => {
  db.all('SELECT * FROM consultas', (erro, resultados) => {
    if (erro) {
      return res.status(500).json({ erro: erro.message });
    }
    res.json(resultados);
  });
});

// Atualizando o status da consulta para "cancelado"
app.put('/cancelar/:id', (req, res) => {
  const consultaId = req.params.id;

  db.run(
    'UPDATE consultas SET status = ? WHERE id = ?',
    ['cancelado', consultaId],
    (erro) => {
      if (erro) {
        return res.status(500).json({ erro: erro.message });
      }
      res.json({ message: 'Consulta cancelada com sucesso' });
    }
  );
});

app.listen(porta, () => {
  console.log(`Servidor rodando em localhost:${porta}`);
});
