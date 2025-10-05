const User = require('../models/User');

// Check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    req.flash('error', 'Please login to access this page');
    res.redirect('/login');
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.session.userId && req.session.userRole === 'admin') {
    next();
  } else {
    req.flash('error', 'Admin access required');
    res.redirect('/dashboard');
  }
};

// Check if user is staff or admin
const requireStaff = (req, res, next) => {
  if (req.session.userId && (req.session.userRole === 'admin' || req.session.userRole === 'staff')) {
    next();
  } else {
    req.flash('error', 'Staff access required');
    res.redirect('/login');
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('-password');
      req.user = user;
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireStaff,
  getCurrentUser
};
