const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI, {
      serverSelectionTimeoutMS: 90000,
      socketTimeoutMS: 90000,
    });
    console.log("Connected to MongoDB is Successful");

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB is connected Successfully");
    });

    connection.on("error", (err) => {
      console.log("MongoDB connection error , please check your MongoDB URI");
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectToDB;
