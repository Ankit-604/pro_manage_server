const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

dotenv.config();

const app = express();
const port = process.env.PORT || 6002;

// Log streams
const logStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
const errorStream = fs.createWriteStream(path.join(__dirname, "error.txt"), {
  flags: "a",
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);

// Logger middleware
app.use((req, res, next) => {
  const now = new Date();
  const time = ` ${now.toLocaleTimeString()}`;
  const log = `${req.method} ${req.originalUrl} ${time}`;
  logStream.write(log + "\n");
  console.log(log);
  next();
});

// Error handling middleware
app.use((req, res, next) => {
  const now = new Date();
  const time = ` ${now.toLocaleTimeString()}`;
  const error = `${req.method} ${req.originalUrl} ${time}`;
  errorStream.write(error + "\n");
  res.status(404).send("Route not found");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World !");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
