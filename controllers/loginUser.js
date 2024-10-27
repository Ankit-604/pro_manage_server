const User = require("../models/User");
const bcrypt = require("bcrypt");
const generatingToken = require("../utils/generatingToken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Incorrect email or password",
      });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: true,
        message: "Incorrect email or password",
      });
    }

    // Generate JWT token
    const token = await generatingToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      error: true,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = loginUser;
