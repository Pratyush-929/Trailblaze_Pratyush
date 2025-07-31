import React, { useState, useEffect, useCallback } from 'react';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import { API_URL } from '../config';

const Reviews = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check authentication and admin status when component mounts
  useEffect(() => {
    try {
      // Get user info from localStorage
      const userJson = localStorage.getItem('user');
      console.log('User from localStorage:', userJson);
      
      if (userJson) {
        const user = JSON.parse(userJson);
        console.log('Parsed user object:', {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          hasToken: !!user.token,
          tokenLength: user.token ? user.token.length : 0
        });
        
        setUserId(user.id || null);
        setUserName(user.name || '');
        
        // Check if user has admin role (case-insensitive check)
        const isUserAdmin = user.role && user.role.toLowerCase() === 'admin';
        console.log('Is user admin?', isUserAdmin);
        
        setIsAdmin(isUserAdmin);
        
        if (isUserAdmin && !user.token) {
          console.error('Admin user is missing token!');
        }
      } else {
        console.log('No user found in localStorage');
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // If there's an error, ensure no admin access
      setIsAdmin(false);
    }
  }, []);

  // Fetch all reviews
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get the token from localStorage
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      const token = user?.token;
      
      console.log('--- Starting fetchReviews ---');
      console.log('Current isAdmin state:', isAdmin);
      console.log('User has token:', !!token);
      console.log('User role:', user?.role);
      
      // If we think we're admin but have no token, log a warning
      if (isAdmin && !token) {
        console.warn('Warning: Admin user detected but no token found!');
      }
      
      // Determine which endpoint to use
      const isAdminRequest = isAdmin && token;
      const endpoint = isAdminRequest ? '/reviews/admin/all' : '/reviews';
      const url = `${API_URL}${endpoint}`;
        
      console.log(`Fetching from: ${url}`);
      
      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add Authorization header if token exists
      if (token) {
        console.log('Including Authorization header with token');
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Request headers:', JSON.stringify(headers, null, 2));
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        credentials: 'include' // Important for cookies if using httpOnly
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        
        // If we got 401 on admin endpoint, fall back to public endpoint
        if (response.status === 401 && isAdminRequest) {
          console.log('Admin access denied, falling back to public reviews');
          setIsAdmin(false);
          return fetchReviews(); // Recursively call with isAdmin=false
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Handle the response format from the backend
      if (result && result.success === true && Array.isArray(result.data)) {
        console.log('Successfully fetched reviews (with success wrapper):', result.data.length);
        setReviews(result.data);
      } else if (Array.isArray(result)) {
        // Fallback in case the endpoint returns a direct array
        console.log('Successfully fetched reviews (direct array):', result.length);
        setReviews(result);
      } else {
        console.error('Unexpected response format:', result);
        throw new Error('Received reviews in an unexpected format');
      }
    } catch (err) {
      console.error('Error in fetchReviews:', err);
      setError('Failed to load reviews. ' + (err.message || ''));
      setReviews([]); // Set empty reviews on error
      
      // If we're not already in a fallback state, try public endpoint
      if (isAdmin) {
        console.log('Error occurred with admin request, falling back to public reviews');
        setIsAdmin(false);
        return fetchReviews(); // Recursively call with isAdmin=false
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Load reviews when the component mounts or when admin status changes
  useEffect(() => {
    // Always fetch reviews when the component mounts or when admin status changes
    fetchReviews();
    
    // Cleanup function to prevent memory leaks
    return () => {
      // Any cleanup code if needed
    };
  }, [isAdmin]); // Re-run when isAdmin changes

  // Handle successful review submission
  const handleReviewSubmitted = (response) => {
    console.log('=== handleReviewSubmitted called ===');
    console.log('Response received:', response);
    
    try {
      // Handle different response formats
      let newReview;
      
      if (response && typeof response === 'object') {
        // Case 1: Response has a data property
        if (response.data) {
          console.log('Found review in response.data');
          newReview = response.data;
        } 
        // Case 2: Response is the review object itself
        else if (response.id || response.content) {
          console.log('Found direct review object in response');
          newReview = response;
        } else {
          console.log('Unexpected response format:', response);
        }
      } else {
        console.log('Response is not an object:', response);
      }
      
      // If we have a valid review, add it to the list
      if (newReview && (newReview.id || newReview.content)) {
        console.log('Adding new review to state:', newReview);
        
        setReviews(prevReviews => {
          // Ensure prevReviews is an array, default to empty array if not
          const previousReviews = Array.isArray(prevReviews) ? prevReviews : [];
          console.log('Previous reviews count:', previousReviews.length);
          
          // Create the new review object with all required fields
          const reviewToAdd = {
            id: newReview.id || Date.now(),
            content: newReview.content || '',
            rating: newReview.rating || 5,
            user_name: newReview.user_name || 'Anonymous',
            created_at: newReview.created_at || new Date().toISOString(),
            status: newReview.status || 'pending' // Default status if not provided
          };
          
          console.log('Adding review:', reviewToAdd);
          
          // Return new array with the new review at the beginning
          return [reviewToAdd, ...previousReviews];
        });
      } else {
        // If we can't find the review in the response, refetch all reviews
        console.log('Could not extract review from response, refetching all reviews');
        fetchReviews();
      }
    } catch (error) {
      console.error('Error in handleReviewSubmitted:', error);
      // Fall back to refetching all reviews if there's an error
      fetchReviews();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto mt-24">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">What our riders are saying about their experiences</p>
    </div>
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading reviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-32">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">What our riders are saying about their experiences</p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Review Form Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16 p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Share Your Experience</h2>
            <p className="text-gray-600 mt-2">We'd love to hear about your adventure with us!</p>
          </div>
          <div className="max-w-2xl mx-auto">
            {userId ? (
              <ReviewForm 
                userId={userId} 
                userName={userName} 
                onReviewSubmitted={handleReviewSubmitted} 
              />
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">Please log in to leave a review</p>
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => console.log('Redirect to login')}
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What Others Are Saying</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <ReviewList reviews={reviews} isAdmin={isAdmin} onReviewDeleted={fetchReviews} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;