import React from 'react';
import { FaMountain, FaBiking, FaGlobeAsia, FaUsers, FaMapMarkedAlt, FaHeart } from 'react-icons/fa';
import founderImage from '../assets/images/founder.jpg';

const About = () => {
  const features = [
    {
      icon: <FaMountain className="text-4xl text-green-600" />,
      title: 'Explore the Himalayas',
      description: 'Discover Nepal\'s most breathtaking trails through the majestic Himalayas.'
    },
    {
      icon: <FaBiking className="text-4xl text-green-600" />,
      title: 'Premium Bikes',
      description: 'Ride with confidence on our top-quality mountain bikes maintained to perfection.'
    },
    {
      icon: <FaGlobeAsia className="text-4xl text-green-600" />,
      title: 'Local Expertise',
      description: 'Benefit from our local guides\' extensive knowledge of trails and culture.'
    }
  ];

  const team = [
    {
      name: 'Pratyush Sharma',
      role: 'Founder',
      image: founderImage
    },
    {
      name: 'Hari Dahal',
      role: 'Operations Manager',
      image: 'https://mbaction.com/wp-content/uploads/2020/03/M3_hardtales_KHS.jpg'
    },
    {
      name: 'Raj Thapa',
      role: 'Lead Guide',
      image: 'https://www.atlasrideco.com/sites/default/files/styles/body_full_size/public/2022-02/MTB%20Tour%20Morzine.jpg?itok=I0t3y8ny'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url(https://himalayansingletrack.com/wp-content/uploads/2022/12/Himalayan-Single-Track-Banner-5-1920x800.jpg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">About TrailBlaze</h1>
            <p className="text-xl">Ride the Himalayas like never before</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            TrailBlaze is Nepal's premier digital platform dedicated to mountain bike tourism. We connect adventure seekers with the most exhilarating trails and experienced guides in the Himalayas, creating unforgettable experiences while supporting local communities.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-green-50 rounded-xl p-8 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <FaHeart className="text-4xl text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              We're on a mission to make mountain biking in Nepal accessible to everyone while promoting sustainable tourism that benefits local communities and preserves the natural beauty of the Himalayas.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-green-700">Sustainability</h3>
                <p className="text-gray-600">We're committed to eco-friendly practices and responsible tourism that protects Nepal's natural environment.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-green-700">Community</h3>
                <p className="text-gray-600">Supporting local economies and creating meaningful connections between travelers and Nepali communities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white text-black rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="overflow-hidden h-64">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className={`w-full h-full object-cover ${member.name === 'Pratyush Sharma' ? 'object-[center_35%]' : 'object-center'}`}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-green-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join us on an unforgettable journey through the heart of the Himalayas.</p>
          <a 
            href="/#trails"
            className="inline-block bg-white text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            Book Your Ride Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;