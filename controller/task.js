const Task = require("../models/Task");
const User = require("../models/user");
const mongoose = require("mongoose");

const createTask = async (req, res, next) => {
  try {
    const { title, priority, dueDate, checklist, status } = req.body;

    if (!title || !priority || !checklist) {
      return res
        .status(400)
        .json({ message: "Title, priority, checklist are mandatory fields" });
    }

    const newTask = new Task({
      title,
      priority,
      dueDate,
      checklist,
      status,
      userEmail: req.email,
      userId: req.userId,
    });

    await newTask.save();
    console.log(newTask);

    res.status(200).json(newTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
    next(err);
  }
};

const getTasksForUser = async (req, res) => {
  try {
    const { filter } = req.query;
    console.log(filter);
    const now = new Date();

    const dateRanges = {
      today: {
        start: new Date(now.setHours(0, 0, 0, 0)),
        end: new Date(now.setHours(23, 59, 59, 999)),
      },
      thisWeek: {
        start: new Date(now.setDate(now.getDate() - now.getDay())),
        end: new Date(now.setDate(now.getDate() - now.getDay() + 6)),
      },
      thisMonth: {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      },
    };

    const query = { userId: req.userId };

    if (filter && dateRanges[filter]) {
      query.dueDate = {
        $gte: dateRanges[filter].start,
        $lte: dateRanges[filter].end,
      };
    }

    const tasks = await Task.find(query);
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

const updateChecklistItem = async (req, res) => {
  const { taskId, index } = req.params;
  const { checked } = req.body;

  // Validate taskId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ msg: "Invalid Task ID" });
  }

  try {
    let task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    if (index < 0 || index >= task.checklist.length) {
      return res.status(400).json({ msg: "Invalid checklist item index" });
    }

    task.checklist[index].checked = checked;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const updateTask = async (req, res) => {
  const { title, priority, dueDate, checklist } = req.body;
  // Validate taskId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: "Invalid Task ID" });
  }

  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { title, priority, dueDate, checklist } },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const moveTask = async (req, res) => {
  const { taskId, status } = req.body;
  console.log("hi");
  try {
    let task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    task = await Task.findByIdAndUpdate(
      taskId,
      { $set: { status } },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ msg: "Task removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const shareTask = async (req, res) => {
  const taskId = req.params.id;

  // Validate taskId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: "Invalid Task ID" });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const shareLink = `${req.protocol}://${req.get(
      "host"
    )}/api/share/${taskId}`;
    const taskDetails = {
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate,
      checklist: task.checklist,
    };

    res.status(200).json({ message: "Task shared successfully", taskDetails });
  } catch (error) {
    console.error("Error sharing task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  moveTask,
  updateChecklistItem,

  shareTask,
  createTask,
  getTasksForUser,
  updateTask,
  deleteTask,
};
