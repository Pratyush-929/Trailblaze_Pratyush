const Trail = require('../models/trailModel');

exports.getAllTrails = async (req, res) => {
  try {
    let trails = await Trail.getAllTrails();
    
    // Add booking URL to each trail
    trails = trails.map(trail => ({
      ...trail,
      book_now_url: `/book/${trail.id}`,
      available: trail.available !== false // Default to true if not set
    }));
    
    res.json(trails);
  } catch (err) {
    console.error('Error fetching trails:', err);
    res.status(500).json({ error: 'Failed to fetch trails' });
  }
};

exports.getTrailById = async (req, res) => {
  try {
    const trail = await Trail.getTrailById(req.params.id);
    if (!trail) return res.status(404).json({ error: 'Trail not found' });
    
    // Add booking URL and ensure availability flag
    const trailWithBooking = {
      ...trail,
      book_now_url: `/book/${trail.id}`,
      available: trail.available !== false // Default to true if not set
    };
    
    res.json(trailWithBooking);
  } catch (err) {
    console.error('Error fetching trail:', err);
    res.status(500).json({ error: 'Failed to fetch trail' });
  }
}; 