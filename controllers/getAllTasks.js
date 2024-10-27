const Task = require("../models/Task");
const moment = require("moment");

const getAllTasks = async (req, res) => {
  try {
    const { range } = req.query;
    const userId = req.userId;
    const validRanges = ["today", "week", "month"];
    let dateRange = {};

    if (range && !validRanges.includes(range)) {
      return res.status(400).json({
        error: true,
        message: `Invalid range provided. Valid ranges are: ${validRanges.join(
          ", "
        )}`,
      });
    }

    if (range) {
      dateRange = {
        $gte: moment()
          .startOf(
            range === "today" ? "day" : range === "week" ? "isoWeek" : "month"
          )
          .toDate(),
        $lte: moment()
          .endOf(
            range === "today" ? "day" : range === "week" ? "isoWeek" : "month"
          )
          .toDate(),
      };
    }

    const query = {
      $and: [
        { $or: [{ assignedTo: userId }, { createdBy: userId }] },
        {
          $or: [
            { dueDate: { $exists: false } },
            { dueDate: null },
            ...(range ? [{ dueDate: dateRange }] : []),
          ],
        },
      ],
    };

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .select("-__v -updatedAt");

    return res.status(200).json({
      success: true,
      data: tasks,
      message: `All tasks${range ? ` for ${range}` : ""} fetched successfully`,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      error: true,
      message: "Error fetching tasks. Please try again later.",
    });
  }
};

module.exports = getAllTasks;
