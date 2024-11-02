const jwt = require("jsonwebtoken");
require("dotenv").config();

const generatingToken = (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id: userId },
      process.env.SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          console.error("Error generating token:", err);
          reject(new Error("Token generation failed"));
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = generatingToken;
