import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Reviews from './Reviews';

const TrailDetails = () => {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5050/api/trails/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trail details');
        }
        const data = await response.json();
        setTrail(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrail();
  }, [id]);

  const handleBookTrail = () => {
    // Pass the trail data to the booking page using state
    navigate(`/book/${id}`, { state: { trail } });
  };

  // Format difficulty to match MTB standards
  const difficultyMap = {
    'easy': 'Green',
    'medium': 'Blue',
    'hard': 'Black'
  };
  const difficultyLevel = difficultyMap[trail?.difficulty?.toLowerCase()] || 'Unknown';

  // Default trail details structure
  const defaultTrailDetails = {
    highlights: [
      'Breathtaking mountain views',
      'Professional guide available',
      'Well-maintained trails',
      'Suitable for various skill levels',
      'Scenic routes through nature'
    ],
    whatToBring: [
      'Helmet (required)',
      'Appropriate riding gear',
      'Water bottle',
      'Snacks',
      'Sunscreen',
      'First aid kit'
    ],
    price: 45, // in USD
    guideFee: 25, // in USD
    equipmentRental: 25, // in USD
    total: 95 // in USD
  };

  // Get trail-specific details or use defaults
  const trailDetails = trail ? {
    ...defaultTrailDetails,
    // Override with trail-specific details if available
    ...(trail.name === 'Nagarkot Downhill' ? {
      highlights: [
        'Spectacular views of the Himalayas',
        'Perfect for intermediate riders',
        'Technical singletrack sections',
        'Scenic forest trails',
        'Professional guide available'
      ]
    } : trail.name === 'Godavari Jungle Ride' ? {
      highlights: [
        'Wild jungle experience',
        'Wildlife viewing opportunities',
        'Technical forest trails',
        'River crossings',
        'Guide-led wildlife spotting'
      ],
      whatToBring: [
        'Full-face helmet',
        'Gloves',
        'Water bottle',
        'Sun protection',
        'Insect repellent',
        'Camera'
      ],
      price: 40, // in USD
      guideFee: 25, // in USD
      equipmentRental: 15, // in USD
      total: 80 // in USD
    } : {})
  } : defaultTrailDetails;

  const trailInfo = trailDetails[trail.name] || {};

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2 text-green-700">{trail.name}</h2>
            <p className="text-gray-600">{trail.location}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Trail Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    trail.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    trail.difficulty === 'medium' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {difficultyLevel}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span> {trail.duration} hours
                </div>
                <div>
                  <span className="text-gray-600">Distance:</span> {trail.distance} km
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Pricing</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Trail Fee:</span> ${trailInfo.price}
                </div>
                <div>
                  <span className="text-gray-600">Guide Fee:</span> ${trailInfo.guideFee}
                </div>
                <div>
                  <span className="text-gray-600">Equipment Rental:</span> ${trailInfo.equipmentRental}
                </div>
                <div className="font-bold text-xl">
                  <span className="text-gray-600">Total:</span> ${trailInfo.total}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Trail Description</h3>
            <p className="text-gray-700 leading-relaxed">{trail.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Highlights</h3>
            <ul className="list-disc list-inside text-gray-700">
              {trailInfo.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">What to Bring</h3>
            <ul className="list-disc list-inside text-gray-700">
              {trailInfo.whatToBring.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleBookTrail}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>Book This Trail</span>
              <span className="text-xl">→</span>
            </button>
            <div className="text-gray-600">
              <span className="font-bold">${trailInfo.total}</span> per person
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
        <Reviews trailId={trailId} />
      </div>
    </div>
  );
};

export default TrailDetails; 