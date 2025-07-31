const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Log all headers for debugging
    console.log('Received headers:', JSON.stringify(req.headers, null, 2));
    
    // Check Authorization header
    const authHeader = req.header('Authorization');
    console.log('Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No Bearer token found in Authorization header');
      return res.status(401).json({ 
        success: false,
        message: 'No authentication token provided',
        error: 'Missing or invalid Authorization header format. Expected: Bearer <token>'
      });
    }
    
    const token = authHeader.replace('Bearer ', '').trim();
    console.log('Extracted token:', token ? 'Token present' : 'Token is empty');
    
    if (!token) {
      console.error('Token is empty after extraction');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication failed',
        error: 'No authentication token provided'
      });
    }
    
    // Verify the token
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      console.log('Using JWT secret:', secret ? 'Secret is set' : 'Using default secret');
      
      const decoded = jwt.verify(token, secret);
      console.log('Successfully decoded token:', {
        userId: decoded.id,
        email: decoded.email,
        role: decoded.role,
        exp: decoded.exp ? new Date(decoded.exp * 1000) : 'No expiration'
      });
      
      // Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        console.error('Token has expired');
        return res.status(401).json({ 
          success: false,
          message: 'Authentication failed',
          error: 'Token has expired'
        });
      }
      
      // Attach user to request
      req.user = decoded;
      console.log('Authentication successful for user:', decoded.email);
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      let errorMessage = 'Invalid token';
      
      if (jwtError.name === 'TokenExpiredError') {
        errorMessage = 'Token has expired';
      } else if (jwtError.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token';
      }
      
      return res.status(401).json({ 
        success: false,
        message: 'Authentication failed',
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? jwtError.message : undefined
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = auth;
