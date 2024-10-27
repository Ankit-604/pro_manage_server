const { default: mongoose } = require("mongoose");
const Task = require("../models/Task");

const getTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Validate taskId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid Task ID",
      });
    }

    // Fetch task by ID
    const task = await Task.findById(taskId).select(
      "priority title checklist dueDate -_id"
    );

    if (!task) {
      return res.status(404).json({
        error: true,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    console.error("Error fetching task:", error.message);
    return res.status(500).json({
      error: true,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = getTask;
