const Task = require("../models/Task");
const User = require("../models/User");

const addPeople = async (req, res) => {
  try {
    const { assignTo, userId } = req;

    if (assignTo === userId) {
      return res.status(401).json({
        error: true,
        message: "You cannot add yourself to the board!",
      });
    }

    const task = await Task.find({ createdBy: userId });
    if (task.length === 0) {
      return res.status(404).json({
        error: true,
        message: "You have no task created to add people!",
      });
    }

    await Task.updateMany(
      { createdBy: userId },
      { $addToSet: { assignTo: assignTo } }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully added people to board!",
    });
  } catch (error) {
    console.error("error adding user to board", error.message);
    return res.status(500).json({
      error: true,
      message:
        "Unable to add the assignee. Please verify the user or try again.",
    });
  }
};

module.exports = addPeople;
