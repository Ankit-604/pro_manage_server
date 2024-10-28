const Task = require("../models/Task");
const User = require("../models/User");

const addPeople = async (req, res) => {
  try {
    const userId = req.userId;
    const userEmail = req.body.userEmail
      ? req.body.userEmail.toLowerCase().trim()
      : null;

    console.log("Received userEmail:", userEmail);

    if (!userEmail) {
      return res.status(400).json({
        error: true,
        message: "User email is required.",
      });
    }

    let assignee = await User.findOne({ email: userEmail });

    if (!assignee) {
      // If the user doesn't exist, create a new user with only the email and default values for name and password
      assignee = new User({
        email: userEmail,
        name: "Default Name", // Provide a default name
        password: "defaultpassword", // Provide a default password (make sure to hash it if using in production)
      });

      try {
        await assignee.save();
        console.log("New assignee created:", assignee);
      } catch (saveError) {
        console.error("Error saving new assignee:", saveError.message);
        return res.status(500).json({
          error: true,
          message: "Error creating new user. Please try again later.",
        });
      }
    } else {
      console.log("Assignee Found:", assignee);
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

    try {
      await Task.updateMany(
        { createdBy: userId },
        { $addToSet: { assignedTo: assignee._id } }
      );
    } catch (updateError) {
      console.error("Error updating tasks:", updateError.message);
      return res.status(500).json({
        error: true,
        message: "Error assigning tasks. Please try again later.",
      });
    }

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
