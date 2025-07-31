const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const db = require('../config/db');

// @route   GET /api/rentals
// @desc    Get all rentals
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const [rentals] = await db.query('SELECT * FROM rentals ORDER BY created_at DESC');
    res.json(rentals);
  } catch (err) {
    console.error('Error fetching rentals:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/rentals
// @desc    Create a new rental
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, type, price, available, description } = req.body;

  if (!name || !type || !price || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO rentals (name, type, price, available, description) VALUES (?, ?, ?, ?, ?)',
      [name, type, price, available ? 1 : 0, description]
    );
    
    const [rental] = await db.query('SELECT * FROM rentals WHERE id = ?', [result.insertId]);
    res.status(201).json(rental[0]);
  } catch (err) {
    console.error('Error creating rental:', err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// @route   DELETE /api/rentals/:id
// @desc    Delete a rental
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM rentals WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.json({ message: 'Rental removed successfully' });
  } catch (err) {
    console.error('Error deleting rental:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
