const Task = require("../models/Task");
const User = require("../models/User");

const addPeople = async (req, res) => {
  try {
    const userId = req.userId;
    const userEmail = req.body.userEmail
      ? req.body.userEmail.toLowerCase()
      : null;

    if (!userEmail) {
      return res.status(400).json({
        error: true,
        message: "User email is required.",
      });
    }

    const assignee = await User.findOne({ email: userEmail });

    if (!assignee) {
      return res.status(404).json({
        error: true,
        message: "Unable to find the assignee. Verify the email and try again.",
      });
    }

    if (assignee._id.toString() === userId.toString()) {
      return res.status(401).json({
        error: true,
        message: "You cannot assign tasks to yourself!",
      });
    }

    const tasks = await Task.find({ createdBy: userId });

    if (tasks.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No tasks found to assign.",
      });
    }

    await Task.updateMany(
      { createdBy: userId },
      { $addToSet: { assignedTo: assignee._id } }
    );

    return res.status(200).json({
      success: true,
      data: assignee._id,
      message: "Successfully added assignee to tasks!",
    });
  } catch (error) {
    console.error("Error in adding assignee:", error.message);
    return res.status(500).json({
      error: true,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = addPeople;
