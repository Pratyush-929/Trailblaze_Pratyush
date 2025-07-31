import React, { useState, useEffect } from 'react';
import { FaBicycle, FaCog, FaTachometerAlt, FaTools, FaBolt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Rentals = () => {
  const [bicycles, setBicycles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check if user is admin
    const checkAdminStatus = async () => {
      try {
        // Get the token and user from localStorage
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        console.log('Current user from localStorage:', user);
        console.log('Token exists:', !!token);
        
        if (!token) {
          console.log('No token found, user is not logged in');
          setIsAdmin(false);
          return;
        }
        
        // Decode the token to get the user data
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          
          console.log('Decoded token payload:', payload);
          
          // Check if user is admin (check both token and localStorage)
          const isAdmin = (payload.role === 'admin') || (user.role === 'admin');
          
          if (isAdmin) {
            console.log('User has admin privileges');
            setIsAdmin(true);
            
            // Update the user object in localStorage to include the role if missing
            if (!user.role) {
              user.role = 'admin';
              localStorage.setItem('user', JSON.stringify(user));
            }
          } else {
            console.log('User does not have admin privileges');
            setIsAdmin(false);
          }
        } catch (tokenError) {
          console.error('Error decoding token:', tokenError);
          // Fallback to localStorage role if token decoding fails
          if (user.role === 'admin') {
            console.log('Using admin role from localStorage (token decode failed)');
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
    
    // Fetch bikes from API
    const fetchBikes = async () => {
      try {
        console.log('Fetching bikes...');
        const response = await fetch(`${API_URL}/bikes`);
        if (response.ok) {
          const data = await response.json();
          
          // Debug: Log the raw data from the API with more details
          console.log('Raw bikes data from API (showing first 3 fields of each bike):', 
            data.map(bike => ({
              id: bike.id,
              name: bike.name,
              type: bike.type,
              // Add more fields as needed
            }))
          );
          
          // Debug: Check for duplicates by ID
          const ids = data.map(bike => bike.id);
          const uniqueIds = [...new Set(ids)];
          
          // Check for duplicate IDs
          if (ids.length !== uniqueIds.length) {
            console.warn('Duplicate bike IDs found in API response!');
            const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
            console.warn('Duplicate IDs:', [...new Set(duplicateIds)]);
            
            // Log the duplicate bikes with more details
            [...new Set(duplicateIds)].forEach(duplicateId => {
              const duplicates = data.filter(bike => bike.id === duplicateId);
              console.warn(`Found ${duplicates.length} bikes with ID ${duplicateId}:`, 
                duplicates.map(d => ({
                  id: d.id,
                  name: d.name,
                  type: d.type,
                  price: d.price,
                  // Add more fields as needed
                }))
              );
            });
          }
          
          // Filter out duplicate bikes (same name and type)
          const uniqueBikes = [];
          const seenBikes = new Set();
          
          data.forEach(bike => {
            const bikeKey = `${bike.name}-${bike.type}`;
            if (!seenBikes.has(bikeKey)) {
              seenBikes.add(bikeKey);
              uniqueBikes.push(bike);
            } else {
              console.log(`Removing duplicate bike: ${bike.name} (${bike.type})`);
            }
          });
          
          console.log(`Filtered ${data.length} bikes down to ${uniqueBikes.length} unique bikes`);
          
          // Set the filtered bikes
          setBicycles(uniqueBikes);
        } else {
          console.error('Failed to fetch bikes:', response.status);
        }
      } catch (error) {
        console.error('Error fetching bikes:', error);
      }
    };
    
    fetchBikes();
  }, []);

  const handleDeleteBike = async (id) => {
    if (!id) {
      console.error('No bike ID provided for deletion');
      alert('Error: No bike ID provided');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this bike?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to perform this action');
        return;
      }

      console.log('Deleting bike with ID:', id);
      const response = await fetch(`${API_URL}/bikes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json().catch(() => ({}));
      console.log('Delete response:', { status: response.status, data: responseData });

      if (response.ok) {
        // Remove the bike from the list
        setBicycles(prevBikes => prevBikes.filter(bike => bike.id !== id));
      } else {
        alert(responseData.message || 'Failed to delete bike');
      }
    } catch (error) {
      console.error('Error deleting bike:', error);
      alert('Error deleting bike. Please try again.');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Enduro': 'bg-orange-100 text-orange-800',
      'Downhill': 'bg-red-100 text-red-800',
      'Cross Country': 'bg-blue-100 text-blue-800',
      'All-Mountain': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Premium Mountain Bike Rentals</h1>
          <div className="w-24 h-1 bg-green-600 mb-4"></div>
          <p className="text-xl text-gray-600 max-w-3xl mb-6">
            Choose from our selection of high-performance mountain bikes for your next adventure in the Himalayas.
          </p>
          {isAdmin && (
            <button
              onClick={() => navigate('/admin/add-bike')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FaPlus /> Add New Bike
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {bicycles.map((bike) => (
            <div key={bike.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="relative overflow-hidden h-64">
                <img 
                  src={bike.image} 
                  alt={bike.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1585138829127-731162f0b66d?w=400';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`${getTypeColor(bike.type)} text-xs font-semibold px-3 py-1 rounded-full`}>
                    {bike.type}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-xl font-bold text-white">{bike.name}</h2>
                  <div className="flex items-center text-yellow-400">
                    <span className="text-white text-sm font-medium">Rating: {bike.rating}/5</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-3xl font-bold text-green-600">NPR {bike.price}<span className="text-sm font-normal text-gray-500">/day</span></div>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FaBicycle className="mr-1" />
                    <span className="text-sm">In Stock</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{bike.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaCog className="text-green-500 mr-2" />
                    <span className="text-sm">{bike.features[0]}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaTachometerAlt className="text-green-500 mr-2" />
                    <span className="text-sm">{bike.features[1]}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaBolt className="text-green-500 mr-2" />
                    <span className="text-sm">{bike.features[2]}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <a 
                    href={`/rental/form/${bike.id}`} 
                    className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white text-center font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Rent Now clicked for bike:', bike);
                      navigate(`/rental/form/${bike.id}`);
                    }}
                  >
                    Rent Now
                  </a>
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Delete button clicked for bike:', bike);
                        handleDeleteBike(bike.id);
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rentals; 