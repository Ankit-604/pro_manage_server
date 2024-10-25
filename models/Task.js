const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },

  priority: { type: String, enum: ["LOW", "MODERATE", "HIGH"], default: "LOW" },
  dueDate: { type: Date, required: false },
  status: {
    type: String,
    enum: ["BACKLOG", "TO DO", "IN PROGRESS", "DONE"],
    default: "TO DO",
  },
  checklist: [
    {
      text: { type: String },
      checked: { type: Boolean, default: false },
      status: {
        type: String,
        enum: ["COMPLETED", "INCOMPLETE"],
        default: "INCOMPLETE",
      },
    },
  ],
  userEmail: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Task", TaskSchema);
