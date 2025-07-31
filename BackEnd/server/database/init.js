const db = require('../config/db');

async function initDatabase() {
  try {
    // Test database connection
    console.log('Testing database connection...');
    await db.query('SELECT 1');
    console.log('Database connection successful');

    // Create users table if it doesn't exist
    console.log('Ensuring users table exists...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table ensured');

    // Create rentals table if it doesn't exist
    console.log('Ensuring rentals table exists...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS rentals (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        bike_id INT NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        pickup_location VARCHAR(255) NOT NULL,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Rentals table ensured');

    // Create trails table if it doesn't exist
    console.log('Ensuring trails table exists...');
    await db.query(`
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
    console.log('Trails table ensured');

    // Create bikes table if it doesn't exist
    console.log('Ensuring bikes table exists...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS bikes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        features JSON,
        type VARCHAR(100) NOT NULL,
        rating DECIMAL(3, 1) DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);
    console.log('Bikes table ensured');

    // Create reviews table if it doesn't exist
    console.log('Ensuring reviews table exists...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        trail_id INT NULL,
        user_id INT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        is_approved BOOLEAN DEFAULT TRUE,
        admin_reply TEXT,
        admin_reply_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (trail_id) REFERENCES trails(id) ON DELETE SET NULL
      )`);
      
    console.log('Reviews table created with updated schema');
    
    // Create bookings table if it doesn't exist
    console.log('Ensuring bookings table exists...');
    await db.query(`
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
    console.log('Bookings table ensured');
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Initialize database when file is required
initDatabase();

module.exports = initDatabase;
