const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('./database');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Agendamento de consulta
app.post('/agendar', [
  check('data').isDate(),
  check('hora').isLength({ min: 5, max: 5 }),
  check('paciente').isLength({ min: 1 }),
  check('medico').isLength({ min: 1 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { data, hora, paciente, medico } = req.body;

  // Insira a consulta no banco de dados
  db.run(
    'INSERT INTO consultas (data, hora, paciente, medico, status) VALUES (?, ?, ?, ?, ?)',
    [data, hora, paciente, medico, 'marcado'],
    (err) => {
      if (err) {
        console.error('Erro ao agendar consulta:', err.message);
        return res.status(500).send('Erro interno do servidor');
      }
      res.status(201).json({ message: 'Consulta agendada com sucesso' });
    }
  );
});

// Listagem de consultas agendadas
app.get('/consultas', (req, res) => {
  db.all('SELECT * FROM consultas', (err, rows) => {
    if (err) {
      console.error('Erro ao buscar consultas:', err.message);
      return res.status(500).send('Erro interno do servidor');
    }
    res.json(rows);
  });
});

// Cancelamento de consulta
app.delete('/cancelar/:id', (req, res) => {
  const consultaId = req.params.id;


  // Atualize o status da consulta para "cancelado"
  db.run(
    'UPDATE consultas SET status = ? WHERE id = ?',
    ['cancelado', consultaId],
    (err) => {
      if (err) {
        console.error('Erro ao cancelar consulta:', err.message);
        return res.status(500).send('Erro interno do servidor');
      }
      res.json({ message: 'Consulta cancelada com sucesso' });
    }
  );
});
