const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Test database connection
router.get('/test', async (req, res) => {
  try {
    // Test if we can connect to the database
    const [rows] = await db.query('SELECT 1');
    
    // Test if users table exists
    const [tableRows] = await db.query('SHOW TABLES LIKE ?', ['users']);
    
    res.json({
      database: 'Connected successfully',
      usersTable: tableRows.length > 0 ? 'Exists' : 'Does not exist'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
