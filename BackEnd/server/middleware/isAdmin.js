// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  try {
    //  user ko authentication check garne
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // user  admin ho ki hoina check garne
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // User admin ho tara proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error during admin verification' });
  }
};

module.exports = isAdmin;
