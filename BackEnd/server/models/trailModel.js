// Hardcoded trail data for Nepal MTB trails
const trails = [
  {
    id: 1,
    location: 'Nagarkot Downhill',
    difficulty: 'Hard',
    duration: '3-8 hours',
    distance: '70 km',
    price: 13000.00,
    description: 'A thrilling descent through pine forests and terraced fields, popular for its flowy singletrack and stunning Himalayan views.',
    image_url: '/uploads/trails/nagarkot-trail.png',
    available: true,
    includes: ['Professional guide', 'Mountain bike rental', 'Helmet', 'Lunch', 'Transportation'],
    requirements: ['Moderate fitness level', 'Basic mountain biking experience', 'Valid ID']
  },
  {
    id: 2,
    location: 'Godavari Jungle Ride',
    difficulty: 'Easy',
    duration: '2-3 hours',
    distance: '40 km',
    price: 7000.00,
    description: 'A lush, green ride through the Godavari Botanical Gardens and surrounding jungle, perfect for beginners and nature lovers.',
    image_url: 'https://superdesk-pro-c.s3.amazonaws.com/sd-nepalitimes/20221108121136/636a3fa49c7e80680e04a5d8jpeg.jpg',
    available: true
  },
  {
    id: 3,
    location: 'Shivapuri Heavens Trail',
    difficulty: 'Medium',
    duration: '2-5 hours',
    distance: '20 km',
    price: 10000.00,
    description: 'A challenging cross-country route with technical climbs and descents, traversing the beautiful Shivapuri National Park.',
    image_url: '/uploads/trails/Ride To Heaven Trail.png',
    available: true
  },
  {
    id: 4,
    location: 'Pokhara Peace Pagoda Trail',
    difficulty: 'Medium',
    duration: '3 hours',
    distance: '10 km',
    price: 9000.00,
    description: 'Ride from the lakeside up to the iconic Peace Pagoda, with panoramic views of Pokhara Valley and the Annapurna range.',
    image_url: 'https://www.trippokhara.com/public/uploads/Peace%20Pagoda%20Mountain%20Bike%20Tour-1.jpg'
  },
  {
    id: 5,
    location: 'Bandipur Forest Ride',
    difficulty: 'Medium',
    duration: '2 hours',
    distance: '10 km',
    price: 9000,
    description: 'A scenic ride through Bandipur\'s ancient forests and traditional villages, offering a mix of singletrack and jeep roads.',
    image_url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    id: 6,
    location: 'Jomsom to Muktinath',
    difficulty: 'Hard',
    duration: '6 hours',
    distance: '80 km',
    price: 15000,
    description: 'An epic high-altitude adventure from the windswept valley of Jomsom to the sacred site of Muktinath, with dramatic landscapes.',
    image_url: 'https://cdn.kimkim.com/files/a/content_articles/featured_photos/f93e5d72dfaf8afef117bb7756d8a9af5bcc3bb6/big-34c2bf5d154433b7be4840c021eaf077.jpg'
  },
  {
    id: 7,
    location: 'Kathmandu to Dhulikhel',
    difficulty: 'Easy',
    duration: '6 hours',
    distance: '30 km',
    price: 11000,
    description: 'A gentle ride from the bustling capital to the peaceful hill town of Dhulikhel, passing through rural villages and terraced hills.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqKIKObrQgKB7bgxFQ6h1g9tzDeTJJUnzh0g&s'
  },
  {
    id: 8,
    location: 'Phulchowki Trail',
    difficulty: 'Hard',
    duration: '4 hours',
    distance: '20 km',
    price: 5000,
    description: 'A technical and rewarding climb to the highest hill around Kathmandu, followed by a fast, technical descent through dense forest.',
    image_url: 'https://www.cyclinginnepal.com/images/day-trip/kakani-ride.jpg',
    available: true
  },
  {
    id: 9,
    location: 'Annapurna Circuit Ride',
    difficulty: 'Expert',
    duration: '10 hours',
    distance: '180 km',
    price: 18000,
    description: 'A legendary multi-day ride around the Annapurna massif, featuring high passes, remote villages, and breathtaking mountain scenery.',
    image_url: 'https://www.hikeandbikenepal.com/assets/images/trek/biking-annapurna/Bike.jpg'
  },
  {
    id: 10,
    location: 'Bhujung Trail',
    difficulty: 'Medium',
    duration: '2-3 hours',
    distance: '20 km',
    price: 8000,
    description: 'A hidden gem in central Nepal, this trail winds through picturesque villages and terraced fields, with plenty of flowy singletrack.',
    image_url: 'https://img.freepik.com/premium-photo/aerial-view-bhujung-village-lamjung-nepal_131480-1146.jpg'
  }
];

exports.getAllTrails = async () => trails;

exports.getTrailById = async (id) => trails.find(trail => trail.id === Number(id)); 