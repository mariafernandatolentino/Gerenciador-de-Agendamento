const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('consultorio.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados');
    db.run(
      'CREATE TABLE IF NOT EXISTS consultas (id INTEGER PRIMARY KEY, data TEXT, hora TEXT, paciente TEXT, medico TEXT, status TEXT)'
    );
  }
});

module.exports = db;
