require('dotenv').config();
const pool = require('../src/db');

/**
 * PARTIE E: ONE-OFF TASK (SEED)
 * Tu dois implémenter un script qui insère des données.
 * Ce script sera lancé via: scalingo run npm run seed
 */
async function runSeed() {
  console.log("Démarrage du script de seed...");

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        count INTEGER DEFAULT 0,
        last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Table 'visits' créée ou déjà existante");

    const checkResult = await pool.query('SELECT * FROM visits LIMIT 1');

    if (checkResult.rows.length === 0) {
      await pool.query('INSERT INTO visits (count) VALUES (100)');
      console.log("✓ Données initiales insérées : 100 visites");
    } else {
      await pool.query('UPDATE visits SET count = count + 50, last_visit = CURRENT_TIMESTAMP');
      console.log("✓ 50 visites ajoutées au compteur existant");
    }
    const result = await pool.query('SELECT count FROM visits');
    console.log(`✓ Nombre total de visites dans la base : ${result.rows[0].count}`);
    console.log("✓ Seed terminé avec succès !");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    await pool.end();
    process.exit(1);
  }
}
runSeed();
