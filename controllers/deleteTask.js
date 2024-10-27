const Task = require("../models/Task");

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find the task by ID
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Ensure the task is created by the user making the request
    if (task.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    // Delete the task
    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting the task:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = deleteTask;
