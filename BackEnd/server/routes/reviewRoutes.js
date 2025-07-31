const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Public routes
router.get('/', reviewController.getApprovedReviews);
router.post('/', reviewController.createReview);

// Admin routes - protected with auth and admin middleware
router.get('/admin/all', auth, isAdmin, reviewController.getAllReviews);
router.delete('/:id', auth, isAdmin, reviewController.deleteReview);
// router.post('/:id/reply', reviewController.addAdminReply);
// router.put('/:id/approve', reviewController.approveReview);

module.exports = router;
