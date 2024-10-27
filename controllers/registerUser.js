const User = require("../models/User");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { name, email: reqEmail, password } = req.body;
  const email = reqEmail.toLowerCase();

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        error: true,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({
      error: true,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = registerUser;
