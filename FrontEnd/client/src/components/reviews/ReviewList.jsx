import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

const ReviewList = (props) => {
  // Debug logs
  console.log('ReviewList props:', props);
  
  // Get the reviews data from props
  // Handle both direct array and response object with data property
  const reviewsData = Array.isArray(props.reviews) 
    ? props.reviews 
    : (props.reviews?.data || []);
  
  const isAdmin = props.isAdmin || false;
  
  console.log('isAdmin:', isAdmin);
  console.log('reviewsData:', reviewsData);
  console.log('Raw reviews prop:', props.reviews);
  const [deletingId, setDeletingId] = useState(null);
  const loading = false; // Loading is handled by parent

  // Function to handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    console.log('Attempting to delete review with ID:', reviewId);
    
    // Ask for confirmation before deleting
    if (!window.confirm('Are you sure you want to delete this review?')) {
      console.log('User cancelled deletion');
      return;
    }

    try {
      // Show loading state
      setDeletingId(reviewId);
      
      // Get the token and user data from localStorage
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      console.log('Auth data from localStorage:', { 
        userId: user?.id,
        userRole: user?.role,
        hasToken: !!token,
        tokenLength: token ? token.length : 0
      });
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      if (!user?.id) {
        throw new Error('User session is invalid. Please log in again.');
      }
      
      // Call the API to delete the review
      const url = `${API_URL}/reviews/${reviewId}`;
      console.log('Making DELETE request to:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Delete response status:', response.status);
      
      // Clone the response to read it multiple times if needed
      const responseClone = response.clone();
      
      // Log response body for debugging
      let responseBody;
      try {
        responseBody = await responseClone.json();
        console.log('Delete response body:', responseBody);
      } catch (e) {
        console.error('Error parsing response body:', e);
      }

      // Handle different response statuses
      if (response.status === 401) {
        // Unauthorized - user is not logged in or token is invalid
        throw new Error('Your session has expired. Please log in again.');
      } else if (response.status === 403) {
        // Forbidden - user is not an admin
        throw new Error('You do not have permission to delete reviews. Admin privileges required.');
      } else if (response.status === 404) {
        throw new Error('Review not found or already deleted.');
      } else if (!response.ok) {
        // Other errors
        throw new Error(`Failed to delete review. Status: ${response.status} ${response.statusText}`);
      }
      
      // If we have a callback function, call it to refresh the reviews
      if (typeof props.onReviewDeleted === 'function') {
        props.onReviewDeleted();
      }
      
      // Show success message
      toast.success('Review was deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to delete review');
      
      // If unauthorized, redirect to login
      if (error.message.includes('log in')) {
        // You might want to redirect to login page here
        // navigate('/login');
      }
    } finally {
      // Hide loading state
      setDeletingId(null);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="py-12">
        <div className="bg-white p-6 rounded-xl mb-6 shadow-sm">
          <p className="text-center text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Show message if there are no reviews
  if (reviewsData.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
        <p className="text-gray-500">Be the first to share your experience with us!</p>
      </div>
    );
  }

  // Show the list of reviews
  return (
    <div className="space-y-6">
      {reviewsData.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start">
            {/* User avatar */}
            <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
              {review.user_name ? review.user_name[0].toUpperCase() : 'U'}
            </div>
            
            <div className="flex-1">
              {/* Review header with name and delete button */}
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-900">
                  {review.user_name || 'Anonymous User'}
                </h4>
                
                {/* Show delete button only for admin */}
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={deletingId === review.id}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Delete this review"
                  >
                    {deletingId === review.id ? (
                      <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                    ) : (
                      <FaTrash className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
              
              {/* Review content */}
              <p className="mt-2 text-gray-700">
                "{review.content}"
              </p>
              
              {/* Review date */}
              <div className="mt-3 text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
