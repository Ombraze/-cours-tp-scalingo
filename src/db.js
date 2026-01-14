const { Pool } = require('pg');

/**
 * CONFIGURATION DE LA BASE DE DONNÉES
 * Tu dois t'assurer que DATABASE_URL est bien définie
 * dans tes variables d'environnement sur Scalingo.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

module.exports = pool;
