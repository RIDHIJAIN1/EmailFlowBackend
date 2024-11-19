// isAuthenticated.js (middleware)
const jwt = require('jsonwebtoken')
const { User } = require('../models')



const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }
    const decoded = jwt.decode(token);
    try {
      const decodedVerified = jwt.verify(token, process.env.OAUTH_SECRET);
      // console.log("Decoded Verified Token:", decodedVerified);
    } catch (error) {
      console.error("JWT verification failed:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = await User.findById(decoded.id);
    req.userId = decoded.id;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = { isAuthenticated };