const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).send("User already exists");
    }

    const hashpass = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashpass });
    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const allUsers = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Please fill all the fields");
    }

    const isAdmin =
      email === "admin@example.com" && password === "adminpassword";
    if (!isAdmin) {
      return res.status(401).send("Unauthorized");
    }

    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Please fill all the fields");
    }

    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(400).send("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, checkUser.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }

    const token = jwt.sign(
      { userId: checkUser._id, email: checkUser.email, name: checkUser.name },
      "secret",
      { expiresIn: "10h" }
    );
    res.status(200).json({
      token,

      name: checkUser.name,
      email: checkUser.email,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send("Please fill all the fields");
    }

    const checkUser = await User.findById(req.userId);

    if (!checkUser) {
      return res.status(400).send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      checkUser.password
    );

    if (!isPasswordValid) {
      return res.status(400).send("Invalid old password");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    checkUser.password = hashedPassword;
    await checkUser.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const checkUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // User exists
      return res
        .status(200)
        .json({ exists: true, message: "User found in the database." });
    } else {
      // User does not exist
      return res
        .status(404)
        .json({ exists: false, message: "User not found in the database." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  allUsers,
  registerUser,
  checkUserByEmail,
  loginUser,
  updatePassword,
};
