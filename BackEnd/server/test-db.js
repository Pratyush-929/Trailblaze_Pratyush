const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
  let connection;
  try {
    // Create a connection to the MySQL server
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trailblaze_db'
    });

    console.log('Successfully connected to MySQL server');

    // Check if database exists
    const [dbs] = await connection.query('SHOW DATABASES');
    console.log('Available databases:', dbs.map(db => db.Database));

    // Check if the database exists
    const dbName = process.env.DB_NAME || 'trailblaze_db';
    const dbExists = dbs.some(db => db.Database === dbName);
    
    if (!dbExists) {
      console.error(`Error: Database '${dbName}' does not exist`);
      return;
    }

    // Switch to the database
    await connection.query(`USE ${dbName}`);
    console.log(`Using database: ${dbName}`);

    // Check if bookings table exists
    const [tables] = await connection.query('SHOW TABLES');
    const tableName = 'bookings';
    const tableExists = tables.some(t => t[`Tables_in_${dbName}`] === tableName);
    
    if (!tableExists) {
      console.error(`Error: Table '${tableName}' does not exist in database '${dbName}'`);
      return;
    }

    console.log(`Table '${tableName}' exists`);

    // Check columns in bookings table
    const [columns] = await connection.query(`DESCRIBE ${tableName}`);
    console.log('\nColumns in bookings table:');
    console.table(columns);

    // Check if status column exists
    const statusColumn = columns.find(col => col.Field === 'status');
    if (!statusColumn) {
      console.error('\nERROR: The "status" column does not exist in the bookings table');
      console.log('\nTo fix this, you need to add the status column to the bookings table:');
      console.log(`ALTER TABLE ${tableName} ADD COLUMN status VARCHAR(20) DEFAULT 'pending';`);
    } else {
      console.log('\nStatus column exists with type:', statusColumn.Type);
    }

    // Show some sample data
    try {
      const [rows] = await connection.query(`SELECT * FROM ${tableName} LIMIT 5`);
      console.log('\nSample data from bookings table:');
      console.table(rows);
    } catch (err) {
      console.error('\nError fetching sample data:', err.message);
    }

  } catch (err) {
    console.error('Database error:', {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage
    });
  } finally {
    if (connection) await connection.end();
    console.log('\nConnection closed');
  }
}

testDatabase().catch(console.error);
