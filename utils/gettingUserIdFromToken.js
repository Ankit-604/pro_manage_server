const jwt = require("jsonwebtoken");

const gettingUserFromToken = (token) => {
  try {
    const user = jwt.verify(token, process.env.SECRET);
    return user.id;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};

module.exports = gettingUserFromToken;
