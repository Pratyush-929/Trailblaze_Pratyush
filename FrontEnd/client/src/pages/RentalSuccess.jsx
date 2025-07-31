import React from 'react';
import { useLocation } from 'react-router-dom';

const RentalSuccess = () => {
  const location = useLocation();
  const rentalData = location.state?.rentalData;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-green-600">
          Rental Request Submitted Successfully!
        </h2>
        <div className="mt-8">
          <p className="text-center text-gray-600">
            Your rental request has been submitted successfully. We will get back to you soon!
          </p>
        </div>
        <div className="mt-6">
          <div className="space-y-4">
            <p className="text-gray-700">Bike ID: {rentalData?.bike_id}</p>
            <p className="text-gray-700">Customer Name: {rentalData?.customer_name}</p>
            <p className="text-gray-700">Phone: {rentalData?.phone}</p>
            <p className="text-gray-700">Pickup Location: {rentalData?.pickup_location}</p>
            <p className="text-gray-700">Rental Period: {rentalData?.start_date} to {rentalData?.end_date}</p>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalSuccess;
