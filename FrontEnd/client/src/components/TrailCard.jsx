import React from 'react';
import { useNavigate } from 'react-router-dom';

const TrailCard = ({ trail }) => {
  const navigate = useNavigate();

  const handleBookNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Book Now clicked for trail ID:', trail.id);
    navigate(`/book/${trail.id}`, { replace: false });
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/trails/${trail.id}`, { replace: false });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{trail.name || 'Unnamed Trail'}</h3>
        <p className="text-green-700 font-medium mb-2">{trail.location || 'Location not specified'}</p>
        <div className="text-sm text-gray-600 mb-3 space-y-1">
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
                <span className="font-semibold text-green-700">${trail.price.toFixed(2)}</span>
              </>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-3">
          {trail.description || 'No description available'}
        </p>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <button
            onClick={handleViewDetails}
            className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            View Details
          </button>
          
          <button
            onClick={handleBookNow}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrailCard;