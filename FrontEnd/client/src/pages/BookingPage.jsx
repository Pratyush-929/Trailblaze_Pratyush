import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiCalendar, FiCheckCircle } from 'react-icons/fi';
import api from '../utils/api';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [trail, setTrail] = useState(location.state?.trail || null);
  const [loading, setLoading] = useState(!location.state?.trail);
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const khaltiCheckout = useRef(null);

  // Load Khalti Checkout script
  useEffect(() => {
    // Check if Khalti script is already loaded
    if (window.KhaltiCheckout) {
      initializeKhalti();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js';
    script.async = true;
    script.onload = initializeKhalti;
    script.onerror = () => {
      console.error('Failed to load Khalti script');
      setSubmitStatus({
        success: false,
        message: 'Payment service is currently unavailable. Our team will contact you for payment.'
      });
    };
    document.body.appendChild(script);

    function initializeKhalti() {
      khaltiCheckout.current = new window.KhaltiCheckout({
        publicKey: 'test_public_key_4a3f3e9a6c1048e9b68c7e1c1a3a8f5a',
        productIdentity: `trail-booking-${id}`,
        productName: trail?.name || 'Trail Booking',
        productUrl: window.location.href,
        eventHandler: {
          onSuccess(payload) {
            console.log('Payment successful:', payload);
            setSubmitStatus({
              success: true,
              message: 'Payment successful! Redirecting to trails...'
            });
            setTimeout(() => navigate('/trails'), 2000);
          },
          onError(error) {
            console.error('Payment error:', error);
            setSubmitStatus({
              success: false,
              message: 'Payment failed. Please try again.'
            });
          },
          onClose() {
            console.log('Payment modal closed');
          }
        }
      });
    };

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [id, trail?.name, navigate]);

  // Fetch trail details if not passed in state
  useEffect(() => {
    console.log('Location state:', location.state); // Debug log location state
    console.log('Initial trail state:', trail); // Debug initial trail state
    
    if (!trail) {
      console.log('No trail in state, fetching from API...');
      const fetchTrail = async () => {
        try {
          const response = await fetch(`http://localhost:5050/api/trails/${id}`);
          if (!response.ok) throw new Error('Failed to fetch trail details');
          const data = await response.json();
          console.log('Fetched trail data:', data); // Debug fetched data
          setTrail(data);
        } catch (error) {
          console.error('Error fetching trail:', error);
          setSubmitStatus({ success: false, message: 'Failed to load trail details' });
        } finally {
          setLoading(false);
        }
      };

      fetchTrail();
    } else {
      console.log('Using trail from state:', trail); // Debug using trail from state
      setLoading(false);
    }
  }, [id, trail, location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Format phone number for Khalti (remove any non-digit characters and ensure it starts with 98 or 97)
  const formatPhoneForKhalti = (phone) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Ensure it starts with 98 or 97 and is 10 digits long
    if (digits.length === 10 && (digits.startsWith('98') || digits.startsWith('97'))) {
      return digits;
    }
    // If it's 9 digits and starts with 9, add 98 at the beginning
    if (digits.length === 9 && digits.startsWith('9')) {
      return `98${digits}`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ success: null, message: 'Processing...' });

    try {
      if (!trail) {
        throw new Error('Trail information is missing');
      }

      // Format phone number for Khalti
      const formattedPhone = formatPhoneForKhalti(formData.phone);
      if (!formattedPhone) {
        throw new Error('Please enter a valid Nepali mobile number (e.g., 98XXXXXXXX or 97XXXXXXXX)');
      }

      // Validate all required fields
      const requiredFields = ['user_name', 'email', 'phone', 'date'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Format the date to YYYY-MM-DD
      const formattedDate = new Date(formData.date).toISOString().split('T')[0];
      
      if (!trail || !trail.id) {
        console.error('Trail data is missing ID:', trail);
        throw new Error('Trail information is incomplete. Please go back and try again.');
      }

      // Create the exact data structure that the backend expects
      const bookingData = {
        user_name: formData.user_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        trail_id: trail.id,
        date: formattedDate
      };
      
      console.log('Booking data being sent:', JSON.stringify(bookingData, null, 2)); // Debug log
      console.log('Trail data:', JSON.stringify(trail, null, 2)); // Debug trail data

      console.log('Submitting booking with data:', bookingData);

      try {
        // Use the centralized API client which handles auth headers automatically
        const response = await api.post('/bookings', bookingData);
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        
        // Show Khalti payment modal
        if (window.KhaltiCheckout && khaltiCheckout.current) {
          // Format amount to be at least 100 paisa (1 NPR)
          const amountInPaisa = Math.max(100, trail.price * 100);
          
          khaltiCheckout.current.show({
            amount: amountInPaisa,
            name: formData.user_name,
            email: formData.email,
            mobile: formattedPhone,
            order_id: response.data.bookingId || `trail-${Date.now()}`,
            product_identity: `trail-${trail.id}`,
            product_name: trail.name,
            product_url: window.location.href,
            onSuccess: (payload) => {
              console.log('Payment successful:', payload);
              setSubmitStatus({
                success: true,
                message: 'Payment successful! Redirecting to trails...'
              });
              setTimeout(() => navigate('/trails'), 2000);
            },
            onError: (error) => {
              console.error('Payment error:', error);
              setSubmitStatus({
                success: false,
                message: 'Payment failed. Your booking is confirmed. Our team will contact you for payment.'
              });
            },
            onClose: () => {
              console.log('Payment modal closed');
              setSubmitStatus({
                success: true,
                message: 'Booking confirmed! You can complete the payment later. Our team will contact you. Redirecting...'
              });
              setTimeout(() => navigate('/trails'), 3000);
            }
          });
        }
        
        return response.data;
      
        return responseData;
      } catch (error) {
        console.error('Booking error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        });
        
        // More user-friendly error message
        let errorMessage = 'Failed to create booking. Please try again.';
        
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.status === 401) {
            errorMessage = 'Please log in to make a booking';
          } else if (error.response.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          errorMessage = 'No response from server. Please check your connection.';
        }
        
        // Update the error state to show to the user
        setSubmitStatus({
          success: false,
          message: errorMessage
        });
        
        // Re-throw with a more specific message if needed
        throw new Error(errorMessage);
      }
      
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'Failed to create booking. Please try again.'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading your adventure details...</p>
          <p className="mt-2 text-gray-500">Just a moment while we prepare your booking</p>
        </div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Trail Not Found</h2>
          <p className="mt-3 text-gray-600">The trail you're looking for doesn't exist or has been removed.</p>
          <div className="mt-8">
            <button
              onClick={() => navigate('/trails')}
              className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Back to Trails
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-6 text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Book Your Trail</h1>
          <p className="text-green-100 font-medium">{trail?.name}</p>
          <p className="text-green-100 text-sm">{trail?.location}</p>
        </div>

        {/* Booking Form */}
        <div className="p-6">
          {submitStatus.message && (
            <div className={`mb-4 p-3 rounded ${
              submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {submitStatus.message}
            </div>
          )}

          {!submitStatus.success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Trail Info (readonly) */}
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-black font-medium">{trail?.location}</p>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  required
                  value={formData.user_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 pl-10 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="+977 98XXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tour Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2 pl-10 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="pt-6">
                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Confirm Booking
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back to Trails
                  </button>
                  
                  <p className="text-xs text-center text-gray-500 mt-2">
                    You'll receive a confirmation email with all the details
                  </p>
                  
                  <div className="flex items-center justify-center text-xs text-green-600 mt-2">
                    <FiCheckCircle className="h-4 w-4 mr-1" />
                    <span>Free cancellation up to 24 hours before</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
