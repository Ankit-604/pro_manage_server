const Task = require("../models/Task");

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, checklist, priority, dueDate, status, itemId, checked } =
      req.body;
    const assignTo = req.assignTo ? [req.assignTo] : [];

    let updateFields = {};

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!task.assignTo) {
      task.assignTo = [];
    }

    if (itemId && checked !== undefined) {
      const updateResult = await Task.updateOne(
        { _id: taskId, "checklist.itemId": itemId },
        { $set: { "checklist.$.checked": checked } },
        { new: true, runValidators: true }
      );

      if (updateResult.modifiedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Failed to update checklist item or item not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Checklist item status updated successfully",
      });
    }

    if (assignTo.length) {
      if (task.assignTo.includes(assignTo[0])) {
        return res.status(401).json({
          error: true,
          message: "Task is already assigned to the user",
        });
      }

      if (assignTo[0] === task.createdBy.toString()) {
        return res.status(401).json({
          error: true,
          message: "You cannot assign the task to yourself!",
        });
      }

      updateFields.assignTo = [...task.assignTo, assignTo[0]];
    }

    if (title) updateFields.title = title;
    if (priority) updateFields.priority = priority;
    if (dueDate) updateFields.dueDate = dueDate;
    if (status) updateFields.status = status;
    if (checklist) updateFields.checklist = checklist;

    await Task.findByIdAndUpdate(taskId, updateFields, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully!",
    });
  } catch (error) {
    console.error("Error updating the task:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = updateTask;
