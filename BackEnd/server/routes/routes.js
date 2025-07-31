const express = require('express');
const router = express.Router();

// Trail routes
const trailController = require('../controllers/trailController');
router.get('/trails', trailController.getAllTrails);
router.get('/trails/:id', trailController.getTrailById);

// Booking routes
const bookingRoutes = require('./bookingRoutes');
router.use('/bookings', bookingRoutes);

// Member routes
const memberController = require('../controllers/memberController');
router.get('/members', memberController.getAllMembers);
router.post('/members', memberController.createMember);

// Rental routes
const rentalController = require('../controllers/rentalController');
router.get('/rentals', rentalController.getAllRentals);
router.post('/rentals', rentalController.createRental);

// Review routes
const reviewRoutes = require('./reviewRoutes');
router.use('/reviews', reviewRoutes);

// Bike routes
const bikeRoutes = require('./bikes');
router.use('/bikes', bikeRoutes);

// Support routes
const supportController = require('../controllers/supportController');
router.get('/support', supportController.getSupportInfo);

// Test route to verify database connection
router.get('/test', async (req, res) => {
  try {
    const db = require('../config/db');
    const [rows] = await db.query('SELECT CURRENT_TIMESTAMP() as now');
    res.json({ status: 'OK', timestamp: rows[0].now });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = router;
