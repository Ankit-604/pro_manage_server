const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    const { name, email, password, newPassword } = req.body;

    // Check if new email already exists
    if (email && email !== user.email) {
      const findByEmail = await User.findOne({ email });
      if (findByEmail) {
        return res.status(400).json({
          error: true,
          message: "User with this email already exists",
        });
      }
    }

    // Verify current password before updating to a new one
    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          error: true,
          message: "Incorrect current password",
        });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
    });
  } catch (error) {
    console.error("Error updating user details:", error.message);
    return res.status(500).json({
      error: true,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = updateUserDetails;
