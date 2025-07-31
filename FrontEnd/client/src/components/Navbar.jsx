import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Navbar = ({ onAuthChange }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user');
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onAuthChange) onAuthChange();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900 text-white flex justify-between items-center px-8 py-4" onClick={(e) => {
      // Close admin menu when clicking outside
      if (!e.target.closest('.relative')) {
        setShowAdminMenu(false);
      }
    }}>
      <Link to="/" className="font-extrabold text-2xl text-green-400 tracking-tight hover:text-green-300 transition">TrailBlaze</Link>
      <div className="space-x-8 text-lg font-medium">
        <Link to="/" className="hover:text-green-400 transition">Home</Link>
        <Link to="/about" className="hover:text-green-400 transition">About</Link>
        <Link to="/rental" className="hover:text-green-400 transition">Rentals</Link>
        <Link to="/reviews" className="hover:text-green-400 transition">Reviews</Link>
        <Link to="/contact" className="hover:text-green-400 transition">Contact</Link>
        {isLoggedIn ? (
          <>
            {JSON.parse(localStorage.getItem('user')).role === 'admin' && (
              <div className="relative inline-block text-left group">
                <button 
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="flex items-center hover:text-green-400 transition"
                >
                  Admin
                  {showAdminMenu ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
                </button>
                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link 
                        to="/admin/bookings" 
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setShowAdminMenu(false)}
                      >
                        Manage Bookings
                      </Link>
                      <Link 
                        to="/admin/add-bike" 
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setShowAdminMenu(false)}
                      >
                        Add Bike
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
            <button onClick={handleLogout} className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-green-400 transition">Login</Link>
            <Link to="/register" className="hover:text-green-400 transition">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 