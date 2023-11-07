const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const jwtMiddleware = () => {
  const checkBearerToken = (req, res, next) => {
    try {
      // Extract the 'authorization' header
      const { authorization: authHeader } = req.headers;
      // Check if the 'authorization' header is missing or doesn't start with 'Bearer'
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token not provided or invalid.' });
      }
      // Using optional chaining to handle potential null or undefined 'authHeader'
      const token = authHeader?.split(' ')[1];
      // Split the token from the header
      const decodedToken = jwt.verify(token, JWT_SECRET);
      // Check if the token couldn't be decoded
      if (!decodedToken) {
        return res.status(401).json({ message: 'Invalid JWT token.' });
      }
      // All controllers should use 'req.decodedToken' instead of 'req.headers'
      req.decodedToken = decodedToken;
      // Move to the next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      // Send an error response with the specific error message
      return res.status(400).json({ message: error.message });
    }
  };

  return checkBearerToken;
};

module.exports = jwtMiddleware;
