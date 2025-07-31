const db = require('../config/db');

// Get all bookings
exports.getAllBookings = async () => {
  const [rows] = await db.query(`
    SELECT b.*, t.name as trail_name 
    FROM bookings b
    LEFT JOIN trails t ON b.trail_id = t.id
    ORDER BY b.date DESC, b.created_at DESC
  `);
  return rows;
};

// Get bookings by email
exports.getUserBookings = async (email) => {
  const [rows] = await db.query(
    `SELECT * FROM bookings 
     WHERE email = ? 
     ORDER BY date DESC`,
    [email]
  );
  return rows;
};

// Create a new booking
exports.createBooking = async (data) => {
  const { user_name, email, phone, trail_id, date } = data;
  const status = 'pending'; // Default status for new bookings
  
  if (!user_name || !email || !phone || !trail_id || !date) {
    throw new Error('Missing required fields');
  }
  
  const query = `
    INSERT INTO bookings 
    (user_name, email, phone, trail_id, date, status) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  console.log('Executing query:', query);
  console.log('With values:', [user_name, email, phone, trail_id, date, status]);
  
  try {
    const [result] = await db.query(query, [
      user_name, 
      email, 
      phone, 
      trail_id, 
      date,
      status
    ]);
    
    return { 
      id: result.insertId,
      user_name,
      email,
      phone,
      trail_id,
      date,
      status
    };
  } catch (error) {
    console.error('Database error details:', {
      error: error,
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql,
      stack: error.stack
    });
    
    // Provide a more specific error message if possible
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new Error('Database table does not exist. Please run database migrations.');
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      throw new Error('Database column does not exist. Please update your database schema.');
    } else if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('A booking with these details already exists.');
    }
    
    throw error;
  }
};

// Update booking status
exports.updateBookingStatus = async (bookingId, status) => {
  console.log('Updating booking status:', { bookingId, status });
  
  try {
    // First check if booking exists
    const [existing] = await db.query('SELECT id FROM bookings WHERE id = ?', [bookingId]);
    
    if (!existing || existing.length === 0) {
      console.error('Booking not found:', bookingId);
      return null;
    }
    
    // Update the status
    const [result] = await db.query(
      'UPDATE bookings SET status = ? WHERE id = ?', 
      [status, bookingId]
    );
    
    if (result.affectedRows === 0) {
      console.error('No rows affected when updating booking status:', { bookingId, status });
      return null;
    }
    
    // Get the updated booking
    const [updated] = await db.query(
      'SELECT * FROM bookings WHERE id = ?', 
      [bookingId]
    );
    
    console.log('Successfully updated booking status:', updated[0]);
    return updated[0] || { id: bookingId, status };
    
  } catch (error) {
    console.error('Error in updateBookingStatus:', {
      error: error.message,
      stack: error.stack,
      bookingId,
      status
    });
    throw error;
  }
};

// Delete a booking
exports.cancelBooking = async (bookingId) => {
  await db.query('DELETE FROM bookings WHERE id = ?', [bookingId]);
  return { id: bookingId };
};