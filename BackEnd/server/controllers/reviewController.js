const Review = require('../models/reviewModel');

// Get all approved reviews
exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.getAllApprovedReviews();
    // Ensure we always return an array, even if undefined or null
    const reviewsArray = Array.isArray(reviews) ? reviews : [];
    res.json({ success: true, data: reviewsArray });
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to load reviews',
      data: [] // Explicitly return empty array on error
    });
  }
};

// Get all reviews (admin only)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.getAllReviews();
    // Ensure we always return an array, even if undefined or null
    const reviewsArray = Array.isArray(reviews) ? reviews : [];
    res.json({ success: true, data: reviewsArray });
  } catch (error) {
    console.error('Error getting all reviews:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to load reviews',
      data: []
    });
  }
};

// Create new review
exports.createReview = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const user_id = 1; // Default user ID for anonymous reviews

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Review content is required'
      });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be a number between 1 and 5'
      });
    }

    const review = await Review.createReview({
      user_id,
      content: content.trim(),
      rating: ratingNum
    });
    
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
    
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create review'
    });
  }
};

// Delete a review (admin only)
exports.deleteReview = async (req, res) => {
  console.log('=== DELETE /reviews/:id ===');
  console.log('Review ID to delete:', req.params.id);
  console.log('Authenticated user:', {
    id: req.user?.id,
    email: req.user?.email,
    role: req.user?.role
  });

  try {
    const { id } = req.params;
    
    // Log the complete request for debugging
    console.log('Request details:', {
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      user: req.user || 'No user in request',
      headers: {
        authorization: req.headers.authorization ? 'Token present' : 'No token',
        'content-type': req.headers['content-type']
      }
    });
    
    console.log(`Attempting to delete review with ID: ${id}`);
    const success = await Review.deleteReview(id);
    
    if (!success) {
      console.log(`Review with ID ${id} not found`);
      return res.status(404).json({ 
        success: false,
        error: 'Review not found' 
      });
    }
    
    console.log(`Successfully deleted review with ID: ${id}`);
    res.json({ 
      success: true,
      message: 'Review deleted successfully' 
    });
  } catch (err) {
    console.error('Error in deleteReview controller:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete review',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Add admin reply to a review
exports.addAdminReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    
    if (!reply) {
      return res.status(400).json({ error: 'Reply content is required' });
    }
    
    const success = await Review.addAdminReply(id, reply);
    
    if (!success) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ message: 'Reply added successfully' });
  } catch (err) {
    console.error('Error adding admin reply:', err);
    res.status(500).json({ error: 'Failed to add admin reply' });
  }
};

// Approve a review (admin only)
exports.approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Review.approveReview(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ message: 'Review approved successfully' });
  } catch (err) {
    console.error('Error approving review:', err);
    res.status(500).json({ error: 'Failed to approve review' });
  }
};