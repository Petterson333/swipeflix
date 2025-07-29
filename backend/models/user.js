const pool = require('../db');
const bcrypt = require('bcrypt');

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_premium BOOLEAN DEFAULT FALSE
    );
  `);
}

createTable();

async function createUser(email, password) {
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id, email, is_premium;',
    [email, hash]
  );
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1;',
    [email]
  );
  return rows[0];
}

module.exports = { createUser, findByEmail };
