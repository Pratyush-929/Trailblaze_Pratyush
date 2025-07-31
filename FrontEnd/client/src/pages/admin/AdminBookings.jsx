import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { FiRefreshCw, FiCheckCircle, FiXCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      const errorMessage = err.response?.data?.error || 'Failed to load bookings. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Approve a booking
  const handleApprove = async (bookingId) => {
    if (window.confirm('Are you sure you want to approve this booking?')) {
      try {
        console.log('Attempting to approve booking ID:', bookingId);
        const response = await api.put(`/bookings/${bookingId}/approve`);
        console.log('Approve response:', response);
        
        // Update local state
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'confirmed' } 
            : booking
        ));
        
        toast.success('Booking approved successfully');
      } catch (err) {
        console.error('Error approving booking:', {
          message: err.message,
          response: err.response,
          config: err.config
        });
        
        const errorMessage = err.response?.data?.error || err.message || 'Failed to approve booking';
        toast.error(`Error: ${errorMessage}`);
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          window.location.href = '/login';
        }
      }
    }
  };

  // Reject a booking
  const handleReject = async (bookingId) => {
    if (window.confirm('Are you sure you want to reject this booking?')) {
      try {
        console.log('Attempting to reject booking ID:', bookingId);
        const response = await api.put(`/bookings/${bookingId}/reject`);
        console.log('Reject response:', response);
        
        // Update local state to show rejected status
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'rejected' } 
            : booking
        ));
        
        toast.success('Booking rejected successfully');
      } catch (err) {
        console.error('Error rejecting booking:', {
          message: err.message,
          response: err.response,
          config: err.config
        });
        
        const errorMessage = err.response?.data?.error || err.message || 'Failed to reject booking';
        toast.error(`Error: ${errorMessage}`);
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          window.location.href = '/login';
        }
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-800',
        icon: <FiClock className="w-4 h-4" />
      },
      confirmed: {
        bg: 'bg-green-50',
        text: 'text-green-800',
        icon: <FiCheckCircle className="w-4 h-4" />
      },
      rejected: {
        bg: 'bg-red-50',
        text: 'text-red-800',
        icon: <FiXCircle className="w-4 h-4" />
      },
      cancelled: {
        bg: 'bg-red-50',
        text: 'text-red-800',
        icon: <FiXCircle className="w-4 h-4" />
      }
    };

    const config = statusConfig[status] || {
      bg: 'bg-gray-50',
      text: 'text-gray-800',
      icon: null
    };

    return (
      <span 
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        {config.icon && <span className="mr-1.5">{config.icon}</span>}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading && bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        <p className="text-gray-600 text-lg">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-28 px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
          <p className="text-gray-600 mt-1">Approve or reject trail booking requests</p>
        </div>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className={`flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <FiRefreshCw className="animate-spin mr-2" />
              Refreshing...
            </>
          ) : (
            <>
              <FiRefreshCw className="mr-2" />
              Refresh
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No bookings found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.user_name}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.trail_name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status || 'pending'} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(!booking.status || booking.status === 'pending') ? (
                        <>
                          <button
                            onClick={() => handleApprove(booking.id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      ) : booking.status === 'confirmed' ? (
                        <span className="text-green-600">Approved</span>
                      ) : booking.status === 'cancelled' ? (
                        <span className="text-red-600">Rejected</span>
                      ) : (
                        <span className="text-gray-600">Unknown Status</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
