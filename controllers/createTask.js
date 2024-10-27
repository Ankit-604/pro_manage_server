const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, priority, checklist, dueDate } = req.body;
    const assignTo = req.assignTo || [];

    const task = new Task({
      title,
      priority,
      checklist,
      assignedTo: assignTo,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdBy: userId,
    });

    await task.save();

    const { __v, updatedAt, ...taskData } = task.toObject();

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: taskData,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      error: true,
      message: "Error creating task",
    });
  }
};

module.exports = createTask;
