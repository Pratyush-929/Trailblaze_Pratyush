import React from 'react';

const Contact = () => (
  <div className="min-h-screen flex items-center justify-center pt-28 px-6 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white py-12">
    <div className="max-w-4xl w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-700 mb-3">Get In Touch</h1>
        <div className="w-20 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Welcome to Customer Support/Contact, Have questions or want to book a trail? Reach out to us through any of these channels.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mx-auto w-full max-w-2xl">
        <div className="space-y-6">
          {/* Location */}
          <div className="flex items-start space-x-4 hover:bg-gray-50 p-4 rounded-lg transition">
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Our Location</h3>
              <p className="text-gray-600">Kathmandu, Nepal</p>
            </div>
          </div>

          {/* Email */}
          <a href="mailto:spratyush929@gmail.com" className="flex items-start space-x-4 hover:bg-gray-50 p-4 rounded-lg transition">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Email Us</h3>
              <p className="text-gray-600">spratyush929@gmail.com</p>
            </div>
          </a>

          {/* Phone */}
          <div className="flex items-start space-x-4 hover:bg-gray-50 p-4 rounded-lg transition">
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Call Us</h3>
              <p className="text-gray-600">+977 9864004444</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Follow Our Journey</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/pratyush_929/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition"
              >
                Instagram
              </a>
              <a 
                href="https://www.facebook.com/pratyush929" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              >
                Facebook
              </a>
              <a 
                href="https://www.youtube.com/@Pratyush929/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;
