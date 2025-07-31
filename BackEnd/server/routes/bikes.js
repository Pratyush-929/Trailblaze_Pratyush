const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all bikes
router.get('/', async (req, res) => {
  try {
    const [bikes] = await db.query('SELECT * FROM bikes');
    res.json(bikes);
  } catch (error) {
    console.error('Error fetching bikes:', error);
    res.status(500).json({ message: 'Error fetching bikes' });
  }
});

// Add a new bike (Admin only)
router.post('/', auth, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { name, price, image, description, features, type, rating } = req.body;
  
  try {
    const [result] = await db.query(
      'INSERT INTO bikes (name, price, image, description, features, type, rating) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, price, image, description, JSON.stringify(features), type, rating]
    );
    
    const [newBike] = await db.query('SELECT * FROM bikes WHERE id = ?', [result.insertId]);
    res.status(201).json(newBike[0]);
  } catch (error) {
    console.error('Error adding bike:', error);
    res.status(500).json({ message: 'Error adding bike' });
  }
});

// Update a bike (Admin only)
router.put('/:id', auth, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { id } = req.params;
  const { name, price, image, description, features, type, rating } = req.body;
  
  try {
    await db.query(
      'UPDATE bikes SET name = ?, price = ?, image = ?, description = ?, features = ?, type = ?, rating = ? WHERE id = ?',
      [name, price, image, description, JSON.stringify(features), type, rating, id]
    );
    
    const [updatedBike] = await db.query('SELECT * FROM bikes WHERE id = ?', [id]);
    res.json(updatedBike[0]);
  } catch (error) {
    console.error('Error updating bike:', error);
    res.status(500).json({ message: 'Error updating bike' });
  }
});

// Delete a bike (Admin only)
router.delete('/:id', auth, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { id } = req.params;
  
  try {
    await db.query('DELETE FROM bikes WHERE id = ?', [id]);
    res.status(200).json({ message: 'Bike deleted successfully' });
  } catch (error) {
    console.error('Error deleting bike:', error);
    res.status(500).json({ message: 'Error deleting bike' });
  }
});

module.exports = router;
