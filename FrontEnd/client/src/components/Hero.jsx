import React from 'react';

const Hero = () => (
  <section className="relative h-[70vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')" }}>
    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    <div className="relative z-10 text-center text-white">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">Explore Nepal's MTB Trails</h1>
      <p className="mb-6 text-xl md:text-2xl font-light">Adventure, Rentals, and Guided Tours for Every Rider</p>
    </div>
  </section>
);

export default Hero; 