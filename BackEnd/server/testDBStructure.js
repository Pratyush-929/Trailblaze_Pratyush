const db = require('./config/db');

async function checkTableStructure() {
  try {
    const [columns] = await db.query('DESCRIBE rentals');
    console.log('Rental Table Structure:');
    console.log(columns);
  } catch (error) {
    console.error('Error checking table structure:', error);
  }
}

checkTableStructure();
