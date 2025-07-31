const db = require('../config/db');

// Delete a review
exports.deleteReview = async (id) => {
  try {
    const [result] = await db.query('DELETE FROM reviews WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error in deleteReview:', error);
    throw error;
  }
};

// Get all approved reviews
exports.getAllApprovedReviews = async () => {
  try {
    console.log('Fetching all approved reviews...');
    const [rows] = await db.query('SELECT * FROM reviews WHERE is_approved = 1 ORDER BY created_at DESC');
    console.log(`Found ${rows.length} approved reviews`);
    return rows || [];
  } catch (error) {
    console.error('Error in getAllApprovedReviews:', error);
    throw error;
  }
};

// Get all reviews (admin only)
exports.getAllReviews = async () => {
  try {
    console.log('Fetching all reviews (admin)...');
    const [rows] = await db.query('SELECT * FROM reviews ORDER BY created_at DESC');
    console.log(`Found ${rows.length} total reviews`);
    return rows || [];
  } catch (error) {
    console.error('Error in getAllReviews:', error);
    throw error;
  }
};

// Create a new review
exports.createReview = async ({ user_id = 1, content, rating }) => {
  console.log('Creating review with data:', { user_id, content, rating });
  
  if (!content?.trim()) {
    throw new Error('Review content is required');
  }
  
  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    throw new Error('Rating must be a number between 1 and 5');
  }
  
  try {
    const [result] = await db.query(
      'INSERT INTO reviews (user_id, user_name, content, rating, created_at, is_approved) VALUES (?, "Anonymous", ?, ?, NOW(), 1)',
      [user_id, content.trim(), ratingNum]
    );
    
    console.log('Review inserted with ID:', result.insertId);
    
    const [review] = await db.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
    
    if (!review || !review[0]) {
      throw new Error('Failed to retrieve created review');
    }
    
    console.log('Created review:', review[0]);
    return review[0];
    
  } catch (error) {
    console.error('Error in createReview:', {
      error: error.message,
      stack: error.stack,
      query: 'INSERT INTO reviews (user_id, user_name, content, rating, created_at, is_approved) VALUES (?, "Anonymous", ?, ?, NOW(), 1)',
      params: [user_id, content.trim(), ratingNum]
    });
    throw error;
  }
};