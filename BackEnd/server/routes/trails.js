const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const db = require('../config/db');

// @route   GET /api/trails
// @desc    Get all trails
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [trails] = await db.query('SELECT * FROM trails ORDER BY created_at DESC');
    res.json(trails);
  } catch (err) {
    console.error('Error fetching trails:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/trails
// @desc    Create a new trail
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, location, difficulty, duration, distance, description } = req.body;

  if (!name || !location || !difficulty || !duration || !distance || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO trails (name, location, difficulty, duration, distance, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, location, difficulty, duration, distance, description]
    );
    
    const [trail] = await db.query('SELECT * FROM trails WHERE id = ?', [result.insertId]);
    res.status(201).json(trail[0]);
  } catch (err) {
    console.error('Error creating trail:', err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// @route   PUT /api/trails/:id
// @desc    Update a trail
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { name, location, difficulty, duration, distance, description } = req.body;

  if (!name || !location || !difficulty || !duration || !distance || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      'UPDATE trails SET name = ?, location = ?, difficulty = ?, duration = ?, distance = ?, description = ? WHERE id = ?',
      [name, location, difficulty, duration, distance, description, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Trail not found' });
    }

    const [trail] = await db.query('SELECT * FROM trails WHERE id = ?', [req.params.id]);
    res.json(trail[0]);
  } catch (err) {
    console.error('Error updating trail:', err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// @route   DELETE /api/trails/:id
// @desc    Delete a trail
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM trails WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Trail not found' });
    }
    res.json({ message: 'Trail removed' });
  } catch (err) {
    console.error('Error deleting trail:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
