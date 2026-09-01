const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool WITHOUT database specified — used only for DB creation
const rootPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0
});

// Pool WITH database specified — used for all app queries
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const getConnection = async () => {
  return await pool.getConnection();
};

module.exports = {
  pool,
  rootPool,
  getConnection
};
