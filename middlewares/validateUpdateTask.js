const { body, validationResult } = require("express-validator");
const moment = require("moment");
const mongoose = require("mongoose");

const validateUpdateTask = async (req, res, next) => {
  // Clean up request body
  for (const key in req.body) {
    if (
      req.body[key] === "" ||
      req.body[key] === null ||
      req.body[key] === undefined
    ) {
      delete req.body[key];
    }
    if (
      typeof req.body[key] === "object" &&
      Object.keys(req.body[key]).length === 0
    ) {
      delete req.body[key];
    }
  }

  // Validate email
  await body("userEmail")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .customSanitizer((value) => value.toLowerCase())
    .run(req);

  // Validate title
  await body("title")
    .optional()
    .notEmpty()
    .withMessage("Title is required")
    .run(req);

  // Validate priority
  await body("priority")
    .optional()
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["low", "moderate", "high"])
    .withMessage("Priority must be one of the following: low, moderate, high")
    .run(req);

  // Validate status
  await body("status")
    .optional()
    .isIn(["in-progress", "done", "to-do", "backlog"])
    .withMessage(
      "Status must be one of the following: in-progress, done, to-do, backlog"
    )
    .run(req);

  // Validate due date
  await body("dueDate")
    .optional()
    .isDate()
    .withMessage(
      "Please provide a valid date (format: YYYY-MM-DD, YYYY-MM-DDTHH:mm, RFC 1123, or a human-readable format)"
    )
    .custom((value) => {
      const dueDate = moment(value, moment.ISO_8601, true);
      const today = moment().startOf("day");
      if (!dueDate.isValid()) {
        throw new Error("Please provide a valid date");
      }
      if (dueDate.isBefore(today)) {
        throw new Error("Due date cannot be in the past");
      }
      return true;
    })
    .run(req);

  // Validate checklist
  await body("checklist")
    .optional()
    .notEmpty()
    .withMessage("Checklist is required")
    .isArray()
    .withMessage("Checklist must be an array")
    .custom((checklist) => {
      if (checklist.length === 0) {
        throw new Error("Checklist cannot be empty");
      }
      const idSet = new Set();
      checklist.forEach((item) => {
        const itemIdStr = String(item.itemId).trim();
        if (!itemIdStr || itemIdStr === "" || /^[^a-zA-Z0-9]/.test(itemIdStr)) {
          throw new Error(
            "Checklist items must have valid IDs and must not start with special characters."
          );
        }
        if (idSet.has(item.itemId)) {
          throw new Error("Checklist item IDs must be unique within the task.");
        }
        idSet.add(item.itemId);
        if (!item.text || item.text.trim() === "") {
          throw new Error("Checklist items must have text.");
        }
      });
      return true;
    })
    .run(req);

  // Validate assignTo
  await body("assignTo")
    .optional({ checkFalsy: true })
    .custom((assignTo, { req }) => {
      const creatorId = req.userId;
      let assignToId;
      if (typeof assignTo === "string") {
        if (!mongoose.Types.ObjectId.isValid(assignTo)) {
          throw new Error("Please provide a valid user ID.");
        }
        if (assignTo === creatorId) {
          throw new Error("You cannot assign the task to yourself.");
        }
        assignToId = assignTo;
      } else if (Array.isArray(assignTo)) {
        if (assignTo.length > 1) {
          throw new Error("Only one assignee can be assigned at a time.");
        }
        if (!mongoose.Types.ObjectId.isValid(assignTo[0])) {
          throw new Error("Please provide a valid user ID.");
        }
        if (assignTo[0] === creatorId) {
          throw new Error("You cannot assign the task to yourself.");
        }
        assignToId = assignTo[0];
      } else {
        throw new Error(
          "AssignTo must be a string or an array containing one ID."
        );
      }
      req.assignTo = assignToId;
      return true;
    })
    .run(req);

  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: errors.array()[0].msg,
    });
  }

  next();
};

module.exports = validateUpdateTask;
