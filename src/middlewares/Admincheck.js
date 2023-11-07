const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// The adminCheck function is a middleware used to check if the user is an admin.
const adminCheck = (req, res, next) => {
  // The optional chaining operator '?.' is used to avoid errors when the 'authorization' header is undefined.
  const token = req.headers.authorization?.split(' ')[1];

  try {
    // Verifies the token using the JWT_SECRET to decode it.
    const decoded = jwt.verify(token, JWT_SECRET);
    const { isAdmin } = decoded;
    // If the user is an Admin, the decoded token is stored in the request object.
    if (isAdmin) {
      req.username = decoded;
      next();
    } else {
      res.status(401).json({ message: 'Access denied. Not authorized!' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = adminCheck;
