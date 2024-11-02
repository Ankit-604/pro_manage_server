const { query } = require("express");
const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.userId;

    const searchRegex = new RegExp(search, "i");

    const users = await User.find({
      $and: [{ email: query }, { _id: { $ne: userId } }],
    })
      .select("name email _id")
      .limit(10);

    return res.status(200).json({
      success: true,
      message: "Users found successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error while searching for users:", error.message);
    return res.status(500).json({
      error: true,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = getUsers;
