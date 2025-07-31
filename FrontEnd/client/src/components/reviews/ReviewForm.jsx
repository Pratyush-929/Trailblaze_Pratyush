import React, { useState } from 'react';
import { API_URL } from '../../config';

const ReviewForm = ({ onReviewSubmitted }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5); // Default to 5 stars
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('Form submission started');
    
    // Basic validation
    if (!content || !content.trim()) {
      console.log('Validation failed: Empty content');
      setError('Please write your review');
      return;
    }
    
    // Set loading state
    console.log('Setting loading state');
    setLoading(true);
    setError('');
    
    // Create form data
    const formData = {
      content: content.trim(),
      rating: Number(rating) || 5
    };
    
    console.log('Submitting form data:', formData);
    
    // Make the API call
    console.log('Making POST request to:', `${API_URL}/reviews`);
    console.log('Request body:', JSON.stringify(formData));
    
    fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    })
    .then(response => {
      console.log('Received response, status:', response.status);
      if (!response.ok) {
        return response.json().then(errData => {
          console.error('Server error response:', errData);
          throw new Error(errData.message || 'Server returned an error');
        }).catch(() => {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Submission successful, response data:', data);
      
      // Clear the form first
      setContent('');
      
      // Show success message
      setError('Thank you for your review!');
      
      // Notify parent component if callback exists
      if (typeof onReviewSubmitted === 'function') {
        console.log('Calling onReviewSubmitted callback');
        try {
          onReviewSubmitted(data.data || data);
        } catch (callbackError) {
          console.error('Error in onReviewSubmitted:', callbackError);
        }
      }
    })
    .catch(error => {
      console.error('Error during form submission:', {
        error: error.toString(),
        message: error.message,
        stack: error.stack
      });
      setError(error.message || 'Failed to submit review. Please try again.');
    })
    .finally(() => {
      console.log('Form submission process completed');
      setLoading(false);
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Share your experience..."
            disabled={loading}
            required
          />
        </div>
        
        <input 
          type="hidden" 
          name="rating" 
          value={rating} 
          onChange={(e) => setRating(e.target.value)}
        />
        
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white font-medium ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
