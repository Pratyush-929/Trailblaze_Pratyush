import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// This component displays a grid of mountain biking trails
const TrailGrid = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  // State to store our trail data
  const [trails, setTrails] = useState([]);
  // State to show loading state
  const [loading, setLoading] = useState(true);
  // State to store any errors
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to fetch trails from our backend
  const fetchTrails = async () => {
    try {
      // Show loading state
      setLoading(true);
      setError(null);
      
      // Fetch data from our backend API using the proxy
      const response = await fetch('/api/trails');
      
      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to fetch trails');
      }
      
      // Get the data from the response
      const data = await response.json();
      
      // Update our state with the trail data
      setTrails(data.map(trail => ({
        ...trail,
        difficulty: trail.difficulty || 'Not specified',
        duration: trail.duration || 'Not specified',
        distance: trail.distance || 'Not specified',
        description: trail.description || 'No description available'
      })));
    } catch (err) {
      // If there's an error, store it in our error state
      setError(err.message);
    } finally {
      // Hide loading state whether we succeed or fail
      setLoading(false);
    }
  };

  // When the component first loads, fetch the trails
  useEffect(() => {
    fetchTrails();
  }, []); // Empty dependency array means this runs once on mount

  // If we're still loading, show a loading message
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading trails...</p>
      </div>
    );
  }

  // If there was an error, show it
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading trails: {error}</p>
      </div>
    );
  }

  // If we have no trails and no error, show a message
  if (trails.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-green-700">No Trails Found</h2>
        <p className="text-gray-600">No trails are currently available. Check back later or contact the admin for more information.</p>
      </div>
    );
  }

  // Admin controls
  if (isAdmin) {
    const handleDeleteTrail = async (trailId) => {
      if (!window.confirm('Are you sure you want to delete this trail?')) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:5050/api/trails/${trailId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete trail');
        }

        setTrails(trails.filter(trail => trail.id !== trailId));
      } catch (error) {
        setError(error.message);
      }
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">Trail Management</h2>
          <button
            onClick={() => navigate('/admin/trails/new')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <FiPlus className="inline-block align-text-bottom mr-2" />
            Add New Trail
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trails.map(trail => (
            <div key={trail.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-1">{trail.name || 'Unnamed Trail'}</h3>
                  <p className="text-green-700 font-medium mb-2">{trail.location || 'Location not specified'}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/trails/${trail.id}/edit`);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                    title="Edit Trail"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTrail(trail.id);
                    }}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                    title="Delete Trail"
                  >
                    <FiTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span>Difficulty: {trail.difficulty || 'Not specified'}</span>
                  <span>•</span>
                  <span>Duration: {trail.duration || 'Not specified'}</span>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <span>Distance: {trail.distance || 'Not specified'}</span>
                  {trail.price > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-gray-600">Price: </span>
                      <span className="font-semibold text-green-700 ml-1">NPR {trail.price.toLocaleString('en-NP')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If we have trails, show them in a grid
  if (trails.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-green-700 text-center">
          Nepal's Top MTB Trails
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trails.map(trail => (
            <div key={trail.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => navigate(`/trails/${trail.id}`)}>
                <div className="w-full h-full">
                  <img 
                    src={trail.image_url.startsWith('/') 
                      ? `http://localhost:5050${trail.image_url}` 
                      : trail.image_url || '/default-trail.jpg'} 
                    alt={trail.name} 
                    className="w-full h-full object-cover object-center"
                    style={{
                      objectPosition: 'center 20%',
                      transform: 'scale(1)',
                      transition: 'transform 0.3s ease-in-out'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-trail.jpg';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{trail.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-2 font-medium">{trail.location}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span>Difficulty: {trail.difficulty}</span>
                    <span className="mx-2">•</span>
                    <span>Duration: {trail.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>Distance: {trail.distance}</span>
                    {trail.price > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-gray-600">Price: </span>
                        <span className="font-semibold text-green-700 ml-1">NPR {trail.price.toLocaleString('en-NP')}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-3 mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {trail.description}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/${trail.id}`);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="text-center py-12">
      <p className="text-gray-600">No trails found.</p>
    </div>
  );
};

export default TrailGrid;