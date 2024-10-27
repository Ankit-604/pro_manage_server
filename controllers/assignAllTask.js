const Task = require("../models/Task");

const assignAllTask = async (req, res) => {
  try {
    const { assignTo, userId } = req;

    if (assignTo === userId) {
      return res.status(401).json({
        error: true,
        message: "You cannot assign tasks to yourself!",
      });
    }

    const updateResult = await Task.updateMany(
      { createdBy: userId },
      { $addToSet: { assignedTo: assignTo } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({
        error: true,
        message: "No tasks found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tasks successfully assigned.",
    });
  } catch (error) {
    console.error("Error in assigning tasks:", error.message);
    return res.status(500).json({
      error: true,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = assignAllTask;
