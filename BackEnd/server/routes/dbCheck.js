const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route to check database schema
router.get('/schema', async (req, res) => {
  try {
    // Check if database exists
    const [databases] = await db.query("SHOW DATABASES LIKE 'trailblaze_db'");
    if (databases.length === 0) {
      return res.status(400).json({ error: 'Database trailblaze_db does not exist' });
    }

    // Check if tables exist
    await db.query('USE trailblaze_db');
    const [tables] = await db.query("SHOW TABLES");
    
    // Get schema for each table
    const schema = {};
    for (const table of tables) {
      const tableName = table[`Tables_in_trailblaze_db`];
      const [columns] = await db.query(`DESCRIBE ${tableName}`);
      schema[tableName] = columns.map(col => ({
        field: col.Field,
        type: col.Type,
        null: col.Null,
        key: col.Key,
        default: col.Default,
        extra: col.Extra
      }));
    }

    res.json({
      database: 'trailblaze_db',
      tables: Object.keys(schema),
      schema
    });
  } catch (error) {
    console.error('Database check error:', error);
    res.status(500).json({
      error: 'Database check failed',
      details: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql
    });
  }
});

module.exports = router;
