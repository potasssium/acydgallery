require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'acydgallery',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('Attempting to connect to database...');
    console.log('Connection config:', {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      database: process.env.DB_NAME || 'acydgallery'
    });
    
    const connection = await pool.getConnection();
    console.log('Database connection successful!');
    
    // Test if users table exists
    try {
      const [rows] = await connection.query('SHOW TABLES LIKE "users"');
      if (rows.length > 0) {
        console.log('Users table exists');
      } else {
        console.log('Users table does not exist');
      }
    } catch (error) {
      console.error('Error checking tables:', error);
    }
    
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    process.exit();
  }
}

testConnection(); 