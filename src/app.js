const express = require('express');
const pool = require('./db');
const app = express();

/**
 * PARTIE C: VARIABLES D'ENVIRONNEMENT
 * Tu dois afficher MESSAGE_BIENVENUE et DEBUG ici.
 */
app.get('/', (req, res) => {
  const message = process.env.MESSAGE_BIENVENUE || "Bienvenue sur mon app Express !";
  const debug = process.env.DEBUG || "false";

  res.send(`
    <h1>${message}</h1>
    <p>Debug mode: ${debug}</p>
    <hr>
    <a href="/health">Santé</a> | <a href="/db">Base de données</a>
  `);
});

/**
 * PARTIE A: ROUTE /HEALTH
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

/**
 * PARTIE E: POSTGRESQL
 * Tu dois implémenter une lecture ou écriture en base.
 */
app.get('/db', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        count INTEGER DEFAULT 0,
        last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

   
    const checkResult = await pool.query('SELECT * FROM visits LIMIT 1');

    if (checkResult.rows.length === 0) {
      await pool.query('INSERT INTO visits (count) VALUES (1)');
    } else {
      await pool.query('UPDATE visits SET count = count + 1, last_visit = CURRENT_TIMESTAMP');
    }

    const result = await pool.query('SELECT count, last_visit FROM visits');
    const { count, last_visit } = result.rows[0];

    res.send(`
      <h1>Connexion PostgreSQL réussie !</h1>
      <p>Nombre total de visites : <strong>${count}</strong></p>
      <p>Dernière visite : ${last_visit}</p>
      <hr>
      <a href="/">Retour</a>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Erreur base de données: ${err.message}`);
  }
});

module.exports = app;
