const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER || "runnerexplorer",
  password: process.env.DB_PASSWORD || "runnerexplorer",
  database: process.env.DB_NAME || "runner_explorer",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
