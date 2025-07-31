import React, { useState } from 'react';

const Membership = () => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) setSuccess(true);
  };

  return (
    <div className="py-16 px-4 md:px-12">
      <h2 className="text-2xl font-bold mb-4">Membership Registration</h2>
      {success && <div className="text-green-600 mb-2">Registration successful!</div>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Your Name" className="w-full border p-2 rounded" />
        <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Membership; 