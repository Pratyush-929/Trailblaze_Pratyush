const Rental = require('../models/rentalModel');

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.getAllRentals();
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rentals' });
  }
};

exports.createRental = async (req, res) => {
  try {
    console.log('Received rental data:', req.body);
    
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      console.error('Invalid request body:', req.body);
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Log the exact data being sent to the model
    console.log('Sending to model:', req.body);
    
    const rental = await Rental.createRental(req.body);
    console.log('Rental created successfully:', rental);
    res.status(201).json(rental);
  } catch (err) {
    console.error('Error creating rental:', err);
    console.error('Stack trace:', err.stack);
    console.error('Error details:', {
      message: err.message,
      type: err.constructor.name,
      code: err.code,
      stack: err.stack
    });
    
    // Send more detailed error information
    res.status(500).json({ 
      error: 'Failed to create rental', 
      details: err.message,
      type: err.constructor.name,
      code: err.code,
      data: req.body
    });
  }
}; 