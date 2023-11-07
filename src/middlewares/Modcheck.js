const jwt = require('jsonwebtoken');
const { JWT_SECRET = "fallback_secret" } = process.env;

//Middleware responsável por verificar se o usuário é um moderador.
const modcheck = (req, res, next) => {
  try {
    // The optional chaining operator '?.' is used to avoid errors when the 'authorization' header is undefined.
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: "Access denied. Token not provided.",
        data: null
      });
    }
    // Verifica o token usando o JWT_SECRET para decodificá-lo.
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.isMod) {
      return res.status(401).json({
        error: "Access denied. User not authorized!",
        data: null
      });
    }
    // Se o usuário é um moderador, o token decodificado é armazenado no objeto request
    req.decodedToken = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
        error: "Invalid token.",
        data: null
    });
  }
};

module.exports = modcheck;
