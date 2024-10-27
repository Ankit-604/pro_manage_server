const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized access!",
      });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Error retrieving token data:", error.message);
    return res.status(401).json({
      error: true,
      message: "Invalid token",
    });
  }
};

module.exports = validateToken;
