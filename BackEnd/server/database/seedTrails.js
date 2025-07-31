const db = require('../config/db');

const trails = [
  {
    name: 'Nagarkot Downhill',
    location: 'Nagarkot, Nepal',
    difficulty: 'Medium',
    description: 'Experience the thrilling downhill ride from Nagarkot with breathtaking views of the Himalayas. This trail offers a mix of forest paths and village trails. Duration: 4-5 hours, Distance: 25.5 km.'
  },
  {
    name: 'Shivapuri Trail',
    location: 'Shivapuri National Park',
    difficulty: 'Hard',
    description: 'Challenging trail through Shivapuri National Park with steep climbs and technical descents through dense forests. Duration: 6-7 hours, Distance: 35.2 km.'
  },
  {
    name: 'Godavari to Phulchowki',
    location: 'Godavari',
    difficulty: 'Medium',
    description: 'Scenic ride through the Godavari botanical garden leading up to Phulchowki hill with beautiful forest trails. Duration: 5-6 hours, Distance: 28.7 km.'
  }
];

async function seedTrails() {
  try {
    console.log('Starting to seed trails...');
    
    // Clear existing trails
    await db.query('DELETE FROM trails');
    
    // Insert new trails
    for (const trail of trails) {
      await db.query(
        'INSERT INTO trails (name, location, difficulty, description) VALUES (?, ?, ?, ?)',
        [trail.name, trail.location, trail.difficulty, trail.description]
      );
      console.log(`Added trail: ${trail.name}`);
    }
    
    console.log('Successfully seeded trails!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding trails:', error);
    process.exit(1);
  }
}

seedTrails();
