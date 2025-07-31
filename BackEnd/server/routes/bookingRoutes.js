const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Get all bookings (admin only)
router.get('/', authenticate, isAdmin, bookingController.getAllBookings);

// Get user's bookings
router.get('/user', authenticate, bookingController.getUserBookings);

// Create a new booking
router.post('/', authenticate, bookingController.createBooking);

// Approve a booking (admin only)
router.put('/:bookingId/approve', authenticate, isAdmin, bookingController.approveBooking);

// Reject a booking (admin only)
router.put('/:bookingId/reject', authenticate, isAdmin, bookingController.rejectBooking);

// Cancel a booking
router.delete('/:bookingId', authenticate, bookingController.cancelBooking);

module.exports = router;
