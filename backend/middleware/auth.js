const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // "Bearer <token>"
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token — throws error if expired or tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user to request (excluding password)
    req.user = await User.findById(decoded.id).select('-password');
    next(); // Proceed to the route handler
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };