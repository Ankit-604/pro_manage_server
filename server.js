const express = require("express");
const cors = require("cors");
const connectToDB = require("./config/db");
require("dotenv").config();
const userRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);
app.get("/", (req, res) => {
  res.send("Hello Viewer, this is a server part of project - Pro Manager");
});

connectToDB();
app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
});

app.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  const errorMessages = {
    EACCES: `${bind} requires elevated privileges`,
    EADDRINUSE: `${bind} is already in use`,
  };

  if (errorMessages[error.code]) {
    console.error(errorMessages[error.code]);
    process.exit(1);
  } else {
    throw error;
  }
});
