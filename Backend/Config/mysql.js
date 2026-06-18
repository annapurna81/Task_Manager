
const mysql = require('mysql2/promise');

let pool;

async function connectMySQL() {
  try {
    pool = mysql.createPool({
      host:     process.env.MYSQL_HOST     || 'localhost',
      user:     process.env.MYSQL_USER     || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'taskmanager_sessions',
      waitForConnections: true,
      connectionLimit: 10,
    });

    // Test the connection
    const conn = await pool.getConnection();
    console.log('🟢 MySQL connected');

    
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS session_logs (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    VARCHAR(100)  NOT NULL,
        email      VARCHAR(255)  NOT NULL,
        action     VARCHAR(50)   NOT NULL,
        ip_address VARCHAR(50)   DEFAULT 'unknown',
        created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('🟢 MySQL table session_logs ready');
    conn.release();
  } catch (err) {
    console.error('🔴 MySQL connection failed:', err.message);
    console.error('   Make sure MySQL is running and .env credentials are correct');
    process.exit(1);
  }
}

function getPool() {
  return pool;
}

module.exports = connectMySQL;
module.exports.getPool = getPool;
