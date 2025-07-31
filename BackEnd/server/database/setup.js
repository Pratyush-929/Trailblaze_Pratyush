const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  // Create connection without specifying the database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('Dropping existing database if it exists...');
    await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME || 'trailblaze_db'}`);
    
    console.log('Creating new database...');
    await connection.query(`CREATE DATABASE ${process.env.DB_NAME || 'trailblaze_db'}`);
    await connection.query(`USE ${process.env.DB_NAME || 'trailblaze_db'}`);

    console.log('Creating tables...');
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create trails table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS trails (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
        duration INT NOT NULL,
        distance DECIMAL(5,2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        trail_id INT NOT NULL,
        date DATE NOT NULL,
        free_shuttle BOOLEAN DEFAULT TRUE,
        guide_assigned BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (trail_id) REFERENCES trails(id) ON DELETE CASCADE
      )
    `);

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
  }
}

// Run the setup
setupDatabase().catch(console.error);
