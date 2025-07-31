const db = require('./config/db');

async function checkTable() {
  try {
    console.log('Checking trails table structure...');
    const [rows] = await db.query('SHOW COLUMNS FROM trails');
    console.log('Trails table columns:');
    console.table(rows);
    
    console.log('\nSample data in trails table:');
    const [trails] = await db.query('SELECT * FROM trails LIMIT 5');
    console.table(trails);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking trails table:', error);
    process.exit(1);
  }
}

checkTable();
