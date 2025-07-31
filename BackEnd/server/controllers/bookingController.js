const Booking = require('../models/bookingModel');

// Get all bookings (admin view)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAllBookings();
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get bookings for a user by email
exports.getUserBookings = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const bookings = await Booking.getUserBookings(email);
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    console.log('=== NEW BOOKING REQUEST ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Raw body:', JSON.stringify(req.body, null, 2));
    
    const { user_name, email, phone, trail_id, date } = req.body;
    
    // Enhanced validation with detailed error messages
    const missingFields = [];
    if (!user_name) missingFields.push('user_name');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!trail_id) missingFields.push('trail_id');
    if (!date) missingFields.push('date');
    
    if (missingFields.length > 0) {
      console.error('Validation failed - Missing fields:', missingFields);
      return res.status(400).json({ 
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Validation failed - Invalid email format:', email);
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // Prepare booking data with validation
    const bookingData = {
      user_name: user_name.toString().trim(),
      email: email.toString().trim().toLowerCase(),
      phone: phone.toString().trim(),
      trail_id: parseInt(trail_id, 10),
      date: new Date(date).toISOString().split('T')[0] // Ensure proper date format
    };
    
    // Validate trail_id is a number
    if (isNaN(bookingData.trail_id)) {
      console.error('Validation failed - Invalid trail_id:', trail_id);
      return res.status(400).json({
        success: false,
        error: 'trail_id must be a number'
      });
    }
    
    console.log('Creating booking with validated data:', bookingData);
    
    try {
      const booking = await Booking.createBooking(bookingData);
      console.log('Booking created successfully:', booking);
      
      return res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        booking
      });
    } catch (dbError) {
      console.error('Database error in createBooking:', {
        message: dbError.message,
        code: dbError.code,
        sqlMessage: dbError.sqlMessage,
        stack: dbError.stack
      });
      
      // Handle specific database errors
      if (dbError.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          success: false,
          error: 'Invalid trail_id. The specified trail does not exist.'
        });
      }
      
      throw dbError; // Re-throw to be caught by the outer catch
    }
  } catch (err) {
    console.error('Unexpected error in createBooking controller:', {
      error: err,
      message: err.message,
      stack: err.stack,
      code: err.code,
      sqlMessage: err.sqlMessage,
      sql: err.sql
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create booking',
      details: err.message,
      code: err.code,
      sqlMessage: err.sqlMessage
    });
  }
};

// Approve a booking
exports.approveBooking = async (req, res) => {
  try {
    console.log('Approve booking request received:', {
      params: req.params,
      user: req.user,
      body: req.body,
      headers: req.headers
    });

    const { bookingId } = req.params;
    
    if (!bookingId) {
      console.error('No booking ID provided');
      return res.status(400).json({ 
        success: false, 
        error: 'Booking ID is required' 
      });
    }
    
    console.log('Updating booking status to confirmed for ID:', bookingId);
    const updatedBooking = await Booking.updateBookingStatus(bookingId, 'confirmed');
    
    if (!updatedBooking) {
      console.error('Failed to update booking status - booking not found');
      return res.status(404).json({
        success: false,
        error: 'Booking not found or could not be updated'
      });
    }

    console.log('Booking approved successfully:', updatedBooking);
    res.json({
      success: true,
      message: 'Booking approved successfully',
      booking: updatedBooking
    });
  } catch (err) {
    console.error('Error in approveBooking:', {
      message: err.message,
      stack: err.stack,
      params: req.params,
      user: req.user
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to approve booking',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Reject a booking
exports.rejectBooking = async (req, res) => {
  try {
    console.log('Reject booking request received:', {
      params: req.params,
      user: req.user,
      headers: req.headers
    });

    const { bookingId } = req.params;
    
    if (!bookingId) {
      console.error('No booking ID provided');
      return res.status(400).json({ success: false, error: 'Booking ID is required' });
    }
    
    console.log('Updating booking status to rejected for ID:', bookingId);
    // Update status to rejected
    const updatedBooking = await Booking.updateBookingStatus(bookingId, 'rejected');
    
    if (!updatedBooking) {
      console.error('Failed to update booking status - booking not found');
      return res.status(404).json({
        success: false,
        error: 'Booking not found or could not be updated'
      });
    }
    
    const response = {
      success: true,
      message: 'Booking rejected successfully',
      booking: updatedBooking
    };
    
    console.log('Booking rejected successfully:', response);
    res.json(response);
  } catch (err) {
    console.error('Error in rejectBooking:', {
      message: err.message,
      stack: err.stack,
      params: req.params,
      user: req.user
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to reject booking',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // In a real app, you'd verify the user owns this booking
    // by checking the email against the booking record
    
    const result = await Booking.cancelBooking(bookingId);
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      bookingId: result.id
    });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to cancel booking',
      details: err.message
    });
  }
};