import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../config/axios';

// Map difficulty to MTB color/level
const difficultyMap = {
  'easy': 'Green',
  'medium': 'Blue',
  'hard': 'Black'
};

// Trail images mapping
const trailImages = {
  'Nagarkot Downhill': '/images/trails/nagarkot.jpg',
  'Godavari Jungle Ride': '/images/trails/godavari.jpg'
};

const Trips = () => {
  const { trailId } = useParams();
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/trails');
        setTrails(response.data);
      } catch (err) {
        console.error('Error fetching trails:', err);
        setError('Failed to load trails. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrails();
  }, []);

  if (loading) return <div className="text-center py-8">Loading trails...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  if (!trails.length) return <div className="text-center py-8">No trails found.</div>;

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center pt-16 px-4 bg-gray-50">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-green-700 text-center">Available Trails</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trails.map((trail) => (
            <div key={trail.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Trail Image */}
              <div className="relative h-48">
                <img 
                  src={trailImages[trail.name] || '/images/trails/default.jpg'}
                  alt={trail.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="text-white text-xl font-bold mb-2">{trail.name}</h2>
                    <p className="text-white text-sm">{trail.location}</p>
                  </div>
                </div>
              </div>
              {/* Trail Details */}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    trail.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    trail.difficulty === 'medium' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {difficultyMap[trail.difficulty]}
                  </span>
                  <span className="ml-4 text-gray-600">{trail.duration} hours</span>
                  <span className="ml-4 text-gray-600">{trail.distance} km</span>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-2">{trail.description}</p>
                <Link 
                  to={`/trail/${trail.id}`} 
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Details
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trips;