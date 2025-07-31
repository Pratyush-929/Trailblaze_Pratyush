const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('Database configuration:');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('DB_USER:', process.env.DB_USER || 'root');
console.log('DB_NAME:', process.env.DB_NAME || 'trailblaze_db');

// Create connection pool for better handling of connections
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trailblaze_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Test connection
const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Successfully connected to the database');
    
    // Check if bookings table exists and has status column
    try {
      const [rows] = await connection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'bookings'
        AND COLUMN_NAME = 'status'`,
        [process.env.DB_NAME || 'trailblaze_db']
      );
      
      if (rows.length === 0) {
        console.warn('WARNING: The "status" column does not exist in the bookings table');
      } else {
        console.log('Verified "status" column exists in bookings table');
      }
    } catch (err) {
      console.error('Error checking bookings table structure:', err);
    }
    
  } catch (err) {
    console.error('Database connection error:', {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage
    });
  } finally {
    if (connection) await connection.release();
  }
};

// Test the connection when the module loads
testConnection().catch(console.error);

// Export the pool instead of a single connection
module.exports = pool;