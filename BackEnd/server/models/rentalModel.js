const db = require('../config/db');

exports.getAllRentals = async () => {
  const [rows] = await db.query('SELECT * FROM rentals');
  return rows;
};

exports.createRental = async (data) => {
  // Validate required fields
  if (!data.bike_id || !data.customer_name || !data.email || !data.phone || !data.start_date || !data.end_date || !data.pickup_location) {
    throw new Error('Missing required fields');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Invalid email format');
  }

  // Validate phone number (Nepal format)
  const phoneRegex = /^\+977\d{10}$/;
  if (!phoneRegex.test(data.phone)) {
    throw new Error('Invalid phone number format. Please use format: +977XXXXXXXXX');
  }

  // Validate dates
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  if (startDate >= endDate) {
    throw new Error('End date must be after start date');
  }

  // Insert into database
  try {
    // Create table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS rentals (
        id INT PRIMARY KEY AUTO_INCREMENT,
        bike_id INT NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        pickup_location VARCHAR(255) NOT NULL,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [result] = await db.query(
      'INSERT INTO rentals (bike_id, customer_name, email, phone, start_date, end_date, pickup_location, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.bike_id, data.customer_name, data.email, data.phone, data.start_date, data.end_date, data.pickup_location, data.note]
    );
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Database error:', error);
    // Check if it's a database error
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('This rental already exists');
    }
    throw error;
  }
}; 