const taskRouter = require("express").Router();

const getAllTasks = require("../controllers/getAllTasks");
const updateTask = require("../controllers/updateTask");
const deleteTask = require("../controllers/deleteTask");
const createTask = require("../controllers/createTask");
const assignAllTask = require("../controllers/assignAllTask");
const validateToken = require("../middlewares/validateToken");
const validateTask = require("../middlewares/validateTask");
const validateUpdateTask = require("../middlewares/validateUpdateTask");
const addPeople = require("../controllers/addPeople");
const getTask = require("../controllers/getTask");

taskRouter.post("/create", validateToken, validateTask, createTask);
taskRouter.get("/", validateToken, getAllTasks);
taskRouter.put(
  "/update/:taskId",
  validateToken,
  validateUpdateTask,
  updateTask
);
taskRouter.post("/assignAll", validateToken, validateUpdateTask, assignAllTask);
taskRouter.delete("/delete/:id", validateToken, deleteTask);
taskRouter.post("/addPeople", validateToken, validateUpdateTask, addPeople);
taskRouter.get("/getTask/:taskId", getTask);

module.exports = taskRouter;
