import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BookingForm = () => {
  const location = useLocation();
  const [form, setForm] = useState({ user_name: '', email: '', date: '' });
  const [success, setSuccess] = useState(false);
  const [trailId, setTrailId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tid = params.get('trailId');
    if (tid) setTrailId(tid);
  }, [location.search]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const bookingData = trailId ? { ...form, trail_id: trailId } : form;
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (res.ok) setSuccess(true);
  };

  return (
    <div className="py-16 px-4 md:px-12">
      <h2 className="text-2xl font-bold mb-4">Book a MTB Trip</h2>
      {success && <div className="text-green-600 mb-2">Booking successful!</div>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input name="user_name" value={form.user_name} onChange={handleChange} required placeholder="Your Name" className="w-full border p-2 rounded" />
        <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="w-full border p-2 rounded" />
        <input name="date" value={form.date} onChange={handleChange} required type="date" className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Book Now</button>
      </form>
    </div>
  );
};

export default BookingForm; 